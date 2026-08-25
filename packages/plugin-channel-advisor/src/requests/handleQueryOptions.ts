import { escapeODataString } from "./odata.js";
import { RequestError } from "@dianemo/core";
import { DateTime } from "luxon";
import {
  CAQueryFilterGroup,
  CAPagingQueryOptions,
  CAQueryOptions,
  CAExpand,
  CAQueryFilter,
} from "./types.js";

/**
 * The OData subset this file emits, option by option, is written out in
 * docs/channel-advisor-api.md#query-option-grammar.
 */

const handleQueryOptions = <F, E extends CAExpand | undefined>(
  options?: CAQueryOptions<F, E> | CAPagingQueryOptions<F, E>
) => {
  if (!options) return "";
  const params: string[] = [];
  if (options.expand) params.push(flattenExpand(options.expand));
  if (options.select) params.push(`$select=${options.select.join(",")}`);
  if (
    ["filter", "skip", "top", "orderBy", "count", "exported"].some(
      (k) => k in options
    )
  ) {
    params.push(...handlePagingQueryOptions(options));
  }
  const filtered = params.filter((p) => p);
  if (!filtered.length) return "";
  return `?${filtered.join("&")}`;
};

const flattenExpand = (expand: CAExpand) => {
  const array: string[] = [];
  if (expand.options) array.push(...expand.options);
  if (expand.children) {
    for (const key in expand.children) {
      array.push(`${key}(${flattenExpand(expand.children[key])})`);
    }
  }
  if (!array.length) return "";
  return `$expand=${array.join(",")}`;
};

const handlePagingQueryOptions = <F, E extends CAExpand | undefined>(
  options: CAPagingQueryOptions<F, E>
) => {
  const { filter, skip, top, orderBy, count, exported } = options;
  const params: string[] = [];
  if (filter) params.push(`$filter=${parseQueryFilterGroup<F>(filter)}`);
  if (skip) params.push(`$skip=${skip}`);
  if (top) params.push(`$top=${top}`);
  if (orderBy) params.push(`$orderby=${orderBy.field} ${orderBy.direction}`);
  if (count) params.push(`$count=true`);
  if (exported !== undefined) params.push(`exported=${exported}`);
  return params;
};

/**
 * `depth` is how many `Any` lambdas this group is nested inside, and
 * `fieldPrefix` is prepended to every field reference in it. Both are recursion
 * state, not caller input.
 */

const parseQueryFilterGroup = <F>(
  filterGroup: CAQueryFilterGroup<F>,
  depth = 0,
  fieldPrefix = ""
): string => {
  const { childRecordName, type } = filterGroup;
  const filters = filterGroup.filters.filter(
    (f) => "operator" in f
  ) as CAQueryFilter<F>[];
  const groups = filterGroup.filters.filter(
    (f) => "type" in f
  ) as CAQueryFilterGroup<F>[];
  // The lambda variable is carried down as a per-field prefix, not prepended once
  // to the joined string: that qualified only the first condition and left the
  // second resolving against the parent entity, where the field does not exist.
  const variable = childRecordName ? lambdaVariable(depth) : undefined;
  const prefix = variable ? `${variable}/` : fieldPrefix;
  const array = parseQueryFilters(filters, prefix);
  for (const group of groups) {
    array.push(
      `(${parseQueryFilterGroup(
        group as CAQueryFilterGroup<F>,
        childRecordName ? depth + 1 : depth,
        prefix
      )})`
    );
  }
  const parsed = `${array.join(` ${type} `)}`;
  if (!childRecordName) return parsed;
  // The collection being ranged over is itself a field of whatever scope
  // encloses this group, so it takes the *inherited* prefix; only the conditions
  // inside the lambda take the new variable.
  return `${fieldPrefix}${childRecordName}/Any (${variable}: ${parsed})`;
};

/**
 * A nested `Any` needs a variable of its own: reusing the enclosing one makes
 * the inner range variable shadow the outer, so a condition meant for the parent
 * collection silently reads the child's. `c` is kept for the single-level case,
 * which is the form ChannelAdvisor's own examples use.
 */

const lambdaVariable = (depth: number) => (depth ? `c${depth}` : "c");

const parseQueryFilters = <F>(
  filters: CAQueryFilter<F>[],
  fieldPrefix = ""
) => {
  return filters.map((filter) => {
    const { field, operator, value, func } = filter;
    const reference = `${fieldPrefix}${String(field)}`;
    const target = func ? `${func}(${reference})` : reference;
    return `${target} ${operator} ${formatFilterValue(value)}`;
  });
};

/**
 * A `DateTime` renders as a full `Edm.DateTimeOffset` in UTC and unquoted, which
 * is the form ChannelAdvisor's docs use (`CreateDateUtc gt 2016-01-01T00:00:00Z`).
 * Truncating it to a date silently widened an hourly incremental sync to
 * everything since midnight, re-reading up to a day of records each run.
 *
 * `null` is the bare literal, the only way to compare against an unset field.
 */

const formatFilterValue = (value: CAQueryFilter<unknown>["value"]) => {
  if (value === null) return "null";
  if (value instanceof DateTime) {
    const iso = value.toUTC().toISO({ suppressMilliseconds: true });
    if (!iso) {
      throw new RequestError(
        "CHA_0055",
        "Channel Advisor filter received an invalid luxon DateTime",
        { metadata: { reason: value.invalidReason } }
      );
    }
    return iso;
  }
  if (typeof value === "string") return `'${escapeODataString(value)}'`;
  return String(value);
};

export default handleQueryOptions;
