# `CurrencyCodes`

`@dianemo/plugin-kit` exports the active ISO 4217 alphabetic codes as an enum
whose member name and value are identical, so `CurrencyCodes.USD` and `"USD"` are
interchangeable.

## Why the accuracy matters more than it looks

The enum is the declared type of _required_ fields in five plugins — fedex, ebay,
ups, unis, walmart — so a wrong member is a wrong amount on a wire that moves
money, and a missing one is a shipment that cannot be quoted at all.

## What was wrong before 1.0.0

The list had 163 members and nothing added after roughly 2011: it had been
transcribed from a pre-2012 table. Specifically:

- **`RMB` was present and `CNY` was absent.** `RMB` is not an ISO 4217 code at
  all — it is the currency's _name_, renminbi. So rating a shipment to China could
  not be expressed without a cast, while a plausible-looking wrong code sat there
  inviting use.
- **12 withdrawn codes were still present**, every one of which has a live
  successor: `BYR`→`BYN`, `MRO`→`MRU`, `SDD`→`SDG`, `SLL`→`SLE`, `STD`→`STN`,
  `TMM`→`TMT`, `VEB`→`VES`, `ZMK`→`ZMW`, `ZWD`→`ZWG`, `ANG`→`XCG`, and `HRK`/`GWP`
  absorbed by `EUR`/`XOF`.
- **27 current codes were missing**, including `CNY` above, the fund codes `USN`
  and `UYW`, the precious metals `XAG`/`XAU`/`XPD`/`XPT`, and the special codes
  `XXX` (no currency) and `XTS` (reserved for testing).

The list is now 178 members. That figure was derived twice — by applying the
removals and additions to the old list, and by writing out the active register
independently — and the two agreed exactly, which is the only reason to trust it.

## Keeping it right

`packages/plugin-kit/test/currencyCodes.test.ts` asserts the shape (name equals
value, three alphabetic characters), the presence of the codes this repo's own
plugins need, the _absence_ of each withdrawn code, the presence of each
withdrawn code's successor, and that `RMB` is gone. It would have caught the
original defect in five lines, which is the argument for it existing.

Re-reconcile against the register when a currency is redenominated. `XCG` (2025,
replacing `ANG`) and `ZWG` (2024, replacing `ZWD`) are the two most recent, and
both were missing here.
