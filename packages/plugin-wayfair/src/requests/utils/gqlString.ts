/**
 * Renders a value as a GraphQL string literal, escaped. Interpolating a caller's
 * string straight into a query lets one `"` end the literal and hand Wayfair the
 * remainder as query text: `2026-01-01", field: poDate, equals: "` rewrites the
 * filter it was meant to fill in. GraphQL's string escapes are JSON's.
 *
 * Variables would be the better way where the schema's own type names are known,
 * but declaring `$fromDate` means naming the scalar Wayfair expects, and guessing
 * that wrong fails the whole query.
 */
const gqlString = (value: string): string => JSON.stringify(value);

export default gqlString;
