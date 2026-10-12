# Temporary server processing

This area implements the [technical design](../../../docs/specs/0001-coffee-mvp/technical.md). The route handlers in `src/app/api/` call these modules. Run the root `npm run check` before changing their contracts.

- `http.ts` checks origin against the actual incoming host and scheme, caps streamed body bytes and returns translated error keys without raw errors.
- `session.ts` signs expiring, purpose and session bound envelopes. Quotas contain metadata only and live in process memory. They reset on restart and cannot guarantee a global spending cap.
- `images.ts` independently decodes, validates and reencodes submitted photos. Never trust filenames or MIME headers, fetch photo URLs, write photos to disk or log farmer content.
- `gemini.ts` uses the official SDK with `store: false`, no retained conversation and no automatic retry. Region is excluded from screening and translation prompts. Logs contain request metadata, token totals, numeric provider status and fixed failure categories only. Provider quota returns 429, SDK timeouts return 504, and raw provider messages never enter logs or responses.
- `policy.ts` validates references and applies the disabled coverage rule. No condition can be claimed in this milestone. Enabling a registry flag later also requires reviewed feature rules, policy updates and evaluation.
- Tests mock the Gemini SDK boundary. A passing synthetic case is not proof of provider integration or agricultural accuracy.

Drafted by sync from the introducing change, worth a quick human pass.
