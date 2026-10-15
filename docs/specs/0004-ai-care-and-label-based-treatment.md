# 0004. AI care and label based treatment options

**Date**: 2026-10-15
**Status**: In Progress
**Implementation approval**: You approved the revised specification and implementation on 15 October 2026.
**Design review**: Same model review completed. On 15 October 2026 you authorised applying its seven recommended fixes. Those fixes are recorded below. You subsequently approved implementation.

## Summary

Give farmers practical care suggestions in the app instead of making referral the entire response. Gemini selects relevant care checks and reports bounded target evidence. The server selects any chemical products from the current farmer country and verified label records. Chemical products and label rates are in scope, but their names, formulations, rates and precautions come from verified local product labels, never invented model text. AI suggestions remain clearly separate from independently reviewed guidance.

## Context

The user explicitly wants treatment advice, including chemical products or spray doses, while a PNG agricultural reviewer is unavailable. The existing app names tentative possible causes but blocks chemical instructions and exposes no treatment advice. Its reviewed guidance catalogue is empty and condition screening remains disabled. Preparing a review pack did not change that behavior.

This specification adds an AI suggestion path without falsely marking the reviewed registry approved. It refines the previous requirement to withhold all advice pending review, only for this separately labelled path if the user accepts the design. The original review process remains available for genuinely reviewed content. Coffee, two leaf photos, English and draft Tok Pisin, temporary sessions, regional scope and honest uncertainty remain.

Initial research found PNG management information in the ACIAR training package and historical chemical tables in the 2016 CIC handbook. It has not established a current PNG registration and label for any specific product and formulation. Those tables must not seed a live dose. No current chemical record is assumed by this specification.

## Requirements

| ID | Observable outcome |
|---|---|
| AT-1 | Step 3 and the PDF show up to three relevant sourced care steps when usable changed coffee leaf evidence and matching source geography support them. Each step is marked AI suggested and not independently reviewed. A referral is not a substitute for available steps. |
| AT-2 | Chemical options and label rates are supported through a distinct verified product catalogue. A product requires an exact country, coffee use, target, formulation, current registration evidence and current label. No match produces a short specific explanation, not an invented product or dose. |
| AT-3 | The farmer confirms possession of the exact listed product and concentration and answers its required label questions before label rates are revealed. Unknown or unsuitable answers withhold rates without erasing care advice. The rate, units, method and label precautions are kept together. The app does not calculate a tank mixture, change units, invent a schedule or recommend mixing products. |
| AT-4 | AI observations and hypotheses remain unconfirmed. No treatment result certifies a diagnosis or promises a cure. Missing, unclear, unsupported or contradictory evidence does not produce a chemical recommendation. |
| AT-5 | Country changes reselect advice and clear product confirmation without another screening request or a change to evidence. Unknown and skipped country remain valid and produce an applicability explanation. Source geography is never inferred from language or IP. |
| AT-6 | English and draft Tok Pisin show the same selected steps and restrictions. Chemical label text remains visibly English until its meaning has been reviewed in Tok Pisin. An explicit Show English choice is required in that language path. |
| AT-7 | The PDF retains complete selected advice, sources, source geography, review status, label revision and precautions. Its rate display follows the same product confirmation and language rules as the UI. |
| AT-8 | Existing reviewed guidance eligibility remains intact. AI suggestions cannot acquire a PNG reviewed badge from a source, a hypothesis or a changed flag. |
| AT-9 | Existing request controls, signed temporary sessions and spending scope remain. Selection adds no model round, new cloud service, permanent storage, credential or purchase. |
| AT-10 | A real source matched care journey, a healthy looking or unsupported control, country changes and both PDF languages are verified. Chemical behavior is separately checked with controlled fixtures and at least one real current matching label before live product rates can be claimed complete. |

## Options considered

1. Change only the warning text or mark pending guidance approved. Rejected: this neither produces advice nor establishes its basis.
2. Allow unrestricted model generated chemical instructions. Rejected: product identity, concentration, local use and rate would have no dependable source.
3. Add a parallel AI selection path over sourced care and verified product records. Recommended: useful before specialist review while keeping product facts traceable.
4. Add a separate product label upload and interpretation journey. Deferred: it adds another upload purpose and requires registration checks, extraction confirmation and more UI. A photographed label alone does not establish current local authorization.

