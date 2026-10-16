# Crop Health Assistant

## Product and current state

Globally accessible coffee leaf screening assistant. PNG users are the first planned validation group, not the only audience. English and Tok Pisin are the only MVP languages. M1 narrow public journey is complete with a permitted BRACOL image, real Gemini preliminary and final requests, regional limitations and English plus draft Tok Pisin PDFs. Cloud Run screening is enabled in paid mode with two scoped Secret Manager references and maximum one instance. Conditions remain disabled, guidance remains empty and all Tok Pisin text is draft. M2 core boundary checks pass, but live reviewed condition status selection and the follow up bank remain pending. Agricultural accuracy and farmer release validation remain pending.

## Stack

Node.js 24, Next.js App Router, TypeScript with strict checks, React, CSS modules and Vitest. Use npm and the committed lockfile. M1 adds the official Gemini SDK, Zod, sharp, pdf-lib and its font helper. The Google Cloud Run demonstration is deployed with paid observation screening enabled; local photo preparation and incomplete reports need no credentials.

## Commands

Run `nvm use` if using that runtime manager, then `npm ci`.

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run lint` | ESLint checks |
| `npm run typecheck` | Route types and TypeScript checks |
| `npm test` | Deterministic Vitest tests |
| `npm run build` | Production build |
| `npm start` | Built standalone app, after the build has copied public and static assets |
| `npm run check` | All required local checks |

## Build approach

Tracer Bullet: prove one real complete journey before adding breadth. The approved plan is [0001](docs/specs/0001-coffee-mvp/index.md). Build only the authorised milestone. Maintain the [scope](docs/scope/scope.md) with verified progress.

## Rules

1. Google is the only AI or cloud vendor named in authored code, comments, docs, configuration and UI. Use neutral development tool wording. Preserve required package names, licence notices and dependency metadata. Do not add alternative assistant instruction files.
2. Never expose credentials in browser code, committed files, logs or responses. Local secrets belong in ignored `.env.local`. The MVP allowance is USD 20 total, excluding older projects. The user purchased initial USD 5 Gemini credits; funded API access was verified on 14 October 2026. Do not initiate further purchases. Keep automatic top ups off. The allowance is not a guaranteed service cutoff.
3. Describe screening and uncertainty honestly. Never certify health, invent treatment or imply completed agricultural or worldwide validation.
4. Guidance must match the explicit farmer region and actual review scope. Missing regional guidance means observations, a limitation and local officer referral. Never infer location from language or IP.
5. Fixed UI text lives in `src/content/locales/`. Draft Tok Pisin is labelled and requires fluent review. Language changes never change screening evidence.
6. Keep a small functional structure: routes in `src/app`, UI in `src/components`, pure shared logic in `src/lib`. Use named exports except framework required route exports.
7. Use the [frontend specification](docs/specs/0001-coffee-mvp/design.md). Tokens live in `src/app/globals.css`. Use semantic HTML, visible focus, 48 px targets and wrapping text.
   Supporting details may use native disclosures. Keep sharing consent and screening uncertainty visible; automatically expand preliminary photo details when quality or crop and part checks flag a limitation. A collapsed report preview must not omit content from PDF export.
   Focus the heading on assessment step changes, not on initial page load. Preserve visible keyboard focus and error focus.
   Offer incomplete reports after service or session failures, not local photo, consent, answer or country validation errors. Clear the relevant consent or country error when that input changes.
   Use farmer task wording instead of repeated development labels. Keep disease coverage, independent review status, language drafts and regional limits truthful in the interface and reports.
8. Run checks appropriate to the milestone and exercise the real app. Record mocked checks separately from real Gemini requests. Do not test exact generated prose.

## Git

integration: off. Preserve user edits. Do not commit, push or create a pull request unless requested.

## Agent skills

Installed workflow skills are working instructions outside the project. Use develop for approved slices, frontend-design for UI, check verify for real app behaviour, test for meaningful checks, debug for failures and sync for durable context. Never copy skill contents into the repository.

Cloud source uploads use `.gcloudignore` to exclude secrets and generated files. `scripts/deploy-demo.sh` prepares the initial public demo with screening disabled and no cloud secrets; it deployed the initial revision in asia-southeast1. Cloud billing is enabled, public demo checks passed, funded Gemini access is verified locally, and cloud secrets are configured. The selected BRACOL sample provenance and real M1 journey are verified, so observation screening is enabled. Do not enable a disease condition or guidance before review and evaluation; do not purchase further credits without authorization.

## Context files

- [Server processing](src/lib/server/AGENTS.md): signing, Gemini calls, upload validation and temporary quotas.

## Framework documentation

Read the relevant installed guide in `node_modules/next/dist/docs/` before changing framework behaviour. APIs and conventions may differ from earlier versions. Automatic instruction generation is disabled so this curated file remains stable.

Local image decoding failures map to invalid_image before any provider request. Preserve existing photos when a replacement cannot be decoded. Controlled HTTP fixtures are software test evidence only, never agricultural or real provider evidence.

The public app address is https://coffee-leaf-check.web.app. Hosting rewrites in deploy/preview-link route all paths to the existing Cloud Run service, scoped to Hosting target preview in the MVP project. Deploy only that target. Keep the signed __session cookie and exact PUBLIC_APP_ORIGIN configuration so sessions work through Hosting. Firebase Analytics is disabled.

PDF exports use A4 pages, running headers and page footers. Keep photo captions with their images and section headings with their first two content groups. Keep complete record metadata in the final page footer and reserve its space in the body. Generated report samples and rendered checks belong in ignored output/pdf and tmp/pdfs.

The user authorised [useful reports and AI led explanations](docs/specs/0003-useful-screening-reports.md) on 15 October 2026. Final screening may now name up to three tentative AI possible causes without an external agricultural reviewer prerequisite. Each explanation needs usable coffee leaf evidence, uncertainty and a concrete next observation check. Keep these hypotheses separate from independently evaluated registry conditions and regionally approved treatment guidance, which remain disabled. Do not restore the old blanket disease name ban or describe AI hypotheses as confirmed diagnoses or completed agricultural validation.

Schema 3 retains final photo checks and separates visual findings, AI hypotheses and regional guidance. Photo revisions change only with photo or stated side edits; answer edits preserve the bound preliminary photo check. Report sections explicitly mark includePhotos; do not hardcode photo placement to a section index. Keep every cause explanation, source scope and uncertainty in both language exports. Diagnostic source links open in another tab to preserve temporary assessment data.

During PDF export, keep language controls disabled and guard changeLocale so changing language cannot silently cancel a download. Preserve the stale export epoch check and restore controls after either success or failure.

Report previews and PDF exports share section layout and label metadata. Keep the country record separate from the Result section, including incomplete reports. Preserve real bold headings, hanging bullet points, separate farmer answers, compact record details and section titles on continuation pages. PDF export needs both bundled Noto Sans Regular and Bold fonts; keep their licence notices.

Observation panels group displayed findings into one card per input photo, with one photo heading and a bullet list. Preserve all selected observation links; findings linked to both photos belong under both. Keep the photo button working as a focus and scroll link.

Cause cards keep their explanation and uncertainty visible, highlight next observation checks with the oat token and collapse only supporting source details. Preserve full source scopes and the overall AI explanation in supporting detail and PDF exports. When no cause is available, keep its specific explanation visible.

Whole tree photo suggestions are optional context to share separately with a local officer. Keep both app upload slots for leaf photos.

Country entry uses one optional native selector with explicit Skip for now and Not sure options. Result and Report show a compact country summary with Change. Preserve keyboard focus on edit and return it after a guidance update. Country edits update report context and regional guidance without rerunning or changing the AI findings.

The user approved [AI care and label based treatment](docs/specs/0004-ai-care-and-label-based-treatment.md) on 15 October 2026. This separate path permits AI selected published source care before independent review. Initial source scope is PG only, with original fixed care wording and draft Tok Pisin. Keep `GuidanceEntry` approval and condition flags unchanged. Chemical products and rates come only from current exact local registration and label records; the live catalogue is empty. Never generate product names, doses or label facts from model prose.

Care and chemical catalogue versions bind signed results, canonical hashes, guidance and report boundaries. Optional malformed advice is discarded without weakening core photo evidence validation. Chemical context binds the result, country revision, product, label hash, catalogue, locale, answers and explicit identity and language consent. Refresh through `/api/guidance` before every chemical PDF or app print, verify the returned context digest, and withhold rates after edits or expiry. Native print hides chemical groups unless the guarded action temporarily permits them.

Remote source deployment can restore a default revision scaling limit. Explicitly set `--max-instances=1` and verify the live revision annotation and traffic after deployment. Preserve the existing secrets and exact Hosting origin. No simulator or local production build is authorised for this low resource computer; use light local checks and the remote production build.

Specification [0005](docs/specs/0005-four-country-care.md) expands sourced care to PG, ID, KE and BR through `regionalCareActions` and `careActionsForCountry`. The selector lists only those four plus Not sure and Skip for now; full ISO validation and worldwide public access remain. Keep country sources separate, with no regional care for unknown or skipped countries. Preserve Brazil's mainly Arabica limitation in results and reports. Published source coverage is not independent agricultural review.

Result keeps regional care before supporting photo details. Report keeps summary, country, download and optional full preview; show the additional care panel when treatment confirmation or stale guidance recovery requires it. Preserve full content in the preview and PDF even when the report screen is shorter.

Submission preparation must follow [the recorded organiser instructions and prescribed template](docs/submission/instructions.md). Resolve the conflicting video durations and whether Firestore is mandatory before finalising the package. The current app does not use Firestore; do not claim otherwise or add it without a defined authorised scope.
