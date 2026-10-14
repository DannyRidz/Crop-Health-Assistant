# Scope: Crop Health Assistant

**Date:** 12 October 2026, Asia/Brunei
**Approval:** Approved by you on 12 October 2026. M0 and M1 implementation are authorised. You approved USD 20 total for this MVP, including an initial USD 5 Gemini credit purchase that you will make later this week, not now. No credit purchase is authorised for immediate execution. Automatic top ups stay off. The USD 20 allocation excludes older projects and is a spending target, not a guaranteed service cutoff.

A globally accessible coffee screening assistant lets coffee farmers worldwide upload leaf photos, answer a few questions, understand visible symptoms and download a report for a local agricultural officer. PNG farmers are the first validation group, not the only intended users. Validation is planned, not yet completed; worldwide agricultural validation is not claimed.

**Build approach:** Tracer Bullet, prove one real journey through the interface, screening service, checked result, report and deployment before adding breadth.
**Workflow:** Beta, proportionate real app verification followed by meaningful automated checks. This is a recommendation because wrong condition or guidance selection matters even in a prototype.

## At a glance

| # | Feature | Phase | Status |
|---|---|---|---|
| 1 | Stack and architecture | Foundation | done |
| 2 | Project context and tooling | Foundation | done |
| 3 | Assessment data and state | Foundation | in-progress |
| 4 | Interface and language foundation | Foundation | in-progress |
| 5 | One complete coffee journey | First milestone | done |
| 6 | Bounded questions and checked results | Broaden the journey | in-progress |
| 7 | Reviewed guidance and translations | Content gate | planned |
| 8 | Phone experience and complete reports | Completion | in-progress |
| 9 | Evaluation and submission | Delivery | planned |

## Foundations

### 1. Stack and architecture, done

Keep one application with temporary processing and a narrow external AI integration.

**Done when:** the approved stack boots, builds and can run on the selected cloud service.

- [x] Confirm the approved decision (spec): `/architect stack and architecture`
- [x] Build the local scaffold: `/develop M0`
- [x] Verify local build and running health endpoint: `/check verify M0`
- [x] Prove cloud execution with the real journey in M1, AC-17

Code: `package.json`, `next.config.ts`, `src/app/`.

Spec: [technical design](../specs/0001-coffee-mvp/technical.md).

### 2. Project context and tooling, done

Capture conventions from the real scaffold after approval, then establish type checking, linting and a reproducible build.

**Done when:** project instructions describe the actual stack and the required checks run successfully.

- [x] Capture project context after scaffold: `/audit`
- [x] Establish lint, typecheck and deterministic test commands: `/develop tooling`
- [x] Run the required foundation checks: `/test M0`

Code: `AGENTS.md`, `eslint.config.mjs`, `tsconfig.json`, language tests and `package-lock.json`.

### 3. Assessment data and state, in-progress

Keep one assessment in the open tab and remember only language preference on the device.

**Done when:** edits invalidate old screening results as appropriate, country or region changes recheck guidance without losing observations, language changes preserve data and refresh behaviour is explained, including AC-19.

- [x] Confirm the approved decision (spec): `/architect assessment data and state`

Spec: [technical design](../specs/0001-coffee-mvp/technical.md).

### 4. Interface and language foundation, in-progress

Use one coherent phone layout and a central collection of interface translations from the first build.

**Done when:** both language modes cover the first journey, controls are accessible and review status is truthful.

- [x] Confirm the approved decision (spec): `/architect interface and language foundation`
- [x] Build welcome page, tokens, central locale text and saved language preference, M0
- [x] Verify both languages at 320, 360, 390 and 1280 px, keyboard toggle and reload
- [x] Build actual assessment screens and preserve assessment state during language changes, M1
- [ ] Complete fluent translation review, AC-12

Code: `src/components/screening.tsx`, `src/content/`, `src/lib/use-language.ts`.

Specs: [frontend](../specs/0001-coffee-mvp/design.md), [language and guidance](../specs/0001-coffee-mvp/language-guidance.md).

## First milestone

### 5. One complete coffee journey, done

Upload one permitted coffee leaf photo, make real Gemini requests, answer starter questions, read a checked outcome and download a report from a Cloud Run prototype.

**Done when:** a real photo completes this narrow journey in English and Tok Pisin mode through a public URL without an app country restriction, with regional guidance or a clear limitation and local officer referral. Pending translations are visibly marked in the internal demo, AC-17 and AC-19.

- [x] Confirm the approved decision (spec): `/architect one complete coffee journey`

Specs: [product journey](../specs/0001-coffee-mvp/product.md), [technical design](../specs/0001-coffee-mvp/technical.md).

## Broaden and complete

### 6. Bounded questions and checked results, in-progress

Support two photos, four starter questions and one optional follow up round of at most two questions, with clear failure and uncertainty handling.

**Done when:** all four screening statuses, input edits, stale requests and retries satisfy AC-3 through AC-8.

- [x] Confirm the approved decision (spec): `/architect bounded questions and checked results`

Spec: [technical design](../specs/0001-coffee-mvp/technical.md).

### 7. Reviewed guidance and translations, planned

Enable one condition only after content, image permissions and evaluation gates pass. Record guidance applicability by country or broad region and identify guidance reviewed specifically for PNG. Agricultural review and Tok Pisin review are separate.

