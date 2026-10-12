# Scope: Crop Health Assistant

**Date:** 12 October 2026, Asia/Brunei
**Approval:** Approved by you on 12 October 2026. M0 implementation is authorised; paid cloud setup still awaits the spending decision.

A globally accessible coffee screening assistant lets coffee farmers worldwide upload leaf photos, answer a few questions, understand visible symptoms and download a report for a local agricultural officer. PNG farmers are the first validation group, not the only intended users. Validation is planned, not yet completed; worldwide agricultural validation is not claimed.

**Build approach:** Tracer Bullet, prove one real journey through the interface, screening service, checked result, report and deployment before adding breadth.
**Workflow:** Beta, proportionate real app verification followed by meaningful automated checks. This is a recommendation because wrong condition or guidance selection matters even in a prototype.

## At a glance

| # | Feature | Phase | Status |
|---|---|---|---|
| 1 | Stack and architecture | Foundation | in-progress |
| 2 | Project context and tooling | Foundation | done |
| 3 | Assessment data and state | Foundation | planned |
| 4 | Interface and language foundation | Foundation | in-progress |
| 5 | One complete coffee journey | First milestone | planned |
| 6 | Bounded questions and checked results | Broaden the journey | planned |
| 7 | Reviewed guidance and translations | Content gate | planned |
| 8 | Phone experience and complete reports | Completion | planned |
| 9 | Evaluation and submission | Delivery | planned |

## Foundations

### 1. Stack and architecture, in-progress

Keep one application with temporary processing and a narrow external AI integration.

**Done when:** the approved stack boots, builds and can run on the selected cloud service.

- [x] Confirm the approved decision (spec): `/architect stack and architecture`
- [x] Build the local scaffold: `/develop M0`
- [x] Verify local build and running health endpoint: `/check verify M0`
- [ ] Prove cloud execution with the real journey in M1, AC-17

Code: `package.json`, `next.config.ts`, `src/app/`.

Spec: [technical design](../specs/0001-coffee-mvp/technical.md).

### 2. Project context and tooling, done

Capture conventions from the real scaffold after approval, then establish type checking, linting and a reproducible build.

**Done when:** project instructions describe the actual stack and the required checks run successfully.

- [x] Capture project context after scaffold: `/audit`
- [x] Establish lint, typecheck and deterministic test commands: `/develop tooling`
- [x] Run the required foundation checks: `/test M0`

Code: `AGENTS.md`, `eslint.config.mjs`, `tsconfig.json`, language tests and `package-lock.json`.

### 3. Assessment data and state, planned

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
- [ ] Build actual assessment screens and preserve assessment state during language changes, M1
- [ ] Complete fluent translation review, AC-12

Code: `src/components/welcome.tsx`, `src/content/`, `src/lib/language.ts`.

Specs: [frontend](../specs/0001-coffee-mvp/design.md), [language and guidance](../specs/0001-coffee-mvp/language-guidance.md).

## First milestone

### 5. One complete coffee journey, planned

Upload one permitted coffee leaf photo, make real Gemini requests, answer starter questions, read a checked outcome and download a report from a Cloud Run prototype.

**Done when:** a real photo completes this narrow journey in English and Tok Pisin mode through a public URL without an app country restriction, with regional guidance or a clear limitation and local officer referral. Pending translations are visibly marked in the internal demo, AC-17 and AC-19.

- [x] Confirm the approved decision (spec): `/architect one complete coffee journey`

Specs: [product journey](../specs/0001-coffee-mvp/product.md), [technical design](../specs/0001-coffee-mvp/technical.md).

## Broaden and complete

### 6. Bounded questions and checked results, planned

Support two photos, four starter questions and one optional follow up round of at most two questions, with clear failure and uncertainty handling.

**Done when:** all four screening statuses, input edits, stale requests and retries satisfy AC-3 through AC-8.

- [x] Confirm the approved decision (spec): `/architect bounded questions and checked results`

Spec: [technical design](../specs/0001-coffee-mvp/technical.md).

### 7. Reviewed guidance and translations, planned

Enable one condition only after content, image permissions and evaluation gates pass. Record guidance applicability by country or broad region and identify guidance reviewed specifically for PNG. Agricultural review and Tok Pisin review are separate.

**Done when:** only guidance eligible for the farmer's stated region is shown, PNG review scope is clear and missing regional guidance or translations produce explicit fallback behaviour, AC-9 through AC-12 and AC-19.

- [x] Confirm the approved decision (spec): `/architect reviewed guidance and translations`

Spec: [language and guidance](../specs/0001-coffee-mvp/language-guidance.md).

### 8. Phone experience and complete reports, planned

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

The design is approved. M0 local scaffold and project tooling are built and checked. Stack cloud execution and the full language enabled journey remain in progress or planned for later milestones. No full MVP acceptance criterion is claimed complete solely from scaffold tests.

Next: M1, one real coffee journey. Google Cloud setup, Gemini access, permitted images and the spending decision remain external dependencies. The [approved specification](../specs/0001-coffee-mvp/index.md) governs implementation.