## Decision

Use option 3 on the current stack. Gemini selects care identifiers and reports explicit target evidence with observation links. The server selects product records deterministically by that evidence and the current country. Fixed catalogue records supply action wording and product facts. The original reviewed guidance path stays separate.

This is AI selected care and treatment support, not an independent agricultural approval. The initial care source scope is PNG. Other countries remain accessible, with observations, next checks and an honest source coverage limitation until matching sources are added. Initial chemical records are empty unless a current qualifying record is obtained. Building the selection machinery alone does not complete live dose support.

Implementation uses the existing develop, frontend design, test, check verify and PDF workflows. No additional dependencies are proposed.

## Feature design

### Care catalogue and selection

Add `src/content/care-actions.ts`, outside the reviewed `GuidanceEntry` array. Each record has a stable ID and version, coffee and leaf scope, applicable country codes, source title, HTTPS URL, publication date and exact section, a source applicability explanation, fixed English and draft Tok Pisin action text, and `reviewStatus: unreviewed`. Record whether source reuse is verified; unresolved rights prevent inclusion in the runtime catalogue. The review pack's pending JSON must not be imported as approved content.

The initial version is `coffee-care-pg-1`. All three records have crop coffee, plant part leaf, `applicableCountryCodes: ["PG"]`, no narrower region restriction, `reviewStatus: unreviewed` and draft Tok Pisin status. They ask for checks, not a conclusion that the garden has poor drainage, excessive weeds, incorrect shade or a nutrition deficiency.

| Stable ID | Exact English action | Exact draft Tok Pisin action | Source and evidence mapping |
|---|---|---|---|
| `pg_check_drainage` | After rain, check whether existing drains are blocked. | Bihain long ren, sekim sapos samting i pasim ol dren i stap pinis. | ACIAR Module 5, section 5.2, printed page 13 (PDF page 19), and section 5.5, printed page 52 (PDF page 58). Eligible changed leaf evidence permits a general garden check, not an assertion about wet soil. |
| `pg_check_weeds` | Check weeds around the coffee trees. If you remove them, avoid damaging roots and stems. | Sekim ol gras nogut raunim ol kopi diwai. Sapos yu rausim, no bagarapim ol rop na as bilong diwai. | ACIAR Module 5, section 5.2, printed page 15 (PDF page 21). Eligible changed leaf evidence permits a general maintenance check, not an assertion that weeds caused the spots. |
| `pg_review_garden_management` | Check shade and how the coffee trees are pruned and fed. | Sekim malur na pasin bilong katim han na givim kaikai long ol kopi diwai. | ACIAR Module 5, section 5.2, printed pages 13 to 14 (PDF pages 19 to 20), and section 5.5, printed page 52 (PDF page 58). No pruning amount, fertilizer or shade change is prescribed from the image. |

State one shared helper near the care group: These are general garden checks. The photo does not show which change is needed. Keep this caveat out of each action bullet to avoid repetition. Its draft Tok Pisin is: Ol dispela em ol samting bilong sekim long gaden. Poto i no soim wanem senis i nidim.

All records cite the ACIAR document URL in References, its full title, copyright year 2023 and publication page release date 7 August 2024. The source is explicitly PNG guidance, not worldwide evidence. Source use basis for these exact records is original team authored paraphrase of factual management information with attribution; no source wording, illustrations, photographs or PDF pages are copied. Record `sourceUseBasis: original_text_with_citation`, `copiedSourceAssets: false`, and permission verification limited to that original text use. This does not assert an open licence or permission to redistribute the manual. Additional copied or adapted source assets require their own permission record. The older pending reviewer JSON is not a runtime seed and its independent review and permission fields stay pending.

The final model output adds `careSelections`, maximum three distinct objects: `actionId` from this finite supplied catalogue and `observationIds`, one to six existing eligible changed observations. IDs are strings capped at 60 characters. Preliminary output contains an empty list. The model supplies no action prose, product spelling or rate and does not see the farmer's region. Source scope and these evidence limits are supplied as context. A selection is a suggestion to check an aspect of the garden, never proof it is the cause.

