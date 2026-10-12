# Crop Health Assistant

A coffee screening assistant for coffee farmers worldwide, with PNG users as the first planned validation group. The MVP supports coffee leaves, English and Tok Pisin. It provides initial screening, not a confirmed diagnosis or a claim of worldwide agricultural validation.

## Current milestone

M0 establishes the local Next.js and TypeScript foundation, a mobile friendly welcome page, language preference and development checks. Photo screening, Gemini integration, region matched guidance, PDF reports and cloud deployment come in later milestones. Tok Pisin text is a draft awaiting fluent review. No agricultural guidance has been approved yet.

## Run locally

Use Node.js 24 and npm. If your runtime manager supports `.nvmrc`, run `nvm use`.

```sh
npm ci
npm run dev
```

Open [the local app](http://localhost:3000). No API key or paid account is needed for M0. The health endpoint is `/api/health`; its ready value means the local app responds, not that screening is enabled.

## Verify the foundation

```sh
npm run check
```

This runs linting, TypeScript checks, deterministic tests and the production build. To preview a production build, run `npm run build` followed by `npm start`.

## Configuration and data

`.env.example` lists future server configuration with blank credentials and screening disabled. For M1, copy it to an ignored `.env.local` and enter credentials privately. Do not commit secrets or use browser exposed variables for them.

M0 remembers only the selected language on the device, where storage is available. It does not collect or upload photos, answers or location. The planned assessment will stay in the open tab and be lost on refresh. Country or broad region will be optional context for reviewed guidance, not an access restriction.

## Plan and next milestone

Read the [approved plan](docs/specs/0001-coffee-mvp/index.md), [scope](docs/scope/scope.md) and [build sequence](docs/specs/0001-coffee-mvp/verification-delivery.md). M1 connects one narrow journey to real Gemini requests, a report and Cloud Run after provider setup and the spending decision.

## Third party attribution

Dependency packages retain their licence notices in their distributions and metadata in `package-lock.json`. No third party image or font asset is bundled in M0. The interface uses the specified Arial and sans-serif fallback. Reference organisations are not project partners, and Google use does not imply endorsement.