**Done when:** only guidance eligible for the farmer's stated region is shown, PNG review scope is clear and missing regional guidance or translations produce explicit fallback behaviour, AC-9 through AC-12 and AC-19.

- [x] Confirm the approved decision (spec): `/architect reviewed guidance and translations`

Spec: [language and guidance](../specs/0001-coffee-mvp/language-guidance.md).

### 8. Phone experience and complete reports, in-progress

Refine the complete journey for phone use, slower connections, long text and report downloads.

**Done when:** phone and desktop checks pass in both languages and reports preserve the checked evidence, AC-13 through AC-15.

- [x] Confirm the approved decision (spec): `/architect phone experience and reports`

Specs: [frontend](../specs/0001-coffee-mvp/design.md), [verification](../specs/0001-coffee-mvp/verification-delivery.md).

### 9. Evaluation and submission, planned

Record actual outcomes, deploy the final prototype and prepare an honest submission package.

**Done when:** acceptance criteria pass, permissions and limitations are recorded, submitted links work and submission confirmation is retained, AC-16 through AC-18.

- [x] Confirm the approved decision (spec): `/architect evaluation and submission`

Spec: [verification and delivery](../specs/0001-coffee-mvp/verification-delivery.md).

## Deferred

Sweet potato, taro, aibika and cassava screening. Coffee flowers, berries and stems. A second condition until the first is complete and independently evaluated. Other languages and additional guidance reviewed for specific regions beyond the initial PNG collection. Accounts, subscriptions, payments, permanent case history, custom model training, dashboards, marketplaces, automated officer contact, advanced analytics, full offline operation and enterprise infrastructure.

## Legend and next action

The design is approved. M0 is complete locally. M1 local screens, server integration, request controls, region selection and PDF export are built. On 12 October 2026, real API preliminary and final screening, PNG guidance selection and Tok Pisin translation completed with a synthetic green rectangle. A manual retry was needed after a temporary service error. The checked result was unable to assess, with no condition claim or approved guidance. English and draft Tok Pisin PDF contents verified geography and referral. This is provider and export evidence for an unsupported sample, not agricultural accuracy or a complete browser journey. The public Cloud Run demo is deployed with screening disabled. A permitted coffee case and the complete real cloud screening journey remain unverified, so M1 is still in progress.

Next: finish the M1 real integration gate. Gemini access is configured locally; project cloud billing is enabled, but paid Gemini access has not been verified. The approved MVP allowance is USD 20 total; the initial USD 5 Gemini purchase is deferred until you make it later this week. Current Gemini quota, permitted images and cloud secret setup remain dependencies for live screening. A direct final request confirmed provider HTTP 429, and the rebuilt app now preserves that status instead of masking it as 503; all 58 tests and the build pass. You reopened the existing paid Cloud billing account, and the MVP project is now linked. A USD 20 monthly project alert budget is saved at 50, 90 and 100 percent. The payment warning cleared after you updated the card. The [public Cloud Run demonstration](https://coffee-health-demo-952364218688.asia-southeast1.run.app) is deployed as revision coffee-health-demo-00001-8wl with screening disabled and no cloud secrets. Public access, health HTTP 200, the expected disabled session response, local photo preparation, language switching and an incomplete PDF were verified. Not sure, PNG and Brunei region choices preserve access and show guidance limitations. This does not complete AC-17, which requires the real AI journey. Agricultural and fluent translation review are also pending. The [approved specification](../specs/0001-coffee-mvp/index.md) governs implementation.

14 October update: USD 5 Gemini prepay and automatic reload off were verified. A real local Gemini test succeeded. The teammate supplied BRACOL candidates, recorded in [the source record](../data-sources/bracol.md). Two approved cloud secrets are configured with access scoped to the runtime account, and revision coffee-health-demo-00002-x6t passed health and disabled session checks. M1 remains in progress pending selected image provenance and the complete real public coffee journey; agricultural and Tok Pisin reviews are still pending.

M1 completion, 14 October 2026: the exact original BRACOL 671.jpg match is verified, and assessment 78ca06f5-1a5f-432b-af01-d044cea864c3 completed the public Cloud Run journey with real preliminary and final Gemini output, four Not sure answers, Brazil context, missing regional guidance and English plus draft Tok Pisin PDF exports. An unknown region PDF and simulated PNG context were also checked without another screening request. The result is unable to assess because no supported condition has passed review. This completes the narrow M1 software demonstration and AC-17, not the later agricultural, translation review or release criteria. Cloud revision coffee-health-demo-00003-sdk has screening enabled, paid provider mode and maximum one instance. Next is M2 boundary verification, while agricultural and fluent language resources remain pending.

M2 progress, 14 October 2026: 68 tests and all local checks passed. The corrupt local photo error was fixed and deployed in revision coffee-health-demo-00004-gz8. Public corrupt and oversized upload checks and a real two photo preliminary request passed. Controlled browser retry retained photos and answers, and translation failure produced explicit English fallback. Served local API checks proved upload rejection and exhausted quota without provider calls. Four status headings were exercised only with synthetic responses. Feature 6 remains in progress: reviewed condition rules, live supported status selection and reviewed bilingual follow up questions still depend on the content gate. Do not mark M2 complete from these synthetic checks. Next dependency is agricultural review of the narrow condition and question bank, while fluent Tok Pisin review remains pending.
