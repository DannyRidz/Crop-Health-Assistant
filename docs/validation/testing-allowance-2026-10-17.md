# Farmer and judge testing allowance

The user reported that check limits prevented testing on 17 October 2026. The old six assess requests per one hour session allowed only three ordinary two phase checks. Two translations per hour also blocked bilingual repetition. With TRUST_PROXY=false, the ten model requests per ten minutes address limiter was shared across all visitors. This was an intentionally conservative protection that was too restrictive for multiple testers.

The revised policy provides 12 assess requests, 12 translations and 60 guidance updates per session per ten minute allowance window. A normal two phase check consumes two assess requests, so this permits up to six ordinary checks before retries, subject to shared capacity and provider availability. Each case can use preliminary and final translation. The signed one hour session and 30 minute envelopes are unchanged. Renewing the allowance retains the session, photos, answers and results. Failed dispatches still count. Shared safety buckets admit 60 model requests and 30 new sessions per ten minutes; forwarded address trust remains false. One request per session and two model requests per instance remain. These are fixed windows starting on first use, not a rolling per minute quota or guaranteed spend cutoff.

The existing remaining value still counts screening requests, not completed cases. Cooldowns of a minute or more are rounded upward and shown in minutes rather than raw seconds. Both languages use the same duration format, without new translated instructions.

Lint, type checks and 129 deterministic tests pass. New cases prove renewal without session loss, several testers sharing a larger bucket, quota rejection without charging rejected work, and preservation of concurrency controls. Existing route tests were updated for the new cap and continue to verify failed dispatch accounting and absence of provider calls after exhaustion. These use mocked provider responses, not paid requests or agricultural evidence. The first full test run caught two assertions tied to the old six request cap; those expectations were updated and the full suite passed.

No new purchases, automatic reload, minimum instances, IAM roles or credential changes are proposed. The approved USD 20 allowance remains unchanged; this adjustment allows its consumption at a faster rate during testing. Cloud deployment explicitly keeps maximum one instance. No simulator or local production build was used.

## Live verification

Remote source hashes matched the checked local files. Build `4a17b280-6bae-42ac-a8c6-48018e15ec81` succeeded; revision `coffee-health-demo-00034-sqf` serves 100 percent of traffic. A revision readback verified `autoscaling.knative.dev/maxScale` is 1. Secrets, origin and trust settings were preserved.

A public HTTP boundary check used deliberately invalid metadata, rejected before provider dispatch. The first session reported 12 remaining requests; twelve dispatches reached normal input validation (422), the thirteenth returned 429 with a 598 second retry, and another session then reached normal validation rather than the old shared ten request block. This incurred no model calls and is software boundary evidence. Time renewal was verified with deterministic timers, not by waiting ten minutes in the live browser.

A separate real public BRACOL 1741 journey completed preliminary and final Gemini requests, with Brazil selected and four unknown history answers. The result and English PDF download succeeded. This is integration evidence, not agricultural validation. The downloaded report is retained with attribution in ignored `output/pdf/testing-allowance/`.

Existing tabs can retain an old client countdown. Reloading loads the new client but clears the temporary current case; save any available report or retain original photos first. Deployment restarts temporary server counters, so an older session may need to be recreated by the app.

Real case reference: `9fbce541`. The downloaded English file parsed successfully as a five page PDF. The public app reported PDF readiness after export. No PDF layout implementation changed in this slice.
