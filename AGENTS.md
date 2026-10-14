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
