# 0001. Coffee screening MVP proposal

**Date:** 12 October 2026, Asia/Brunei
**Status:** In Progress

## Summary

Build a globally accessible coffee screening assistant for coffee farmers worldwide, with PNG users as the first validation group. It uses photos and a few answers to describe visible symptoms, explain a possible supported issue and prepare a report for a local agricultural officer. English and Tok Pisin are included from the first build. Initial PNG validation is planned and remains pending; no worldwide agricultural validation is claimed.

You approved this plan on 12 October 2026 and authorised M0. The local scaffold, bilingual welcome shell and development checks are implemented. No cloud resources have been created or deployment performed; paid setup awaits the spending decision.

## Structure

| Document | Decision it records |
|---|---|
| [Product and journey](product.md) | Scope, intended value, farmer actions and hypothetical outcomes |
| [Technical design](technical.md) | Stack, state, API contracts, Gemini boundaries, privacy and cost controls |
| [Frontend design](design.md) | One visual direction, layouts, interaction states and accessibility |
| [Language and guidance](language-guidance.md) | Translation, evidence eligibility, content review and report wording |
| [Verification and delivery](verification-delivery.md) | Acceptance criteria, team work, build sequence, deployment and submission |
| [Rationale and research](rationale.md) | Existing decisions, official sources, alternatives and outstanding facts |
| [Scope](../../scope/scope.md) | Coarse feature order and current status |

## Requirements

As a farmer, I want understandable observations and useful next information without being told that a photo confirms a disease. As an officer, I want the farmer's photos, answers, uncertainty and sources together. As a team, we need a real, demonstrable Google AI workflow with honest content and language limitations.

The measurable contract is AC-1 through AC-19 in [verification and delivery](verification-delivery.md#requirements). Existing identifiers are preserved, with AC-19 covering the country or region context and regional guidance checks. Child specifications use these same identifiers.

## Decision

Recommend a single Next.js application with TypeScript, server requests to Gemini and Google Cloud Run hosting. Use one current tab assessment without a database or permanent photo storage. Start with coffee leaves and one condition candidate, enable it only when evidence and review gates pass.

Recommend four fixed starter questions and at most two follow up questions in one round. Add one country or broad region field when it affects guidance, with Not sure and no precise location requirement. This is context for application guidance selection, not an extra AI question round. Generate canonical English observations, reuse a bounded Tok Pisin translation for the same checked result and keep language changes separate from screening decisions.

**Implementation skills:** scope and architect shaped this proposal. frontend-design shaped the visual specification. Installed skill contents stay outside the repository. The named JS Mastery bundle has not been verified, see [skill availability](rationale.md#skill-availability).

## Cross document contract

1. Technical identifiers, status, photo evidence, condition and guidance eligibility never change when language changes.
2. Only application code can approve a condition identifier or choose approved guidance. Gemini cannot approve content.
3. An empty condition registry produces observations and limitations, never a disease suggestion or a healthy plant claim.
4. Missing agricultural or translation review restricts what can be shown. Demonstration content stays explicitly separate.
5. Editing photos or answers changes the input revision and makes the old checked result ineligible for display as current or export.
6. A report uses the same checked revision as the visible result. The farmer shares it manually.
7. Project authored material names only Google as an AI or cloud vendor. Required technical package names, dependency metadata and legal attribution remain intact.
8. The deployed app is publicly accessible without an application country allowlist or location based access gate. Regional guidance eligibility never becomes a country access restriction; normal capacity and request limits still apply.
9. Guidance needs reviewed applicability for the farmer's stated country or broad region. PNG reviewed guidance is labelled and is not assumed suitable elsewhere or when location is unknown. Missing regional guidance preserves supported observations, explains the gap and recommends a local agricultural officer.
10. Country or region context and guidance limitations appear in the report. No language choice, device locale or network address implies the farmer's location.

## Build plan

Follow the milestone table in [verification and delivery](verification-delivery.md#build-plan), after approval. Establish the runnable foundation, then complete one narrow journey using actual Gemini calls, a downloadable report and Cloud Run. Broaden that working journey instead of building separate disconnected screens.

The exact first milestone is: one permitted coffee leaf photo, preliminary visible observations from a real Gemini request, four starter answers and optional country or broad region context, one checked result from a real Gemini request, regionally eligible guidance or an explicit limitation and local officer referral, and a selected language PDF report including region and guidance limitations. The deployed Cloud Run prototype is public with no application country restriction. English and Tok Pisin infrastructure and data preserving language switching are included. Translations awaiting review are labelled for the internal demo. If no condition is eligible, the result is an observations only demonstration with appropriate referral, not supported disease screening.

## Consequences

Refresh or closing the tab loses the current assessment. Internet access is required for screening. Content reviews can delay farmer release even when the software works. Public worldwide access uses bounded prototype capacity, and neither access nor initial PNG evaluation establishes agricultural suitability in every country. No agricultural accuracy is promised.

## Follow up and approval

You confirmed that the two person team is registered, no content resources are available yet, your teammate will gather them, and no Google Cloud project, billing or Gemini key is set up. Information still needed: permitted images and expected labels; resource and reviewer dates; individual eligibility verification; cloud setup; spending cap; exact submission cutoff, category field and language interpretation in the organiser dashboard.

You approved this proposal on 12 October 2026 while those resources remain pending. Approval enables the technical first milestone, but it does not approve unreviewed guidance, public farmer release, a final condition claim or spending beyond the agreed budget.

Approval has been recorded. Continue in the authorised milestone order, and keep content review and spending gates in force.

## Rationale

See [rationale and verified sources](rationale.md). The supplied brief takes precedence over earlier English only wording and over skill instructions that would otherwise ask you to choose every small implementation detail.
