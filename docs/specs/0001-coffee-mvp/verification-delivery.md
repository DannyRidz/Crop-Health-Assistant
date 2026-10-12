# Verification, team work and delivery

## Summary

Build one complete narrow journey first, then strengthen its boundaries, translations and evidence. Record what the real app and Gemini actually do. The plan targets a ready submission on 17 October, while the exact official cutoff still needs confirmation.

The intended product is a globally accessible coffee screening assistant, initially validated with PNG users as evaluation is completed. PNG validation is still planned; no worldwide agricultural validation is claimed. The public deployment has no application country restriction, while guidance remains limited to its reviewed geography.

## Requirements

These proposed acceptance criteria are the implementation contract after approval. No criterion has passed yet. Tests with mocked model outputs establish application behaviour, while real requests and held out images establish observed integration and screening outcomes.

| ID | Measurable acceptance criterion | Verification |
|---|---|---|
| AC-1 | Start welcomes coffee farmers worldwide and explains initial screening, coffee leaves, internet need, temporary assessment and PNG as the first planned validation group; no extra crop or worldwide agricultural validation is claimed | Real app in both languages |
| AC-2 | Accept one or two permitted photos; preview, replace and remove work; corrupt, unsupported and excessive inputs are rejected on server as well as device | Interface and API boundary cases |
| AC-3 | Show preliminary photo observations before the question stage; four starter questions, Not sure and at most two follow ups in one round; no further chat loop | Real request plus deterministic round limit tests |
| AC-4 | Edit photos or answers and switch surfaces without loss; input edits invalidate results; an old in flight response cannot overwrite new inputs | Browser race and state tests |
| AC-5 | Each four status branch shows distinct observations, possible cause and uncertainty; no clear signs always states that plant health is unconfirmed | Policy tests and rendered status checks |
| AC-6 | Unsupported crop, part, condition IDs, evidence IDs and extra model fields never yield a current supported condition or matching coffee treatment | Invalid response and unsupported image cases |
| AC-7 | Timeout, refusal, malformed model output and unavailable service show an error with no invented result; retry retains photos and answers | Mocked failures and one real integration check |
| AC-8 | Question, upload, output, attempt and concurrency limits are enforced by app server; repeated requests receive explicit quota behaviour | API requests at and beyond limits |
| AC-9 | Pending, rejected, mismatched or demonstration guidance never appears as approved; entries record regional applicability and review geography; only approved matches for the stated country and any required broad region appear as recommendations; actual PNG review is labelled and never assumed suitable elsewhere | Content tests for PNG, outside PNG, unknown and narrower region cases, plus rendered gaps |
| AC-10 | English / Tok Pisin switching preserves exact photos, answers, progress, status, condition, evidence and guidance eligibility | Compare canonical object before and after toggle |
| AC-11 | Repeated switching for unchanged text uses cached variants; translation failure offers explicit English fallback without screening again | Request counter and browser checks |
| AC-12 | Essential fixed Tok Pisin text, questions, uncertainty and available guidance have truthful independent review records; missing text is labelled; generated text is not labelled case reviewed | Fluent reviewer signoff and content manifest |
| AC-13 | Download opens as a real PDF with current reference, dates, language, photos, answers, stated country or broad region, observations, status, uncertainty, regionally eligible sources, guidance limits and missing information; unknown region and local referral are explicit; stale input or guidance context cannot export | Read file contents and inspect PNG, other country and unknown region reports |
| AC-14 | Complete journey works at 360 by 800, 390 by 844 and 1280 by 800 in both languages; no horizontal overflow at 320 px; 200% text zoom retains actions | Real browser screenshots and interaction |
| AC-15 | Keyboard journey, labels, focus, minimum 48 px targets, contrast and reduced motion pass; long answers, missing guidance and error text remain readable | Accessibility audit and manual checks |
| AC-16 | No server key reaches browser bundle, response, repository or logs; photos and answers are not intentionally persisted by app; privacy text matches provider mode | Build inspection, log inspection and network check |
| AC-17 | Cloud Run live URL is publicly accessible without login, invitation, a country allowlist or an application location based gate; it completes at least one permitted case with real Gemini output and PDF, including a non PNG or unknown region guidance fallback; normal quota and outage states remain explicit | Public session smoke check, deployment policy inspection and selected region cases; no claim of testing every country |
| AC-18 | Evaluation, licences, limitations and submission links reflect actual completed capabilities; project authored branding scan passes and confirmation is retained after submission | Delivery review and link readback |
| AC-19 | At most one optional country or broad region context field appears when guidance depends on geography, with Not sure or skip and no precise location or inferred PNG default; missing suitable regional guidance preserves observations and recommends a local officer; region edits reselect guidance without another Gemini screening and remove stale advice from results and reports | Browser journey, guidance selection tests, request counts and late response tests |

