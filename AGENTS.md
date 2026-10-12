# Crop Health Assistant

## Product and current state

Globally accessible coffee leaf screening assistant. PNG users are the first planned validation group, not the only audience. English and Tok Pisin are the only MVP languages. M0 is a local foundation; screening, reviewed guidance and report downloads are not implemented yet.

## Stack

Node.js 24, Next.js App Router, TypeScript with strict checks, React, CSS modules and Vitest. Use npm and the committed lockfile. Gemini and Google Cloud Run are planned for M1; no cloud resources or credentials are required for M0.

## Commands

Run `nvm use` if using that runtime manager, then `npm ci`.

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run lint` | ESLint checks |
| `npm run typecheck` | Route types and TypeScript checks |
| `npm test` | Deterministic Vitest tests |
| `npm run build` | Production build |
| `npm run check` | All required local checks |

## Build approach

Tracer Bullet: prove one real complete journey before adding breadth. The approved plan is [0001](docs/specs/0001-coffee-mvp/index.md). Build only the authorised milestone. Maintain the [scope](docs/scope/scope.md) with verified progress.

## Rules

1. Google is the only AI or cloud vendor named in authored code, comments, docs, configuration and UI. Use neutral development tool wording. Preserve required package names, licence notices and dependency metadata. Do not add alternative assistant instruction files.
2. Never expose credentials in browser code, committed files, logs or responses. Local secrets belong in ignored `.env.local`. Paid cloud actions await the spending decision.
3. Describe screening and uncertainty honestly. Never certify health, invent treatment or imply completed agricultural or worldwide validation.
4. Guidance must match the explicit farmer region and actual review scope. Missing regional guidance means observations, a limitation and local officer referral. Never infer location from language or IP.
5. Fixed UI text lives in `src/content/locales/`. Draft Tok Pisin is labelled and requires fluent review. Language changes never change screening evidence.
6. Keep a small functional structure: routes in `src/app`, UI in `src/components`, pure shared logic in `src/lib`. Use named exports except framework required route exports.
7. Use the [frontend specification](docs/specs/0001-coffee-mvp/design.md). Tokens live in `src/app/globals.css`. Use semantic HTML, visible focus, 48 px targets and wrapping text.
8. Run checks appropriate to the milestone and exercise the real app. Record mocked checks separately from real Gemini requests. Do not test exact generated prose.

## Git

integration: off. Preserve user edits. Do not commit, push or create a pull request unless requested.

## Agent skills

Installed workflow skills are working instructions outside the project. Use develop for approved slices, frontend-design for UI, check verify for real app behaviour, test for meaningful checks, debug for failures and sync for durable context. Never copy skill contents into the repository.

## Framework documentation

Read the relevant installed guide in `node_modules/next/dist/docs/` before changing framework behaviour. APIs and conventions may differ from earlier versions. Automatic instruction generation is disabled so this curated file remains stable.
