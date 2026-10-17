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
| 9 | Evaluation and submission | Delivery | in-progress |

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

Specs: [technical design](../specs/0001-coffee-mvp/technical.md), [approved useful screening enhancement](../specs/0003-useful-screening-reports.md).

- [ ] Build useful checked results: `/develop useful screening reports`
  - [x] Version 2 evidence and visual finding policy, UR-1, UR-2, UR-6 and UR-10
  - [x] Bounded collection notes and real photo comparison, UR-4 and UR-11
  - [x] AI possible cause explanations and evidence, authorised without an external review prerequisite, UR-12 and UR-13
  - [ ] Reviewed question and condition capability, disabled until content gates pass, UR-5 and UR-7
- [ ] Verify enhanced results: `/check verify useful screening reports`
- [x] Test enhanced policy and contracts: `/test useful screening reports`

### 7. Reviewed guidance and translations, planned

Language review completion, 16 October 2026: the user confirmed that fixed Tok Pisin wording and AI generated sample findings and reports were reviewed. [Scope and provenance record](../content-review/tok-pisin-language-review.md). This supersedes earlier blanket draft and fluent review pending statements. It does not approve agricultural guidance, certify future generated translations or complete farmer validation.

Enable one condition only after content, image permissions and evaluation gates pass. Record guidance applicability by country or broad region and identify guidance reviewed specifically for PNG. Agricultural review and Tok Pisin review are separate.

**Done when:** only guidance eligible for the farmer's stated region is shown, PNG review scope is clear and missing regional guidance or translations produce explicit fallback behaviour, AC-9 through AC-12 and AC-19.

- [x] Confirm the approved decision (spec): `/architect reviewed guidance and translations`

Spec: [language and guidance](../specs/0001-coffee-mvp/language-guidance.md).

### 8. Phone experience and complete reports, in-progress

Refine the complete journey for phone use, slower connections, long text and report downloads.

**Done when:** phone and desktop checks pass in both languages and reports preserve the checked evidence, AC-13 through AC-15.

- [x] Confirm the approved decision (spec): `/architect phone experience and reports`

Specs: [frontend](../specs/0001-coffee-mvp/design.md), [verification](../specs/0001-coffee-mvp/verification-delivery.md), [approved useful report enhancement](../specs/0003-useful-screening-reports.md).

- [x] Build useful report surfaces: `/develop useful screening reports`
  - [x] Farmer summary and complete officer evidence record, UR-2, UR-3 and UR-9
  - [x] Both language exports and regional limitations, UR-8, UR-9 and UR-10
- [ ] Verify enhanced report journey: `/check verify useful screening reports`
- [x] Test enhanced report content: `/test useful screening reports`

15 October verification: [real public report checks](../validation/useful-reports-2026-10-15.md) passed for both supplied photos, English and draft Tok Pisin exports and native Chrome reflow. Physical phone validation, fluent review and the remaining reviewed screening work are still pending, so feature 8 and the broad milestones remain in progress. The [plain English and PDF refinement checks](../validation/plain-report-checks-2026-10-15.md) also passed on revision coffee-health-demo-00016-ltz, including both language exports with actual bold headings and bullet points.

The [four step clarity review](../validation/full-journey-review-2026-10-15.md) passed on revision coffee-health-demo-00022-2hd with both real photos, English and draft Tok Pisin PDF layout checks. Physical phone and fluent language validation remain pending.

Approved treatment slice, 15 October 2026: [specification 0004](../specs/0004-ai-care-and-label-based-treatment.md). Implementation approved after the seven design review fixes.

- [x] Build separate sourced care and verified label eligibility: `/develop AI care and label based treatment`
  - [x] Finite model selections, country filtering and optional advice failure isolation
  - [x] Product conditions, identity and language confirmation with fresh export checks
  - [x] Step 3, report preview and PDF content paths
- [ ] Verify the real public care journey and both PDF languages: `/check verify AI care and label based treatment`
- [x] Test care and label boundaries: `/test AI care and label based treatment`
- [ ] Verify a current real local registration and exact label before claiming live chemical rates complete