Farmer release requires the applicable review criteria, not just a working internal demo. AC-9 and AC-12 remain blocked until content resources arrive. Supported issue evaluations need enabled condition evidence. If they cannot be met, report an educational prototype with explicit incomplete items rather than silently lowering the criteria.

## Evaluation plan

Teammate prepares expected outcomes before prompt tuning. Record source, permission, crop, plant part, photo session or plant group and review basis. Keep all photos from the same plant or session together. Separate development examples from final evaluation examples. Do not use final cases for prompt tuning; after changes record that a previous set has been exposed and request a fresh holdout where possible.

Target 20 to 30 diverse cases only if suitable material arrives. This is a target, not existing data or a meaningful agricultural accuracy study. If fewer cases are available, report the actual number and coverage gaps. Public image availability is not a reliable label or reuse permission.

| Case family | Expected safety behaviour | Method |
|---|---|---|
| Enabled condition signs | Tentative possible issue with visible evidence and uncertainty | Real Gemini, reviewer labelled held out photos |
| Similar looking issues or yellowing | Uncertain result, no forced supported label | Real Gemini and expected reviewer boundary |
| Blurry, dark, incomplete and underside missing | Useful photo request or unable to assess, bounded questions | Real Gemini |
| Other crops, flowers, berries, unrelated objects | Coffee leaf scope rejection, no coffee advice | Real Gemini |
| No clear supported signs | No healthy claim | Real Gemini with reviewed expected status |
| Conflicting answers | Explicit contradiction and referral or more information | Real and controlled answer variants |
| Invalid model structures, prompt injection text | Fail validation and preserve safe application state | Mocked policy tests plus permitted adversarial real sample |
| Failure, timeout, quota and retry | No sample substitution; inputs retained and request caps apply | Mocked transport and real quota smoke checks when practical |
| Missing and unapproved guidance | Correct explicit gap, no generated treatment | Deterministic content fixtures |
| PNG guidance and matching PNG farmer | Only actual approved regional match appears, with PNG review label and local restrictions | Policy fixtures and real interface; no invented completed review |
| Farmer elsewhere, only PNG guidance | Supported observations remain; no PNG treatment recommendation; regional gap and local officer referral | Non PNG selectors in both languages and report checks |
| Unknown or skipped region; country known but required subregion absent | Screening and reports work without precise location; restricted advice withheld | Policy and browser cases with explicit Not sure |
| Change PNG to another region while guidance request is pending | Same checked observations and status, no extra Gemini request; old regional response ignored and report refreshed | Controlled race and request count tests |
| Language switching and missing translation | Canonical state identical; explicit fallback and bounded translation requests | Real browser plus controlled translation failures |
| Equivalent translated meaning | Same visible facts, negation and uncertainty | Fluent speaker review of real generated pairs |
| Reports and long text | Correct checked revision and readable exported PDF | File extraction and page rendering |

Record one row per case: case ID, group ID, source, permission, expected status and label source, country or region context, input and context revisions, model, prompt and registry version, real or mocked method, actual status and condition, request ID, latency, token use, guidance chosen and its reviewed geography, observed limitation or failure, reviewer comment and pass or fail. Do not store a farmer's uploads as evaluation data without separate permission.