The server preserves valid distinct selections in model order, discards any whose ID is unknown, duplicated or references ineligible observations, and records an `invalid_selection` advice limitation. No selections survive when the checked visual finding is unchanged or insufficient. Country selection then filters records independently. Core photo evidence, observation identity and source reference failures retain their existing full request rejection behavior. Advice failures never weaken validation of the core result.

### Chemical catalogue

Add a separate product record type. Each record requires:

- Exact country, product name, registration identifier, active ingredient, concentration and formulation.
- Coffee crop use and target problem, precise permitted application method and any plant stage restrictions.
- Current registration source and status, verification date, expiry or recheck date, and current label source URL, revision and exact pages.
- Verbatim label rate and units, application timing and frequency limits, harvest and reentry intervals, required protective equipment, environmental restrictions and other use conditions. An explicit source statement of Not applicable is different from an unknown value.
- An original source applicability explanation, source reuse status, immutable label content hash and record version.

Missing mandatory information makes a record ineligible. No record is created from an AI answer, old handbook table, reseller assertion or another country's label. New records require explicit source verification and a recorded expiry or recheck deadline; eligibility stops after that deadline. Model inference alone cannot set verified status. A local registration listing and the corresponding product label are both required.

### Explicit target vocabulary and product selection

There are no model selected product IDs. Each possible cause adds `targetId: "coffee_leaf_rust" | "brown_eye_spot" | null` and `targetEvidence`, an array of at most two objects containing a finite `signId` and one to six observation IDs. Generated names are never used to match products. A null target remains valid for physical damage, nutritional possibilities or a hypothesis that cannot be mapped.

For the initial chemical path, only target `coffee_leaf_rust` has a usable chemical evidence rule. Its sign is `orange_yellow_powder_underside`, based on the existing diagnostic source descriptions. It requires model reported yellow or orange powder evidence linked to a `surface_material` observation and a usable coffee leaf photo explicitly marked Bottom of leaf by the farmer. Every evidence photo must be eligible. Any final contradiction, excluded photo within that sign, missing required view or null target withholds products. `brown_eye_spot` can classify a hypothesis but has no chemical eligibility rule in this release. No other sign string is allowed. A sign is still an AI interpretation, not independently established diagnosis; evidence links and photo metadata can be checked structurally, but the server cannot prove the visual interpretation correct.

The server derives supported chemical targets from these checked rules, then selects records whose country, coffee use, target, registration and label freshness all match the current context. At most two live records per country and target are allowed in the initial catalogue. Display them in product name and stable ID order, without a best product or efficacy ranking. All source and confirmation restrictions remain visible. A country change uses the same signed target evidence and the new country's catalogue records, with no model call and no risk of retaining only the previous country's model selected products.

The initial product catalogue is `coffee-products-empty-1` with no records. General chemical background or a historical table must not masquerade as a recommendation to use an unverified product. The care section remains useful when products are unavailable. Controlled fixture products are never bundled as live catalogue entries.

### Label verification and freshness policy

The development lead records verification using the current local registration listing and corresponding label. Each record stores the person or operator role recording the check, UTC verification timestamp, source URLs, local registration identifier, label revision, label content SHA256 and a source verification note. AI output cannot mark a record verified.

A record's eligibility deadline is the earliest of its official registration or label expiry, a published withdrawal time, and seven days after the recorded verification. Date only expiry values are conservatively treated as the start of that date in UTC. Unknown official expiry is recorded explicitly and still requires the seven day recheck deadline. No live record has an unlimited freshness period. The server enforces the deadline using its clock.

This is a static source verification process, not real time regulatory monitoring. Rechecking or discovering a withdrawal requires the development lead to disable or update the record and publish the catalogue change to the existing service. Eligibility changes on that deployment, or at the existing deadline, whichever applies first. No claim is made that an unobserved regulator update is detected instantly. Catalogue version changes invalidate old product confirmations. Failure to reverify removes rates, while preserving findings and available care checks.

