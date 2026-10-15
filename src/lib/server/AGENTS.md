# Temporary server processing

This area implements the [technical design](../../../docs/specs/0001-coffee-mvp/technical.md). The route handlers in `src/app/api/` call these modules. Run the root `npm run check` before changing their contracts.

- `http.ts` checks origin against the actual incoming host and scheme or the exact configured HTTPS PUBLIC_APP_ORIGIN. It rejects foreign or missing origins and cross site requests, caps streamed body bytes and returns translated error keys without raw errors. Do not trust arbitrary forwarded host values.
- `session.ts` signs expiring, purpose and session bound envelopes. Quotas contain metadata only and live in process memory. They reset on restart and cannot guarantee a global spending cap.
- `images.ts` independently decodes, validates and reencodes submitted photos. Never trust filenames or MIME headers, fetch photo URLs, write photos to disk or log farmer content.
- `gemini.ts` uses the official SDK with `store: false`, no retained conversation and no automatic retry. Region is excluded from screening and translation prompts. Logs contain request metadata, token totals, numeric provider status and fixed failure categories only. Provider quota returns 429, SDK timeouts return 504, and raw provider messages never enter logs or responses.
- `policy.ts` validates photo and observation references, derives visual findings and permits explicitly qualified AI cause hypotheses under the user's 15 October authorisation. Independently evaluated registry conditions remain disabled. Enabling a reviewed registry flag later still requires reviewed feature rules and evaluation.
- Tests mock the Gemini SDK boundary. A passing synthetic case is not proof of provider integration or agricultural accuracy.
- Screening prompt version coffee-analysis-6 permits tentative final cause explanations with evidence, uncertainty, next observation checks and fixed diagnostic source IDs. Preliminary output cannot contain hypotheses. It uses everyday farmer wording and excludes chemical prescriptions, health certification and invented sources.

Drafted by sync from the introducing change, worth a quick human pass.

The signed temporary session cookie is __session, required for Firebase Hosting to forward it to Cloud Run. Keep HttpOnly, Secure in production and SameSite strict.

Schema 2 signed results bind schema, prompt, policy and condition registry versions. Guidance has a separate content version. Include all generated cause and conflict strings in canonical text hashes and translation key validation. A photo digest and separate photo revision bind preliminary and final uploads without rejecting normal starter answer edits. Mentioning possible pesticide injury or spray history is allowed; chemical instructions and dosages are rejected. Structural checks do not establish agricultural correctness.
