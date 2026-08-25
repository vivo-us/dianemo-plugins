# PrintNode API behaviour

Vendor behaviour and verification results that `plugin-printnode` is built
around. Vendor citations are from PrintNode's single API reference page,
<https://www.printnode.com/en/docs/api/curl>, checked 2026-08-25.

## Destructive endpoints are scoped

PrintNode exposes six delete endpoints, and two of them are unscoped:

| function                    | method and path                                         |
| --------------------------- | ------------------------------------------------------- |
| `removeComputersById`       | `DELETE /computers/${computerId}`                       |
| `removeAllComputers`        | `DELETE /computers`                                     |
| `deletePrintJobById`        | `DELETE /printjobs/${printJobId}`                       |
| `deleteAllPrintJobs`        | `DELETE /printjobs`                                     |
| `deletePrinterPrintJobById` | `DELETE /printers/${printerId}/printjobs/${printJobId}` |
| `deleteAllPrinterPrintJobs` | `DELETE /printers/${printerId}/printjobs`               |

The risk this pairing creates is a scoped delete whose id is missing at runtime
collapsing onto its unscoped neighbour — `DELETE /printjobs` wipes the account's
print queue, `DELETE /computers` unregisters every client.

**It cannot happen.** Every scoped path is a template literal, so an `undefined`
id interpolates as the six-character string `"undefined"` and the request goes to
`/printjobs/undefined` — a path that does not exist and 404s. Checked against all
six paths in the 1.0.0 validation sweep: no combination of missing arguments
produces a bare `/printjobs`, `/computers`, or `/printers/…/printjobs`. The two
unscoped deletes are reachable only by calling the function that is named for
them.

TypeScript closes the same hole earlier — every id parameter is `number`, not
`number | undefined` — but the runtime property is the one that holds for a
JavaScript caller, or for a `number` that arrived from an `any`.

**Consequence for a change here:** keep every scoped path a template literal.
Building a path by joining a filtered array of segments, or by dropping a falsy
segment, is what would turn a missing id into the unscoped route.

## Rate limiting

> The API allows 10 requests per second per account.

— "Rate Limiting". The client bucket matches it exactly: `interval: 1000`,
`tokensToAdd: 10`, `maxTokens: 10`. `maxTokens` equal to `tokensToAdd` is the
load-bearing part — a larger cap would let an idle client accumulate credit and
then burst above 10 in a single second.

The limit is **per account**, not per computer or per printer, and the client
name is built per credential set, so one bucket per account is the right
granularity.

## Idempotency on print job creation