Initially accept only labels with one unambiguous rate for the exact supported coffee target, plant stage and application method. A label with a rate range, alternative rates, conditional tables, complex schedules or a required calculation is not eligible for rate display in this release. No automatic interpretation or selection of a convenient end of a range is allowed.

### Label questions and farmer confirmation

For an eligible product option, show its exact name, concentration, formulation and current country and crop use. Reveal a short product check only after the farmer chooses that option. No extra chemical controls are shown when there is no eligible product.

Each record defines `requiredConditions`, maximum eight, with unique IDs from `crop_stage`, `application_method`, `harvest_interval`, `reentry_interval`, `weather_window`, `application_history`, `protective_equipment` and `environmental_restrictions`. Each has exact English question text, a label page or section, the required label condition and answers `yes`, `no`, `not_sure`. Wording asks whether that precise condition can be met; yes is the only passing value. No answer is preselected. If more than eight independent questions or an unsupported condition type is necessary, the product is not eligible in this release. Every label condition must either map to one of these questions or be recorded as genuinely not applicable with its label source; it cannot be silently omitted.

For example, a harvest interval question asks whether the farmer can wait the exact label interval, rather than requiring the app to infer a harvest date. Crop stage and method questions state the exact label requirement. The label supplies any number in the question. The app accepts no free text reinterpretation, arithmetic input or inferred answer. A no, Not sure or unanswered required question withholds rates and identifies the unmet item. These are farmer declarations, not a verification of actual field conditions.

The farmer must also affirm: I have this exact product, concentration and formulation. In the draft Tok Pisin path the entire chemical group, including questions, label rate and precautions, is visibly English and requires an explicit Show English label details choice before proceeding. No rate is automatically translated. Dismissing that choice or changing language clears chemical confirmation; it does not change the screening evidence.

There is no tank mixture calculator, unit conversion, spray calendar or brand substitution. Rates are label reference facts within a conditional product group, not an automatic directive to spray an unconfirmed disease.

### Shared eligibility and report context

Create one pure `chemicalEligibility` function shared by server and report logic. Inputs are the checked target evidence, current RegionContext and context revision, current catalogue and versions, product ID and label hash, all required answers, identity confirmation, selected locale, explicit English label acceptance and a trusted current time. Outputs are either a complete eligible chemical group or fixed reason codes: `no_target`, `insufficient_evidence`, `region_unknown`, `no_local_record`, `label_unverified`, `label_expired`, `identity_unconfirmed`, `conditions_unanswered`, `conditions_not_met` or `english_not_accepted`.

`ChemicalContext` is temporary client input containing result ID, context revision, product ID, label hash, catalogue version, a dictionary of at most eight finite question answers, identity confirmation and English label acceptance. It contains no caller supplied rate or product facts. Bind it to the selected locale. Clear it on photo, answer, region, product, label, catalogue or language changes. A client confirmed boolean alone is never enough for preview or export.

Extend `/api/guidance` to accept this optional context alongside its existing signed result and explicit region. It verifies the result and current versions, uses current catalogue facts and server UTC time, and runs `chemicalEligibility`. Unknown fields, product IDs or question IDs are rejected as local validation errors without erasing findings. Return a signed `aiAdvice` snapshot with the input context digest, locale, result ID, context revision, versions, source facts, decision codes, `checkedAt` and `validUntil`. Validity ends at the earliest label deadline, signed session expiry or ten minutes after the check. Product facts and restrictions come exclusively from the server record.

Run this endpoint when the farmer submits the completed product check, not on every answer change. Editing an answer immediately hides any rate until resubmission. Before every PDF download or Print action that could include a chemical group, revalidate through this endpoint and rebuild the frozen report from its fresh response. If the check fails, expires, or reports changed facts, preserve the case and offer a clearly described report without chemical rates. No stale rate is silently included. The app Print button uses the same guarded action; after validation, wait until that refreshed view is rendered before invoking print. Native browser printing cannot perform a server request reliably, so print CSS hides chemical groups unless the guarded app action has set a temporary print validated state for the current fresh snapshot. Clear that state after print and on any context change. This does not hide ordinary findings or care text.