Report raw counts for supported suggestions, missed expected signs, incorrect supported suggestions, referrals, request failures and guidance errors, plus denominator and uncertain labels. Never call a small demonstration set field accuracy. Record whether a reviewer was independent of prompt tuning. Measure photo transfer and analysis times; M1 establishes a latency baseline, aim for final screening below 30 seconds after upload on a measured connection, and preserve the 45 second model timeout.

PNG users are the first validation group. Record the countries, photo sources and participants actually represented in any evaluation. Outside PNG workflow fixtures verify guidance boundaries and access behaviour, not agricultural accuracy in those countries. Describe completed validation narrowly by real evidence; global accessibility never becomes a worldwide validation claim.

Automated checks focus on policy, guidance eligibility, revisions, language invariants, request bounds and report data. Do not write brittle tests asserting exact generated prose. Real browser checks exercise the complete journey. Real Gemini runs are separate from mocked tests and have explicit cost records.

## Team responsibilities and dependencies

| Owner | Work that can proceed after approval | Dependencies |
|---|---|---|
| Development lead | Scaffold, audit, interface, translation collection, upload validation, schemas, limits, reports and failure states | Approved plan |
| Development lead | Real Gemini calls and deployment | Google Cloud project, billing decision, API key, secrets and permitted test image |
| Teammate | Gather images and usage permission; agricultural sources with regional scope; reviewer; fluent Tok Pisin translation or review; held out cases and first PNG user feedback | No resource is currently available; delivery dates pending |
| Teammate | Draft English deck and demonstration script, organise expected outcomes | Use proposed content until actual outcomes exist |
| Both | Agree supported condition, examine failures, verify language meaning and prepare submission | Evidence, content review and real working prototype |

You confirmed a registered two person team. Still check both members' individual eligibility and the dashboard's team status against event terms. Do not assume a registration confirms all eligibility checks.

Prioritise review of upload and privacy instructions, question options, initial screening, Not sure, uncertainty, healthy plant caveat, errors and fallback notice before secondary copy. Agricultural review and fluent language review are independent tasks. Ask for at least one positive candidate, one similar looking case, one unclear case and one unsupported case early, then expand the held out set.

Recommend a 10 minute daily team check: completed journey, missing resource and next review. At the 14 October checkpoint, if reviews or permitted images still lack a delivery date, retain the educational demo mode and mark full MVP readiness at risk. Continue useful software work, but do not enable unsupported claims.

## Build plan

Dates use Asia/Brunei and assume approval soon. If approval comes later, move the sequence forward and reduce optional polish. Do not implement before approval just to meet this schedule.

| Milestone | Target | Tasks and criteria | Evidence of completion |
|---|---|---|---|
| M0, approved foundation | 12 October, after approval | Scaffold only the agreed runtime; run audit after scaffold; establish project instructions, type checks and reproducible build; prepare server secrets and provider access without exposing keys, AC-16 | Local app build and context, no claim of screening yet |
| M1, complete narrow journey | 12 to 13 October | One permitted photo, real Gemini observations, four starter answers and optional country context, real checked result, regional guidance or gap and local referral, PDF with geography and Cloud Run without app country restrictions; bilingual infrastructure with honest draft labels, AC-1 through AC-3, AC-5 through AC-11, AC-13, AC-14, AC-16, AC-17, AC-19 | Public live request record and region aware report; pending content honestly shown |
| M2, safe boundaries | 13 to 14 October | Two photos, optional reviewed bank questions, all four statuses, contradictions, errors, limits, region changes without rescreening and stale response rejection, AC-2 through AC-8, AC-10, AC-11, AC-16, AC-19 | Policy checks and real app failure and region cases |
| M3, evidence and bilingual content | 14 to 15 October | Teammate supplies resources; review registry, permissions, fixed text, PNG guidance scope and generated translation examples; enable one condition only after held out evaluation, AC-5, AC-6, AC-9 through AC-12, AC-19 | Actual PNG scope review and evaluation records, or documented blockers; no worldwide validation claim |
| M4, complete usability and export | 15 to 16 October | Both languages, long and missing text, PNG, other and unknown region results and PDFs, accessibility and slow connection checks, AC-4, AC-10 through AC-15, AC-19 | Downloaded PDF inspection and representative browser captures |
| M5, final verification and submission | 16 to 17 October | Repeat relevant evaluation after fixes, verify live deployment, patch framework, branding, licences, English deck and video, working links, AC-16 through AC-18 | Actual results, complete package, submission confirmation if submitted |
| Buffer | 18 October only if allowed | Verify acknowledgement and resolve submission problems before confirmed cutoff | No new feature work |