`createPrintJob` sends the key as the `X-Idempotency-key` request header. From
the "Idempotency" section (<https://www.printnode.com/en/docs/api/curl#printjob-creating>):
a key uniquely identifies a print job, and if a print job with the same key
already exists **the new print job is ignored**. Keys can be reused after **24
hours**.

Whether the ignored call returns the original print job's id or an error is not
stated in the docs and has not been tested here.

**Consequence for a caller:** a key derived from something that recycles inside a
day (an order line number, a day-of-month) will silently drop a legitimate
reprint. A key that includes the print job's own creation instant will not.

## Print job options

`PrintNodePrintJobOptions.options` is **ignored entirely when RAW printing** —
the `raw_base64` and `raw_uri` content types take none of it. Most options also
have to echo a value the driver reported in `PrinterCapabilities`, and five
behave differently per platform.

| option        | constraint                                 | platform                                                                                                                                                |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bin`         | a name from `capabilities.bins`            |                                                                                                                                                         |
| `collate`     | printer default when unset                 |                                                                                                                                                         |
| `color`       | `false` for grayscale                      | **Windows only honours it on the Engine6 printing backend** — the PrintNode Client's default, changed from the drop-down in the Client's "Printers" tab |
| `copies`      | default 1, maximum `capabilities.copies`   |                                                                                                                                                         |
| `dpi`         | a value from `capabilities.dpis`           |                                                                                                                                                         |
| `duplex`      | printer default when unset                 |                                                                                                                                                         |
| `fit_to_page` |                                            | Windows supports it **only on the Engine6 backend**                                                                                                     |
| `media`       | a name from `capabilities.medias`          | some printers on **macOS ignore it unless `bin` is also set**                                                                                           |
| `nup`         | default 1, a value from `capabilities.nup` | **macOS only**                                                                                                                                          |
| `paper`       | a key of `capabilities.papers`             |                                                                                                                                                         |
| `rotate`      | see below                                  | Windows drivers commonly treat 180 and 270 as 0 and 90                                                                                                  |

`rotate` is **absolute, not relative** to the document's own orientation: 90 on a
PDF that is already landscape leaves it unchanged. Support is uneven — where a
Windows driver treats 180 as 0 and 270 as 90, the page switches between portrait
and landscape but the print is not inverted.

`pages` takes the page-range syntax of an ordinary print dialog:

| value  | prints                   |
| ------ | ------------------------ |
| `1,3`  | pages 1 and 3            |
| `-5`   | pages 1 to 5 inclusive   |
| `-`    | every page               |
| `1,3-` | every page except page 2 |

## `qty` is not `copies`

`qty` delivers the whole document to the print queue that many times;
`options.copies` asks the driver for multiple copies of one delivery. Two
consequences: `qty` does not depend on driver support, so it works where
`copies` is capped at 1 by `capabilities.copies`, and it is **the only way to
produce multiple copies when RAW printing**, where `options` is ignored
altogether. Both default to 1.

## Capability and option shapes

Four of the five type-level defects fixed for 1.0.0 were in
`PrinterCapabilities` and `PrintJobOptions`, and all four came from the same
place: the capability and the print option that share a name do not share a
shape.

| field                           | was              | is                                 | vendor wording                                                                                                          |
| ------------------------------- | ---------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `PrinterCapabilities.nup`       | `string[]`       | `number[]`                         | "the set of values of N for which N-up printing is supported, or a zero-length array if N-up printing is not supported" |
| `PrintJobOptions.nup`           | `number[]`       | `number`                           | "must be one of the values reported by the printer capability property `nup`"                                           |
| `PrinterCapabilities.printrate` | `null \| number` | `null \| PrintRate`                | "this object has two keys — `unit` and `rate`. `unit` can be one of `ppm`, `ipm`, `lmp` or `cpm`. `rate` is a float"    |
| `Paper[name]`                   | `number[]`       | `[number \| null, number \| null]` | "in some circumstances these values are not reported by the printer driver, in which case the array is `[null, null]`"  |

So `nup` is a _set_ on the capability and a _single value_ on the option, and
`printrate` is an object, not the rate on its own. `Paper` needed the tuple for
the nulls: a `number[]` type made `papers["A4"][0]` look safe to do arithmetic
on when the driver may not have reported a width at all.

The fifth defect was `PrintJobState.state`, which was typed as
`PrintJobState` — the interface itself — rather than `JobState`. Self-referential
and unsatisfiable by any real response; nothing constructed the type, which is
why it survived to release.

## `JobState` is not a closed set

> May be one of the "stable" states, i.e. `new`, `sent_to_client`, `done`,
> `error` or `expired`, or some other value.

Responses are typed `JobState`, but the vendor reserves the right to return a
value outside it, so a `switch` over the enum needs a default branch that treats
an unknown state as in-flight rather than as an error.

`done` is also weaker than it reads: it means the job reached the operating
system's print queue, after which the print is outside PrintNode's control and
can still fail at the device.

The two failure states fail in different places. `expired` means the job was
never delivered to a PrintNode Client before its expiry time — nothing was
printed. `error` means the print was attempted and failed at the machine:
hardware failure, driver issues, incorrect printer setup, connectivity.

## The test scale

There is a virtual scale for development, published to the same endpoints as a
real one: **device number 0, device name `PrintNode Test Scale`, on computer 0**.
`createTestScale` (`PUT /scale`) simulates one measurement from it, which is then
readable for **45 seconds** through every scale endpoint and is published to
subscribed websockets. 45 seconds is not a test-only figure — it is how long
PrintNode retains any scale reading, real or simulated.