The report builder applies the same pure eligibility function to the frozen context and fresh snapshot, and checks the context digest and versions. It never accepts a raw confirmed flag. Any chemical group that is eligible is exported in full, with its label rate and units, method, all precautions, harvest and reentry intervals, source URL and revision, review status, check time and the statement that label facts do not confirm the diagnosis. In a Tok Pisin PDF the full group is English, with a visible draft Tok Pisin explanation of that choice. Collapsing supporting UI detail does not hide an otherwise eligible group from export.

### Contracts, versions and APIs

Keep the same routes and session origin checks. Extend `/api/assess` final structured output with bounded care selections, target IDs and sign evidence. The model never returns a product selection or dose. Keep selections empty in the preliminary response. Validate core findings first, then sanitize optional advice independently before constructing and signing the result. `/api/guidance` performs pure region and catalogue reselection from the signed result, adding a separate `aiAdvice` snapshot rather than modifying approved guidance entries. Its optional ChemicalContext submission and fresh checks add HTTP requests only, not model rounds. Use the existing guidance allowance; group answers in one submission and show its existing retry message if exhausted.

Increment schema to 3, prompt to `coffee-analysis-7`, policy to `coffee-analysis-4`, and add care and chemical catalogue versions to the signed content contract. Include care selections, target evidence and catalogue versions in the canonical hash. Assert versions at assessment, region update, translation and report boundaries. Older cases receive the existing version changed behavior, preserving local photos and answers but requiring a fresh check. Fixed care strings are locale content; they are not added to generated text translation requests. Chemical values are not automatically translated.

Reuse the current final Gemini request and quotas. Increase the output cap only if the real bounded output requires it, within the existing allowance. No new model request is added for choosing a product or changing country. Logs contain version and request metadata, never farmer data or credentials.

### Value sourcing

| Value | Source |
|---|---|
| Photo findings and possible causes | Existing checked final Gemini output and server reference checks |
| Care identifiers and target evidence | Bounded final Gemini output, sanitized against fixed IDs and eligible observation links |
| Product identifiers | Deterministic current country and target catalogue selection, never generated product wording |
| Farmer country | Existing explicit RegionContext |
| Action wording and translated draft | Fixed locale catalogue content with source mapping |
| Product, rate, method and precautions | Exact verified local label record, not Gemini text |
| Local product eligibility | Recorded registration, source scope and current label verification |
| Review label | Actual unreviewed AI path or independently approved GuidanceEntry |
| Required label answers and product confirmation | Explicit finite farmer answers and identity confirmation in ChemicalContext, validated against each exact record |
| Freshness | Server UTC clock, verification record, seven day recheck policy and signed snapshot deadline |
| PDF content | Fresh server revalidation, frozen ChemicalContext, matching digest and versions, then the shared chemicalEligibility function |

### Interface and reports

Use the current Organic design. Replace the hardcoded unavailable advice panel with a short heading such as AI suggested care, an unreviewed label and up to three action bullets. Sources and supporting scope stay in a disclosure. Show Chemical options below only when relevant, with either eligible products or one specific availability limitation. Avoid repeating the same warning in each card. Keep independently reviewed guidance visibly separate when it becomes available.

Step 4 remains focused on saving the report. The full preview and PDF carry the selected advice and complete source details. Do not print hidden chemical rates merely because the full preview is collapsed. That is an eligibility rule, not omission of otherwise eligible content. All visible confirmed label facts must be preserved in the PDF. English fallback is explicit in the Tok Pisin path; ordinary care text stays labelled draft.

### Failure behavior

Advice selection is optional output and must not destroy valid core screening. Discard an unknown, duplicated or unsupported care selection or target sign, preserve checked findings, and return an `invalid_selection` or `insufficient_evidence` advice limitation. If the optional advice portion is structurally malformed, normalize it to no selections before the strict core result is checked. This parsing boundary accepts only JSON objects and finite expected optional keys; it does not salvage invalid core evidence, malformed JSON or untrusted arbitrary fields. Core schema, photo, observation and diagnosis reference failures still fail the assessment as before.

