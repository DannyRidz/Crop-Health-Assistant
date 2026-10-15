# PNG coffee leaf rust guidance review pack

Prepared: 15 October 2026. Status: DRAFT, not approved or published as farmer guidance.

## What to send

Share the [three page companion PDF](../../output/pdf/reviewer-pack/png-coffee-guidance-review.pdf), the live app at https://coffee-leaf-check.web.app and the reviewer's chosen example reports. Ask permission before sharing any farmer's photos, answers or report. The pack contains no farmer records or private contact details.

Suggested message:

> We are building Crop Health Assistant for coffee farmers. Could you review a short draft about coffee leaf rust for PNG? Please check the proposed care steps, the situations where they apply, and the signs that need another examination. We also need advice on suitable labelled photos for testing. This is a review of specific content, not a request to certify the whole app. Please record corrections and the exact area you reviewed.

The teammate arranges the reviewer and returns the completed form. The builder records the review, resolves corrections and verifies the approved app behavior. No contact or message has been sent on the team's behalf.

## Narrow scope

First candidate: `coffee_leaf_rust`, coffee leaves, English, proposed country PG. The reviewer must confirm the actual country or narrower area, plant stage and coffee type covered. PNG is a proposed applicability scope, not a completed review. This does not cover other countries, other crops, every coffee disease, chemical prescriptions or Tok Pisin approval. Brown eye spot and other lookalikes are comparison cases for evaluation, not a second treatment feature.

## Sources the reviewer can inspect

S1. ACIAR, Smallholder coffee production in Papua New Guinea, Farmer Training Guide, Unit 2, Module 5, Pest and disease management. The PDF credits Curry, Tilden and Aroga (2023); the publication page lists release on 7 August 2024. Printed pages 13 to 15 cover shade, drainage, pruning and weeds. Printed pages 51 to 52 cover coffee leaf rust; page 53 introduces brown eye spot. PDF viewer pages are six greater than printed page numbers.

- Publication: https://www.aciar.gov.au/publication/MN220-PNG-coffee-manual-4
- Document: https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf
- Rust management: printed page 52, PDF page 58, https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf#page=58

S2. Coffee Industry Corporation, The Papua New Guinea Coffee Handbook, second edition (2016), section 8.1, Coffee leaf rust. Background for the officer to compare with current practice. Its age means chemical tables must not be treated as current local prescriptions.

https://www.cic.org.pg/wp-content/uploads/2021/08/52029_CIC-Handbook.pdf

Sources accessed 15 October 2026. Source publication in PNG is not a review of this app or this draft. The ACIAR PDF states copyright and prior permission conditions on its copyright page. No open licence is asserted, no source images or pages are redistributed, and app reuse permission remains pending. The draft uses original wording. Permission status must be resolved before publishing an entry; expert agreement does not settle source rights.

## Candidate farmer wording, G1, English

**Proposed heading: Care steps to discuss for your PNG coffee garden**

1. Check existing drains for blockages and avoid leaving water around coffee roots.
2. Manage weeds without injuring coffee roots or stems.
3. Have the shade, pruning and soil nutrition plan checked for this garden.
4. Do not choose a spray from a leaf photo alone.

This is a draft for review, not advice to follow now. Items 1 to 3 are paraphrased proposals based on S1, printed pages 13 to 15 and 52. Item 4 is an app boundary. These are management measures, not a promise of cure. The officer should replace vague instructions with practical local wording where appropriate. No product, dose, fixed pruning method, burning instruction or shade percentage is proposed.

## Reviewer form

Reviewer name and relevant role: ______________________________

Organisation or independent practice (if applicable): ______________________________

Review date: ______________________________

Exact reviewed country / area, coffee type and plant stage: ______________________________

For each G1 item, record Approve, Edit or Reject, the corrected text and its source. Partial approval does not approve the other items.

| Item | Approve / Edit / Reject | Corrected wording, reason and source |
|---|---|---|
| G1.1 Drainage | | |
| G1.2 Weeds | | |
| G1.3 Shade, pruning and nutrition | | |
| G1.4 Spray boundary | | |

Please answer:

- Can these steps be shown when rust is only suspected, or only after another examination? What evidence and exclusions are required?
- Which locations, coffee types, seasons or plant stages make any item unsuitable?
- What practical signs should make a farmer seek prompt field assistance? Supply wording and a source; no threshold is assumed by the team.
- What observations distinguish rust from brown eye spot, injury and an unclear photograph? What additional view is required?
- Are these words understandable to a farmer without agricultural training?
- Which exact source version and sections support your corrections?

Overall content decision: Pending / Approve with recorded scope / Changes required / Reject

Corrected final English text: ______________________________

Regional restrictions and exclusions: ______________________________

Evidence used: Published guidance / Photo review / Field examination / Other: __________

Reviewer confirmation of the recorded decision and scope: ______________________________

Only complete an approval after reviewing the final text. This form does not certify the AI, approve chemical use, or approve every future generated report. A Tok Pisin translation needs a separate fluent meaning review.

## Labelled photo and evaluation request

Ask for permitted examples of rust, healthy looking leaves, brown eye spot or another lookalike, and unclear or unsuitable photos. Include both leaf surfaces where available. Record image ID, rights and allowed uses, source country, coffee type, plant stage, known label, who assigned it, and whether the basis was a photo opinion, field examination or laboratory result. Unknown is valid. Do not treat AI output as a reference label.

Keep evaluation cases separate from prompt tuning cases. Record each reference label, the app's observation and tentative cause, missing or incorrect signs, false reassurance, and whether guidance was correctly withheld or shown. The reviewer and builder must agree the supported feature rules and acceptable error criteria before evaluation. No sample size, accuracy score or pass threshold is invented here. One successful case does not establish accuracy or worldwide validity.

## Engineering handoff, not a request to enable now

The existing `approvedEntry` and `selectGuidance` functions require approved agricultural and regional reviews, verified permissions, complete source metadata, matching explicit region, and the matching reviewed condition. Tok Pisin entries additionally need fluent approval. The supplied JSON is a draft record outside runtime content and is not imported into the app.

The live registry still has coffee leaf rust disabled, guidance empty and reviewed follow up questions empty. AI possible causes are free text hypotheses; they are not evaluated registry conditions. Current final results do not provide a matching reviewed condition ID, so approving a content record alone cannot make it appear. Do not match advice by a substring in an AI disease name or change flags to bypass this distinction.

After the reviewer returns the pack:

1. Record exact corrected text, review scope, reviewer and date; resolve reuse permission.
2. Complete the reviewed feature rules and held out evaluation for the narrow condition under the existing M2/M3 plan.
3. Record Tok Pisin review separately, or retain an explicit English only choice with truthful availability wording.
4. Connect eligible guidance through the existing region and condition checks. Verify known PG, a narrower area if required, another country, Not sure, skipped country, lookalikes and insufficient evidence.
5. Verify result and PDF content, translations and citations before publishing. Change the pending review notice only for the scope actually completed.

No live app changes, cloud deployment, API requests or purchases are needed to prepare this pack. M3 and agricultural release validation remain pending.

## Preparation verification

All three PDF pages were rendered and visually inspected for heading hierarchy, field spacing, wrapping, margins and page numbers. Each page is A4 and clearly marked draft. JSON review and permission statuses remain pending, reviewer and review date fields remain empty, and the candidate targets PG only. The runtime registry and source code were not changed. No live farmer data, model request, deployment, purchase or outbound message was used for this preparation.
