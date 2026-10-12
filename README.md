# Crop Health Assistant

A globally accessible coffee screening assistant, initially intended for validation with PNG users. Validation is still pending. Coffee leaves, English and Tok Pisin are the only MVP crop, plant part and languages. The app does not confirm disease or claim worldwide agricultural validation.

## Current milestone

M1 local implementation is built. It includes photo preparation, four starter questions, optional country context, server Gemini integration, checked observations, regional guidance selection, language fallback and a local PDF report. The condition registry is disabled, the reviewed guidance collection is empty and every Tok Pisin fixed text key is a draft. No treatment or supported disease claim is enabled.

M1 is still in progress. A Gemini key is configured locally. Cloud billing is now enabled for the project; paid Gemini access has not yet been verified. On 12 October 2026, a real API journey using a synthetic green rectangle completed preliminary screening, four starter answers, final screening, PNG guidance selection and generated Tok Pisin translation. A temporary final request failure required a manual retry. The checked result was unable to assess with no condition claim or approved guidance. English and draft Tok Pisin PDFs were generated from that real result, with geography and local officer referral verified. This proves provider and report integration for an unsupported synthetic sample, not a complete browser journey or agricultural accuracy. Permitted coffee image evaluation and a complete real browser journey remain pending. The public Cloud Run demonstration is now deployed with screening disabled. Google documents a no billing Starter Tier for eligible accounts, but the existing paid billing account has now been reopened by you. The MVP project is now linked to your reopened paid billing account. The payment card warning cleared after you updated the card. You approved USD 20 total for the MVP, with USD 5 Gemini credits to be purchased by you later this week, not now. Automatic top ups remain off; no credits have been purchased. Cloud Build, Artifact Registry and Cloud Run resources have now been created and may incur charges. This is an internal demonstration, not a farmer release.

Provider failure investigation on 12 October 2026: the exact final screening function called directly outside the app returned Gemini HTTP 429. The app had mapped provider errors to generic 503 responses. This classification bug is fixed: provider quota returns 429 with a quota message and a 60 second minimum retry cooldown, without promising quota recovery at that time. SDK timeout messages now return 504. Logs record only request metadata, numeric provider status and a fixed failure category, never provider message text or case content. Two regression tests cover these failures and sensitive detail exclusion. All 58 tests, lint, TypeScript and production build passed. A real request through the rebuilt app returned 429 with code quota, confirming the fix. The successful complete journey remains blocked by current provider quota and permitted coffee images. The public demo is deployed with screening disabled. Earlier high demand evidence remains a separate observation; not every historic 503 can be assigned the same cause.

Latest M1 recheck on 12 October 2026: lint, TypeScript, all 56 tests and production build passed. A real browser upload and preliminary Gemini response worked after retry; final requests returned service errors and retained inputs. An incomplete PDF downloaded from the browser and its contents verified the missing result, unknown region and local officer referral. Layout had no horizontal overflow at 320, 360, 390 and 1280 pixels on the exercised screen. A stale remaining attempt count after errors was fixed by withholding that count until a current server response is available, and a controlled browser regression verified the fix. Controlled language switching preserved the photo and all four answers and showed explicit English fallback. A successful complete live browser journey, permitted coffee image validation, full accessibility coverage and a complete real Cloud Run screening journey remain unverified.

## Run locally

Use Node.js 24 and npm:

```sh
nvm use
npm ci
npm run dev
```