Missing catalogue coverage, unknown region, stale label, incomplete local use evidence and missing farmer declarations are advice limitations, not service failures. They preserve useful photo findings and available care checks. Product form validation is a local validation error, so it does not offer an incomplete screening report. A failed freshness request offers a report without chemical rates rather than reviving a stale rate. An empty chemical catalogue is not a request failure.

## Build plan

1. Add separate catalogue contracts, version binding and source records, without approving reviewed guidance. Covers AT-1, AT-2, AT-8 and AT-9.
2. Extend the real final request with ID selection and strict evidence checks; exercise one PNG care journey and an unchanged or unsupported control. Covers AT-1, AT-4, AT-9 and AT-10.
3. Add advice reselection and the clear Step 3 panel, record driven label questions, product identity confirmation, shared eligibility, fresh server revalidation and explicit language fallback. Covers AT-2 through AT-6 and AT-8.
4. Carry eligible advice, status and label facts through the full preview and both PDFs; render every sample page. Covers AT-7 and AT-10.
5. Run meaningful contract and eligibility checks: invented or duplicate IDs, nonleaf images, unclear evidence, another country, unknown country, expired or incomplete label, different formulation, each no or unknown condition answer, no product confirmation, context digest mismatch, context or catalogue changes, ambiguous rate labels, stale snapshots, failed preexport checks, preserved findings after invalid optional advice, and English fallback. Record controlled fixtures separately from real provider and real label evidence. Covers AT-1 through AT-10.

## Rollout and completion

Build and verify locally with light checks, then use a remote production build and the existing public service. No simulator or local production build is required. No new IAM roles or purchases are proposed. Roll back to the prior Cloud Run revision if the real journey fails. Runtime and in memory versions invalidate old envelopes; there is no permanent case migration.

Care can be released separately once its source records, UI and real journey pass. Chemical source intake and selection can be built with an empty live catalogue, but AT-2, AT-3 and live chemical completion remain pending until a real current product label and registration match are verified. Do not report chemical dose support as complete from fixture tests. No independent agricultural or worldwide validation claim follows from this feature.

## Consequences and follow up

This gives useful AI suggestions without waiting for an unavailable reviewer, while keeping the source and review status honest. It restricts numerical chemical facts to evidence the app can actually trace. The initial PNG care coverage does not establish worldwide applicability. A label upload journey, additional countries, rate ranges or calculation based labels, and further condition specific treatment sources are later slices.

The reviewer pack remains useful for improving and independently reviewing the AI path. Its pending statuses must not be rewritten to imply completed review.

## References

- Existing code: `src/lib/contracts.ts`, `src/lib/server/gemini.ts`, `src/lib/server/policy.ts`, `src/lib/guidance.ts`, `src/components/screening.tsx` and `src/lib/report.ts`.
- [Existing PNG review pack](../content-review/png-coffee-leaf-rust-review.md).
- [ACIAR PNG training package](https://www.aciar.gov.au/publication/MN220-PNG-coffee-manual-4), and [Module 5](https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf), printed pages 13 to 15 and 51 to 53. Copyright 2023, publication page release 2024. These are management sources, not current product registration records.
- [CIC handbook](https://www.cic.org.pg/wp-content/uploads/2021/08/52029_CIC-Handbook.pdf), second edition 2016, section 8.1. Historical chemical tables do not establish current product eligibility.

## Review resolution, 15 October 2026

You authorised applying all seven recommendations from the same model review:

1. Required farmer context is now explicit, record driven, finite and never inferred.
2. Cause targets and the initial rust sign rule are finite and separate from reviewed diagnosis.
3. The server selects products by current country and target; country edits need no model round.
4. Initial care records now specify exact English, draft Tok Pisin, source pages, original text use and evidence limits.
5. One eligibility function, a bound ChemicalContext and fresh server checks govern preview, PDF and print.
6. A seven day verification policy, explicit publication process and single unambiguous rate rule replace undefined freshness and rate selection.
7. Invalid optional advice no longer erases valid findings; invalid core evidence still fails.

No app change is implemented by this proposed specification. Acceptance of this revised design is still required before implementation.