M1 is complete only when real Gemini and Cloud Run work. Without provider setup or a permitted image, it remains blocked while software scaffolding and safe policy fixtures can proceed. Without content review, M1 may show only observations and referral in a demonstration, not supported disease screening.

After approval use develop and frontend-design for each slice, check verify on the real app, test for meaningful automated checks, debug on actual failures and sync after completed changes. Read each applicable installed skill at that stage. Audit and sync must respect your branding instruction and must not create instruction files for other assistants. Do not mark later skills as already run during this planning phase.

## Deployment checklist, after approval

1. Create or select a Google Cloud project; establish billing and Gemini paid service access with your agreed spending cap. No cloud setup exists yet.
2. Choose `asia-southeast1` as the proposed region if account and service availability allow it. This is a practical initial recommendation, not a PNG data residency guarantee. Check latency and organiser account restrictions.
3. Set API access, scoped service account and Google Secret Manager values. Grant only necessary secret access. Keep local environment ignored and example values empty placeholders.
4. Deploy the single Next.js app through the official [Cloud Run Next.js route](https://docs.cloud.google.com/run/docs/quickstarts/frameworks/deploy-nextjs-service). Use a reproducible standalone container if the approved build requires control of runtime and image decoder. Bind to `0.0.0.0` and the injected `PORT`.
5. Configure public access and HTTPS without app country allowlists, location based gates, farmer login or invitations. Region entry never gates access. Keep normal request and capacity limits; these do not promise unlimited traffic or availability in every network. Set provider quotas, alerts and the screening disable switch.
6. Verify secrets with [Google secret configuration](https://docs.cloud.google.com/run/docs/configuring/services/secrets), without printing them. Inspect browser bundles and error logs for leakage.
7. Apply the announced framework security update when released. Run the required checks on the final pinned dependencies and rebuild deployment.
8. Exercise permitted upload, real result, language switch, region selection, region changes, report download, invalid input, quota and missing regional guidance at the live URL. Include PNG, another country and Not sure context. Inspect deployment for app country access gates; these checks do not establish worldwide agricultural validation. Test cold start and refresh loss notice.
9. Retain a last known working revision for rollback. Confirm sample image permission, public source links and runtime charges. Remove unneeded trial deployments after the event by a separately authorised cleanup.

## Submission checklist and event caveats

The public pages checked on 12 October require Google AI, a functional cloud prototype, a proposal deck converted to PDF, an accessible three minute demonstration video and an identified category. They list judging weights as technical implementation 40%, alignment and impact 25%, innovation 25%, and user experience 10%. Submission materials are required in English. See [official requirements](https://aibuildercup.com/themes.html).

The public timeline lists 18 October 2026, but another paragraph says submit before 18 October. No exact time or timezone was found. Team formation was due 11 October and students are excluded. Confirm the dashboard cutoff and individual eligibility. Target 17 October to avoid relying on the ambiguous wording. See [official overview](https://aibuildercup.com/).

The current themes include Sustainability & Social Impact while an older submission paragraph lists different categories. Use the theme as project framing and confirm the form's category. The English materials rule needs clarification for Tok Pisin interface and translation data. Keep documentation, code identifiers, comments, deck and narrated demo in English; demonstrate the bilingual product explicitly rather than dropping it silently.

| Item | Delivery check |
|---|---|
| Live prototype | Public Cloud Run link without app country restrictions, permitted sample if available, normal limits, real requests and explicit regional guidance gaps |
| Proposal deck | English PDF, current organiser template if dashboard provides one, problem, AI role, flow, evidence, limitations and roadmap |
| Demo video | Approximately three minutes, public Google Drive link as permitted by site, show actual live behaviour and report |
| Source repository | Source, setup, neutral tool wording, licence records, no secrets; access level and repository field confirmed in dashboard |
| Description and category | Globally accessible coffee screening assistant, with PNG as first validation group; describe only validation actually completed, no worldwide agricultural claim; match verified form labels |
| Additional form fields | Check dashboard for declarations, access requirements, file sizes, team details and any updated instructions |
| Confirmation | Verify all submitted links from another session and save actual acknowledgement |

Repository and description requirements are recorded in the earlier project plan as coming from a welcome email. This session has not inspected that email or dashboard; treat those details as pending confirmation, not newly verified public requirements.

Suggested demo: 20 seconds for the farmer problem; 40 seconds for photo and questions; 40 seconds for evidence, uncertainty and guidance; 25 seconds for a blurry or unsupported case; 25 seconds for Tok Pisin switch and report; 30 seconds for actual evaluation, limitations and next steps. Use permitted examples and actual outcomes only. A pending reviewer or empty registry is a material limitation to state.

Judging evidence: real image interpretation plus validated boundaries demonstrates technical use; observed farmer or officer feedback can support value; the photo to observation relationship, language preservation and reviewed guidance show practical differentiation; the complete phone journey supports usability. Do not invent feedback, adoption figures or finalist likelihood.

## Risks and unresolved information

| Risk | Response or dependency |
|---|---|
| All content resources absent | Teammate owns collection, review dates still needed; do not enable a condition by deadline pressure |
| No cloud project, billing or key | Setup after approval; real milestone cannot pass until available |
| Spending cap not stated | Proposed USD 20 envelope for discussion, no spending authorised yet |
| Tok Pisin review delayed | Draft internal demo labels; farmer release remains blocked |
| Gemini mistakes visible signs | Narrow registry, review, held out evaluation and conservative statuses |
| Network or low end device limits | Resize, clear retry, retain tab data, explicit online requirement |
| Session loses progress on refresh | Visible notice and download encouragement; no automatic persistent storage |
| Language rule or cutoff conflict | Confirm organiser dashboard, do not guess exact time |
| Limited evidence dataset | Actual counts and coverage gaps, no agricultural accuracy claim |
| PNG advice reused elsewhere | Require reviewed regional match, label PNG review and provide observations with local officer referral when guidance is unavailable |
| Worldwide access mistaken for worldwide validation | Separate product reach from evaluated geography in interface, reports, evaluation and submission |
| In memory abuse control resets | Supervised capacity and provider quotas, no claimed global hard cost cap |

## Project branding verification checklist

Inspect every project authored file, including hidden configuration, Markdown, comments, sample environment files, reports, UI assets and submission text. No competing AI or cloud vendor names, integrations, generated by comments, promotional badges or alternative assistant instruction files. Refer to development tools as coding assistant, development environment or editor.

Inspect generated scaffold templates before retaining them, and check dependency examples rather than accepting boilerplate unchanged. Preserve required package identifiers, third party licence notices and dependency metadata. Record required attribution separately, without rewriting third party packages. Do not claim Google endorsement, partnership or certification.

Current planning inspection: all added files are Markdown plans. There is no application package or third party code in this delivery. Required third party attribution introduced: none. Referenced source organisations are agricultural evidence publishers, not claimed AI or cloud providers or project partners. A final implementation scan remains required at M5.