Open [the local app](http://localhost:3000). With no credentials, you can prepare photos locally, see the explicit screening unavailable response and download a report documenting an incomplete attempt. No invented AI result is substituted. `/api/health` returning ready means the app responds, not that screening is enabled.

## Configuration

Copy `.env.example` to ignored `.env.local` when actual provider access is arranged. Set `GEMINI_API_KEY` privately and generate an independent random `SESSION_SIGNING_SECRET` of at least 32 characters. Never commit either secret or use a browser exposed environment variable for it.

`SCREENING_ENABLED` defaults to false. Set it to true only after access, data permissions and the spending decision are settled. `GEMINI_SERVICE_TIER=demo` allows only permitted sample data, with explicit consent and the free service notice. `paid` describes an actually paid Gemini service and must never be set merely to hide that notice. All cases remain labelled demonstrations until the content and release gates pass. Never send private farmer data to the free service.

`GEMINI_MODEL` defaults to `gemini-3.8-flash`. Requests use the official SDK Interactions API, stateless processing with `store: false`, a 45 second deadline and no automatic retry. The service still applies its own processing and retention terms.

`TRUST_PROXY=false` is the local default. It uses one conservative shared address bucket. Enable trusted forwarded address limiting only behind the verified Google Cloud Run ingress. Geography is always chosen explicitly by the farmer, never inferred from these headers.

## Temporary data and limits

Only language preference is stored on the device. Photos, answers, region, results and translation variants remain in the open tab and disappear on refresh or close. The server processes photos in memory, reencodes them without metadata and does not write case data to a database, disk or logs. Downloads remain on the farmer's device.

Photos accept JPEG, PNG or WebP, at most two originals of 10 MiB and 40 megapixels each. The browser creates JPEG copies with a long edge at most 1600 pixels and 2 MiB each. The server independently verifies decoding and enforces a streaming body limit of 6 MiB.

Each anonymous session permits six screening attempts, two translation attempts and twenty guidance selections per hour. Failed dispatches consume allowance. One request runs per session and at most two Gemini requests run per instance. Temporary counters reset on restart and do not create a global hard spending cap. The screening switch is the manual shutoff.

## Checks and remaining verification

```sh
npm run check
```

This runs lint, TypeScript, Vitest and the production build. Tests use synthetic policy and image fixtures with Gemini mocked only at the SDK boundary. They do not establish agricultural accuracy. Browser checks used the real standalone app for local photo preparation, the disabled service path and a PDF download. A separate temporary HTTP harness exercised the complete screen flow, language fallback and region changes without real AI calls.

`npm run build` also copies static assets and the licensed font into the standalone output. `npm start` runs that production layout. Local `.env.local` is read during the build and development; container secrets are supplied at runtime. Rebuild after local configuration changes.

Remaining checks include real Gemini evaluation with permitted images, all M2 policy states, complete keyboard and 200 percent zoom coverage, fluent Tok Pisin review and a complete real cloud screening journey. Production dependency audit reported no advisories on 12 October 2026; development lint dependencies reported advisories. Recheck dependencies and the scheduled framework security update before public deployment, as required by the technical spec.

## Deployment preparation

`Dockerfile` builds the standalone app, includes static assets and the report font, runs as a nonroot user and listens on port 8080. `.dockerignore` excludes local credentials, case artifacts and test fixtures. The standalone layout has run locally. Cloud Build successfully built this container on 12 October 2026; the container CLI remains unavailable locally.

After Google access and spending approval, use the selected Google Cloud Run project with secrets from Google Secret Manager, public access without an app country restriction, minimum zero and maximum one instance, one CPU, 512 MiB initial memory and a 60 second timeout. Measure resource needs and token usage rather than claiming those settings guarantee a spending ceiling. Confirm budget alerts and model quotas before enabling screening. The initial demo has been deployed with screening disabled and no secrets. Secret Manager setup and paid Gemini verification remain pending.

## Plan

Read the [approved plan](docs/specs/0001-coffee-mvp/index.md), [current scope](docs/scope/scope.md) and [build sequence](docs/specs/0001-coffee-mvp/verification-delivery.md). The next M1 gate is a successful complete provider journey, then one permitted coffee case through screening and PDF, followed by verification of that complete journey on the public deployment. Content approval remains a separate gate.

## Third party attribution

Dependency packages retain their licences and metadata. Reports embed Noto Sans Regular, obtained from the [official Noto font repository](https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSans), under the SIL Open Font License in `public/fonts/OFL.txt`. The interface uses Arial and sans-serif fallback. No third party coffee image is bundled. If a farmer enters a character unsupported by the report font, PDF export fails clearly and the print view preserves the original text. Source organisations are not project partners, and Google use does not imply endorsement.


Cloud deployment verified on 12 October 2026: [open the public demonstration](https://coffee-health-demo-952364218688.asia-southeast1.run.app). Service `coffee-health-demo` in `asia-southeast1` runs revision `coffee-health-demo-00001-8wl` with 100 percent of traffic. Cloud Build `fcbe1ee1-af44-4997-8d16-36e187d806bb` succeeded. Public `allUsers` invoker access and ingress `all` are configured, with no app country restriction. The approved script sets minimum zero and the service maximum is one instance. Runtime inspection verified one CPU, 512 MiB, request based CPU allocation, startup CPU boost off, concurrency eight and timeout 60 seconds. `SCREENING_ENABLED=false`; no Gemini key or signing secret is configured. The dedicated runtime account has no project role bindings or secret access. The approved build account has the Cloud Run Builder role. `.gcloudignore` excludes local secrets and generated files from source uploads.

Live verification: unauthenticated health returned HTTP 200 with ready true. Session creation returned the expected HTTP 503 disabled response. Browser photo preparation with a synthetic rectangle worked; attempting screening retained the photo and explicitly reported that no result was produced. English and draft Tok Pisin switching retained the photo. Region choices Not sure, PNG and Brunei were exercised without access restrictions, with explicit missing guidance and review limitations. The English PDF downloaded from the live app has two pages and records Not sure, the incomplete attempt, local officer referral and pending PNG and worldwide validation. The report screen had no horizontal overflow at 390 pixels. These checks verify the disabled public demonstration, not a complete real AI journey or agricultural accuracy. A fresh production dependency audit reported zero advisories.

A USD 20 monthly alert budget named Crop Health Assistant MVP USD 20 is saved for Default Gemini Project only, with actual spend alerts at 50, 90 and 100 percent. This is not automatic spend enforcement and does not replace the total hackathon allowance. No Gemini credits have been purchased. Initial USD 5 remains deferred until you purchase it. Next: configure cloud secrets after paid access is available, verify actual model quota, then enable and exercise one permitted coffee case through the complete public journey. M1 remains in progress.

Gemini access check on 12 October 2026: Google AI Studio lists the linked billing account as Paid 1, but explicitly states that prepay is required and no prepayment method is set up. Paid tier recognition does not mean requests are funded. The user must complete the initial USD 5 prepay setup and purchase; no purchase or automatic top up was initiated. Public screening stays disabled until usable Gemini access and cloud secrets are verified.
