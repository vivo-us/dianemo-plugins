# Labelary

Source for everything here: <https://www.labelary.com/service.html>, checked
2026-08-25.

## Rate limits are published per plan, per second _and_ per day

| Plan     | Per second | Per day |
| -------- | ---------- | ------- |
| Free     | 3          | 5,000   |
| Plus     | 6          | 20,000  |
| Business | 10         | 40,000  |

A token bucket expresses one window, so `plugin-labelary` meters the per-second
one at the free-tier figure: `interval: 1000`, `tokensToAdd: 3`, `maxTokens: 3`.
Two reasons for that choice:

- The per-second limit is what a label batch actually trips. A run of 50 labels
  goes out in well under a second and hits 3/s immediately; it comes nowhere near
  5,000 in a day.
- The free tier is the only safe default for a package that cannot know which
  plan the credentials are on. Raise `tokensToAdd`/`maxTokens` to 6 or 10 to
  match Plus or Business.

**The daily cap stays the caller's to budget.** 5,000/day sustained is 0.06
requests/second — 5000 / 86400 — which is far too slow to make a usable ceiling.
Metering there would throttle every legitimate burst to nothing, so the plugin
does not try.

## Omitting the index segment returns every label as one PDF

The URL's index segment is optional **for PDF requests only**, and omitting it
there is how you ask for the whole batch rather than one label of it: "the
resultant PDF document will contain all labels (one label per page)".

Pinning the segment to `0`, as the plugin originally did, silently returned page
one of a ten-label batch — a correct-looking single label with no indication that
nine more existed.

Every other format renders a single label, so the index still has to be present
to say which one. Hence `convertZPL`'s split: omit the segment when
`format === "application/pdf"` and no index was given, and default to `0`
everywhere else.