Code: `src/lib/ai-advice.ts`, `src/components/advice-panel.tsx`, `src/app/api/guidance/route.ts`, `src/lib/report.ts`. The live chemical catalogue stays empty while qualifying evidence is missing. This does not approve any reviewed guidance entry.

Care release evidence, 15 October 2026: local lint and types pass, 123 deterministic tests pass, and the remote production build succeeded. Revision `coffee-health-demo-00027-567` serves all traffic with maximum one instance. The spotted BRACOL 1741 photo completed real preliminary and final Gemini requests, selected two sourced PG care checks, retained findings across PG, BN and Not sure changes, and exported English and draft Tok Pisin PDFs. Every page of both six page exports was rendered and visually inspected. The mostly green BRACOL 671 control noted an edge notch, proposed no disease and selected no care. The guarded app print opened native preview and returned after cancellation. These are software and source applicability checks, not agricultural or fluent language validation. The broad verification box remains open because the real chemical label journey cannot be exercised with an empty catalogue. Controlled fixtures prove label eligibility and report boundaries only. PDF samples are in ignored `output/pdf/ai-care/`; render checks are in ignored `tmp/pdfs/ai-care/`.

Approved care expansion, 15 October 2026: the user accepted Indonesia, Kenya and Brazil alongside PNG and requested a selector limited to these four countries. These are content coverage locations, not completed validation groups. English and draft Tok Pisin remain the only MVP languages. This proposal does not enable chemical products or rates.

- [x] Design care coverage beyond PNG: [specification 0005](../specs/0005-four-country-care.md)
- [x] Build the four country selector and matching care source records: `/develop care coverage beyond PNG`
- [x] Verify public country changes and both language reports: `/check verify care coverage beyond PNG`
- [x] Test country options and regional source boundaries: `/test care coverage beyond PNG`

Source records use the Indonesian Ministry of Agriculture BBPP Lembang GAP article, Kenya Coffee Platform sustainability manual and the Brazil coffee rust review held by Embrapa. Exact sections and limitations are recorded in specification 0005. General care for skipped or unknown countries remains separate from local care; existing observational next checks remain available.

Four country release verification, 16 October 2026: revision `coffee-health-demo-00028-rk5` serves all traffic with maximum one instance after remote build `ad3a3171-34f7-4210-8cf4-9b594bb25bf9`. Local lint, types and 127 tests pass. Real Gemini case `2d53f4d5-b58c-4d33-81bd-39509c3f3be1` retained photo findings through PG, ID, KE, BR, Not sure and skipped contexts. Both language country editors list exactly those six choices. Published care sources matched each explicit country; unknown and skipped contexts withheld regional care. Every page of the six page Indonesia English PDF and five page Brazil draft Tok Pisin PDF was rendered and visually inspected, including source scope and the Arabica limit. Samples are in ignored `output/pdf/four-country-care/`. This completes the four country software slice, not independent agricultural review, fluent translation review or chemical label verification.

Review wording correction, 16 October 2026: the shared English and draft Tok Pisin review notice now describes pending independent review without naming PNG as the selected review country. The same locale key feeds Results, report preview and PDF limits. Lint, types and 127 tests pass. Both fixed language PDF limits pages were generated from controlled software fixtures and visually inspected, not new agricultural evidence. Remote build `f1e123d5-ca39-4965-b2cb-22913612448c` succeeded and revision `coffee-health-demo-00029-x9p` serves all traffic. Both published locale notices were checked in the real browser without another AI request.

Result and report presentation polish, 16 October 2026: Step 3 keeps regional care before supporting photo details and avoids repeating the general photo warning in the expert review disclosure. Step 4 keeps a compact summary, country, download and optional full preview; treatment confirmation and stale guidance recovery remain visible when applicable. PDF body spacing is tighter without dropping content, with 11.5 point body text and preserved photo grouping and heading rules. Lint, types and 127 tests pass; the final conditional change also passed lint and types. Remote build `9a6f50c2-ee23-44a0-ad64-e9636a729977` succeeded, revision `coffee-health-demo-00030-l8f` serves all traffic with maximum one instance. Real BRACOL case `3d3b7af8-2ffa-457d-ab54-2ccf0dedd182` completed preliminary and final requests, an Indonesia to Kenya report country update, full preview and English plus draft Tok Pisin downloads. Every page of both five page PDFs was visually inspected, and browser errors were empty. Local synthetic layout samples were checked separately and are not agricultural evidence. Real samples are in ignored `output/pdf/result-polish/`, renders in `tmp/pdfs/result-polish/`.

### 9. Evaluation and submission, in-progress

Pitch deck draft prepared on 16 October 2026 using the prescribed template, with J2D and leader Jeremiah Ewande confirmed by the user. [Deck and verification record](../submission/pitch/README.md). The 13 slide native draft, PDF and PowerPoint were checked visually and structurally. The user has sent the clarification email; the reply, genuine demo video, public repository verification and final package remain pending. Nothing has been submitted.

The user supplied mandatory submission instructions and the official deck template on 16 October 2026. Read [the recorded instructions](../submission/instructions.md) before preparing the deck, video, description or form. It records the required template sections, ongoing public availability requirement and unresolved video duration and Firestore wording.

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

Tok Pisin status release, 16 October 2026: lint, type checks and 127 tests pass. The tests distinguish user confirmed language review from pending agricultural approval and future automatic case text. Controlled English and Tok Pisin report exports no longer contain blanket draft notices. Remote build `538b2457-324f-4f9b-b7aa-de9c1a468dd5` passed; revision `coffee-health-demo-00031-tqh` serves all traffic with maximum one instance. The published Tok Pisin screen and About disclosure were checked in the real browser, with no errors. No additional paid AI screening was needed. The J2D deck and both exports were updated and the four changed slides inspected.

English possible cause presentation, 16 October 2026: user approved more positive wording. Shared result and PDF labels now say Possible cause and What needs checking, with a photo and answer based introduction and plant checking explanation. Reviewed Tok Pisin text is unchanged. Lint, types and 127 tests pass; remote build succeeded and revision `coffee-health-demo-00032-655` serves all traffic. Real public case `5306db81` and every page of its five page English PDF were checked. See [verification](../validation/positive-cause-wording-2026-10-16.md). This does not change AI decisions or agricultural validation status.

Tok Pisin cause wording consistency, 16 October 2026: the three corresponding fixed phrases now match the positive English meaning across result, preview and PDF. Only these edits await a fluent check; prior language review remains recorded. Lint, types and 127 tests pass. Remote build succeeded; revision `coffee-health-demo-00033-ts4` serves all traffic. Real case `cef01a6c` completed screening and translation, and its five page PDF was checked. [Evidence](../validation/positive-cause-wording-2026-10-16.md).

Submission clarification recorded, 16 October 2026: user supplied the organiser reply. Video must be strictly under three minutes; narration is shortened to 287 words on a 2:45 timeline. Firestore nonapplicability is explained in the README and deck because cases are temporary and PDFs stay on device. Agent Platform or ADK eligibility remains unresolved. Confirmed cutoff is 18 October 2026 at 11:59 PM IST, or 19 October at 2:29 AM Brunei. Keep the app available throughout evaluation; no end date was specified. Deck exports refreshed and revised technology slide visually checked. No implementation, purchase, video upload, git publication or submission action was performed.

Farmer testing limit adjustment, 17 October 2026: user reported testing blocked. Renewable ten minute windows now allow 12 screening requests (normally six complete checks), 12 translations and 60 guidance updates per session. Shared model and issuance caps are 60 and 30 per ten minutes with unchanged proxy trust, concurrency, signed session expiry and maximum one instance. Lint, types and 129 tests pass. Remote build passed; revision `coffee-health-demo-00034-sqf` serves all traffic and maxScale 1 was verified. Public no model boundary checks passed beyond the old limits, and a separate real leaf journey downloaded a PDF. [Verification](../validation/testing-allowance-2026-10-17.md). Existing total budget and no purchase instruction remain.

Current Tok Pisin wording review completed, user confirmed 17 October 2026: the three later cause phrases are marked reviewed with confirmation provenance, without inventing a reviewer or review date. README, judge guide, reviewer guide, narration and deck are updated. Lint, type checks and 129 tests pass. No app text, AI decisions or agricultural review status changed; no cloud deployment was needed because this updates review metadata and supporting documents. GitHub publication remains pending user instruction.
