# 0003. Useful coffee screening reports

**Date**: 2026-10-15
**Status**: In Progress

**Approval**: You accepted the revised design and authorised implementation on 15 October 2026. Named conditions and guidance remain subject to their existing review and evaluation gates.

## Summary

Give farmers a clear account of the changes visible in their coffee leaf photos, what remains unknown and what information would help next. Give an agricultural officer the same findings together with the supporting photos and farmer answers. Build this into the existing app, then finish the narrow cause assessment already planned in M2, enabling a named condition only after review and evaluation.

## Context

The real comparison of two supplied images found different visual observations but the same headline, “Cannot tell the cause.” The green leaf report described green surfaces and small edge tears. The spotted leaf report described brown spots and yellow halos. Neither image has a verified case label for this comparison. This demonstrates a product gap, not measured agricultural accuracy. Evidence is recorded in [the comparison](../validation/two-leaf-comparison-2026-10-15.md).

The current Gemini instructions prohibit disease names and the server always selects `unable_to_assess`. The condition registry and reviewed question bank remain disabled. Removing the wording restriction alone would leave the missing decision logic and agricultural evidence unresolved. A useful visual report can be delivered while those resources are collected, but it will not complete the promised cause assessment.

This is an enhancement to [0001](0001-coffee-mvp/index.md), particularly scope features 6 and 8, with feature 7 retaining its content gates. It does not restart the project or mark M2, M3 or farmer validation complete. If approved, the visual finding contract below refines the existing universal status behaviour. The four existing agricultural statuses continue to mean what 0001 defines.

## Requirements

As a farmer, you should understand what the app saw and what would make the check more informative. As an officer, you should receive an organised case record and be able to distinguish a visible observation, a farmer statement and an unconfirmed interpretation.

| Criterion | Observable outcome |
|---|---|
| UR-1 | Usable coffee leaf photos receive a separate visual finding summary. It distinguishes visible changes, no clear changes identified and insufficient usable evidence. It never certifies health or a cause. |
| UR-2 | Up to six observations reference the supplied photos. The result and PDF distinguish AI observations from farmer answers and preserve useful specific findings when cause assessment or regional guidance is unavailable. |
| UR-3 | The farmer sees a short summary, key findings and up to two relevant information requests before supporting detail. An officer can read all photos, answers, evidence links, uncertainty and coverage limitations in the report. Collapsing detail never removes PDF content. |
| UR-4 | A supported information gap leads to a concrete collection request. Absent cause coverage is explained separately, including that another photo cannot enable it. With no supported collection gap, no collection request appears. |
| UR-5 | Cause assessment considers at most one enabled reviewed condition initially. An eligible suggestion identifies supporting evidence, material missing or conflicting evidence and the condition review scope. No matching eligible condition means no invented alternative disease list. |
| UR-6 | Unsupported crop or part, unusable images, conflicting evidence, absent coverage, invalid provider output and request failure remain distinct. Failure never becomes a fabricated agricultural finding. |
| UR-7 | The four starter questions remain. At most two additional questions come from the approved bank in one round. Not sure and skipping optional questions are supported. With no approved bank, no extra questions appear. |
| UR-8 | English and draft Tok Pisin present the same evidence and decisions. Region changes affect guidance and report context without changing visual findings or causing a new screening request. PNG review is identified explicitly and is not presented as worldwide validation. |
| UR-9 | PDFs remain readable A4 records with a useful summary first, numbered photo references, complete inputs, timestamps, farmer region, limitations and eligible source and review information. Images, captions and headings remain grouped appropriately. |
| UR-10 | Old results, translations or report exports cannot be reused after relevant inputs or content versions change. Existing consent, origin, cookie, privacy, quota and spending controls remain enforced. |
| UR-11 | Real tests on the two supplied photos demonstrate differentiated findings without treating their appearance as a verified disease label. Named condition release separately requires specialist review and evaluation on independently labelled cases. |
| UR-12 | The final AI analysis can name up to three tentative possible causes without waiting for external review. Each explanation names supporting observations, uncertainty and a concrete next observation check. Unsupported photo evidence and invented source IDs are rejected. Preliminary output has no cause list. |
| UR-13 | The app and PDF distinguish AI hypotheses from independently reviewed screening and regional treatment guidance. Switching language preserves the same hypotheses and sources. Lack of regional guidance does not suppress the AI explanation. |

These supplement original AC-3 through AC-14, AC-17 and AC-19. UR-12 and UR-13 record your later explicit change: the review gate in UR-5 and UR-11 applies to independently evaluated condition claims, not to displaying clearly qualified AI hypotheses. No agricultural accuracy or worldwide validation is claimed.

## Options considered

1. **Change only the headline.** Small change, but it leaves the report structure, missing information and absent cause logic unresolved.
2. **Improve the existing checked result in stages. Recommended.** Preserve the working journey and add an independently useful visual summary and case record. Complete the reviewed cause logic as a separate gated step in the same design.
3. **Replace screening with unrestricted disease generation.** It could produce more names immediately, but would remove the existing evidence and review boundary and still offer no measured reliability. Rejected.

## Decision

Choose option 2. Keep the current application, Gemini service, four screens and temporary session. Separate visual findings, cause screening and regional guidance so the absence of one does not erase useful evidence from the others.

Implementation uses the installed develop, frontend-design, test, check verify and sync skills under the existing project rules. No new vendor, database, model service, credentials or purchase is proposed.

## Rationale

Farmers need a meaningful finding before a referral. Officers need a traceable case record rather than a generated assertion. Separating these layers makes the current limitation explicit without presenting an unreviewed disease suggestion as progress. The first build can improve usefulness now; the second still needs specialist supplied rules and evidence before a named cause is enabled.

## Feature design

### Authorised change: AI led cause explanations

After approving implementation on 15 October 2026, you explicitly asked for the AI to analyse possible causes without depending on an unavailable agricultural reviewer. This direction replaces the blanket prohibition on AI disease names and the requirement to wait for external review before showing tentative explanations. It does not establish expert qualifications, diagnostic accuracy or worldwide agricultural validation.

The app will provide up to three tentative AI explanations in the final result. Each contains a short possible cause name, one plain explanation of why it may fit, at least one supporting observation ID, a specific uncertainty and one useful observation or information check. These come from the same final Gemini request. Preliminary output contains no cause explanations. A usable supported photo and a referenced eligible observation are required for each explanation. Unsupported or unusable evidence cannot support a hypothesis. No obligation to fill the list exists; an empty list must have a concrete model explanation of why the case cannot be narrowed down. This is distinct from disabled reviewed screening coverage.

The output ceiling is 3072 tokens to accommodate these bounded explanation fields, replacing the original 2048 token ceiling. This also applies to translation of the same checked content. Existing request deadlines, attempt limits, no automatic retries, one instance limit and the USD 20 spending allowance remain unchanged. No extra screening round is added.

Source material supplied to Gemini consists of short paraphrased excerpts from the American Phytopathological Society's coffee rust profile and the University of Hawaii's coffee rust identification publication, including its comparison with Cercospora leaf spot. Source IDs resolve to fixed app owned titles, links and section references. Gemini cannot invent a source link or imply that a source has reviewed this case. It may propose other evidence linked causes from model knowledge, explicitly labelled when no supplied reference supports them. Source geography is recorded and the material is diagnostic background, not treatment approval for the farmer's country.

Display “Possible causes” and explain that these are AI explanations rather than a confirmed diagnosis. For each, show why it may fit, what remains uncertain and what to check next. Name the existing linked photos and keep all explanation fields in the signed content hash, translation and PDF. Keep farmer answers separate from photographed evidence. At most three explanations and one next check per explanation keep the result readable. These next checks are observations, not another question round or an automatic request.

The regional guidance mechanism remains separate. No location specific treatment suitability can be inferred from these hypotheses. Specific chemical products and dosages remain out of scope because the app has neither a confirmed diagnosis nor local product approval data. When local guidance is absent, explain that limit without replacing the AI's actual analysis with a referral. An officer is an optional escalation for uncertain or consequential decisions, not a prerequisite for using the analysis.

Implementation first adds the explanation contract, grounded reference context and checked evidence bindings, then the farmer and officer presentation. Meaningful tests reject invented references, hypotheses without eligible observations and preliminary hypotheses. Real checks compare both supplied photos and inspect both language PDFs. The model may return different wording and a reasonable healthy looking leaf may still show minor damage. Neither demonstration photo is a verified diagnostic label. Independent agricultural and farmer evaluation remain outstanding quality work, rather than a prerequisite for displaying clearly qualified AI hypotheses.

This section takes precedence over conflicting references elsewhere in this document to no disease names, one reviewed condition as the only possible cause output, and waiting for a reviewer to enable AI explanations. The original reviewed condition registry and reviewed regional guidance stay disabled; they must not be presented as independently validated merely because AI hypotheses are now available.

### Farmer result and officer report

The result opens with a plain visual headline, followed by at most three key observations and a separate cause assessment line. Preserve the validated provider order and select the first three observations linked exclusively to eligible photos, as defined below. This order is not a severity ranking. Display all remaining observations in supporting detail, identifying any excluded photo references. Do not use a colour or icon that implies an established urgency level.

Proposed fixed English headlines:

| Visual finding | Headline and caveat |
|---|---|
| `changes_visible` | “Changes are visible on this leaf.” Follow with the actual observed changes. This does not establish a cause or severity. |
| `no_clear_changes` | “No clear changes were identified in these photos.” Keep “A photo cannot confirm that the plant is healthy” visible. |
| `insufficient_evidence` | For an unsupported crop or part, “This check supports coffee leaf photos.” For an uncertain crop or part, “The app could not identify a coffee leaf clearly.” Otherwise, if quality prevents usable evidence, “These photos do not give a clear view of the leaf.” For unclear or absent observations despite usable photos, “The app could not describe the visible changes clearly.” Use this precedence and the checked reason, without inventing a camera quality problem. |

Cause coverage is a separate line. When no condition is enabled, say “The app can describe these photos, but screening for specific causes is not available yet. Another photo cannot enable cause screening.” Keep this near the findings rather than burying it in a disclosure. This limitation is not a collection request and does not consume one of the two request slots. When coverage exists but does not support a match, show the appropriate existing agricultural status and coverage scope. Never interpret no match as a healthy plant.

Next information contains at most two useful case requests. It can identify a missing view or ask the farmer to record an unresolved fact for the officer. It is not an agricultural treatment recommendation. The officer referral remains where regional guidance is absent, after the specific findings and information gaps.

The PDF opens with reference, assessment time, region, visual summary, key observations, cause assessment and next information. It then includes numbered processed photos with their stated sides, all answers including Not sure, all remaining observations and limitations, approved cause evidence if any, applicable guidance with sources and actual review scope, and sharing and language notices. An answer such as “several leaves” is attributed to the farmer, not presented as something inferred from a single photo.

### Canonical data and value sourcing

Canonical means the checked result from which both languages and the PDF are produced. Retain the current assessment identifiers, input and context revisions, signed envelopes and text hash. Add the following fields through a versioned contract rather than changing the meaning of an existing signed result.

| Value | Source and validation |
|---|---|
| Observation feature | Version 2 requires exactly one tag per observation: `discolouration`, `spots_or_patches`, `surface_material`, `edge_damage`, `shape_change`, `no_distinct_change` or `unclear`. It remains an AI observation, not verified truth. Existing plain text and actual photo references remain required. Missing or unknown tags fail schema validation, rather than being inferred from prose. |
| Visual finding | Server derives it from the retained final photo checks, observation tags and photo references using the policy table below. Preliminary checks cannot supply missing final evidence. |
| Cause coverage | Server registry supplies enabled condition IDs, version, reviewed crop and part, evidence rules, screening scope and review metadata. An empty eligible set yields `not_available`; it is not a model decision that the cause is unknowable. |
| Agricultural status | Server policy applies 0001's four status rules to eligible coverage and validated evidence. Legacy `unable_to_assess` may remain internally for empty coverage, but the primary display explains coverage separately. No enabled condition means no `possible_supported_issue` and no `no_clear_supported_signs`. |
| Possible condition | At most one registry ID. Require the reviewed rule's necessary evidence, referenced observation IDs, usable supported photos and no unresolved material contradiction. Model supplied reasoning cannot approve its own eligibility. Display the registry's tentative wording, actual review geography and limitations. Missing reviewed screening rules means ineligible. As in 0001, changing region does not alter the checked status or create an implication of worldwide validity; geographically restricted guidance is selected separately. |
| Supporting, conflicting and missing evidence | Each condition rule has a reviewed requirement ID. Its checked outcome is `supported`, `missing` or `conflicting`, with at most six existing observation or answer references. A missing requirement may have no reference; its label comes from the rule. Other outcomes require references. The registry's reviewed predicates determine these outcomes. Do not infer them from arbitrary model prose or builder selected colour keywords. Store at most six requirement outcomes for the initial condition. |
| Next information | Server selects at most two fixed collection prompts using the ordered rules below. Each has a fixed prompt ID and its triggering photo or answer reference. These prompts ask for photos or records and add no AI round. Condition specific questions require the approved question bank. |
| Cause limitations | Server coverage and rule failures plus bounded validated model limitations. Model reported conflicts remain labelled as AI reported uncertainty, with checked references, not corroborated facts or automatic condition rule failures. A reported conflict that cannot be represented by the reviewed rules prevents a possible condition suggestion pending review; it never establishes a competing cause. |
| Guidance | Existing signed guidance snapshot matched to the farmer's explicitly stated region and approved content. No matching region or unknown region preserves findings but withholds restricted advice. Interpretation scope never implies treatment applicability. |
| Language | Fixed labels from locale files. Generated observations and limitations use the existing keyed translation and hash checks. Preserve original farmer free text. Draft Tok Pisin remains labelled; failed translation requires the existing explicit English fallback choice for export. |
| Metadata and report | Current assessment, photo IDs and sides, exact selected answers, result time and timezone, explicit region response, current versions and guidance snapshot. No inferred identity, precise location, diagnosis, yield loss, severity or urgency. |

### Visual policy and collection rules

An eligible photo has a final check with `quality=usable`, `crop=coffee` and `part=leaf`. Require exactly one final check for every supplied photo, no extras, and valid unique observation IDs. Each observation references one or two actual photos. An eligible observation references only eligible photos. The first five feature tags describe changes; `unclear` and `no_distinct_change` do not establish a change.

Apply the visual policy in this order:

| Order | Condition | Outcome |
|---|---|---|
| 1 | At least one eligible observation has a change tag. | `changes_visible`, preserving explicit limitations for all excluded photos and unclear observations. |
| 2 | Every photo is eligible, every photo has at least one linked observation, there is at least one observation, and all observations have `no_distinct_change`. No model reported uncertainty disputes those observations. | `no_clear_changes`, with the visible plant health caveat. |
| 3 | Any other valid response, including zero observations, only unclear tags or incomplete photo coverage. | `insufficient_evidence`, with the actual reason and appropriate headline. |

An observation has exactly one tag, so conflicting tags on one observation are invalid. Different observations may describe different areas of the same leaf, including a green surface and a damaged edge. That is not automatically a contradiction. A structurally valid model report of uncertainty is preserved as uncertainty and blocks reassurance; software validation does not establish that the report is agriculturally true.

Mixed supported and unsupported photos can retain a visual finding from eligible evidence. For agricultural status, preserve 0001's stricter unsupported crop or part rule: force `unable_to_assess` and suppress a condition suggestion and condition guidance if any photo is explicitly unsupported. Do not use an observation from an excluded photo to support a condition. These distinct layers must be explained together in the report.

Select collection prompts in the following order, remove duplicate prompt IDs and stop at two:

1. If a photo is blurry, dark or incomplete, use one `replace_unclear_photos` prompt identifying all affected photo numbers. It asks for clear replacement photos with the whole leaf visible. Suppress other missing view prompts until these replacements are usable. Unsupported crops or parts instead receive the scope explanation, not repeated photography requests.
2. With at least one eligible photo and no unresolved quality replacement, use one missing view prompt. If only upper views are known, request an underside view; if only underside views are known, request an upper view. If all eligible sides are unknown, ask the farmer to identify the sides or prepare upper and underside views for the officer. An unknown side never counts as proof a specific view is present. If both sides are known and usable, make no view request.
3. If onset is Not sure or unanswered, request recording when the changes were first noticed, if known. Then, if spread is Not sure or unanswered, request recording whether one or several plants are affected, if known. Do not imply the farmer must know either answer.

These are optional collection notes. They do not open another question round or initiate a request. Adding or replacing a photo follows normal invalidation, and another screening happens only when the farmer explicitly submits it. Existing limits still allow only two photos in the app; additional views can be collected for the officer outside this assessment.

### API, state and failures

Use the existing same origin assess, guidance, translation and PDF flow. No new endpoint is required. Schema version 2 carries retained final photo checks, visual tags, derived finding and reason, distinct conflicts, coverage reason and collection prompt references. Signed results also bind schema, prompt, policy and condition registry versions. Include every generated observation, limitation and uncertainty string in the signed text hash and existing translation size checks. Fixed labels and collection prompts come from the locale files and are not translated by Gemini.

Add `photoRevision`, initially 1, incremented only when photos or stated sides change. Keep `inputRevision` for photos, stated sides and starter or follow up answer edits. The preliminary response's arrival guard still checks the captured current input revision; its signed envelope binds assessment ID, photo revision, ordered photo IDs and sides, digests of the normalised uploaded image bytes, schema and question bank version. The server verifies these bindings against final uploads. It does not require the preliminary input revision to equal the later final answer revision. Farmer answers are expected to change between these requests.

For the later bounded question slice, the preliminary request selects at most two question IDs using only photo evidence and the bank's approved photo based selection rules. Bank entries that require starter answers for selection are ineligible in this two request journey. Suppress questions duplicating the four starter topics. The signed preliminary envelope binds the exact selected IDs and bank version. The final request accepts only those questions, with valid option IDs; an omitted selected question means skipped, and Not sure remains an explicit allowed option. Reject duplicate or unknown IDs and answers to unselected questions. Starter answer edits preserve the selected bank questions; photo or side edits clear them and require a new preliminary request. Final never opens another question round. Preserve the existing preliminary then final request count.

Photo or answer edits invalidate screening and export. Region edits invalidate guidance and report context only. Language changes preserve evidence. Retain the export language lock, stale response guards and incomplete reports for service failures. Local validation errors do not offer an incomplete report as though screening occurred.

Use these version invalidation rules:

| Change | Invalidated artifact and recovery |
|---|---|
| Schema, prompt, policy or condition registry version | Previous screening cannot be presented or exported as current. Preserve local inputs, offer the incomplete record and require an explicit new check. No automatic paid request. |
| Photo bytes, order, IDs or stated sides | Clear preliminary, selected questions, final result, translations, guidance and complete report eligibility. Increment both revisions. |
| Starter or follow up answer | Clear final result, its translations, guidance and complete report eligibility. Increment input revision only, retaining preliminary and selected questions for the same photo revision. |
| Farmer region or guidance content version | Clear guidance and report context; reselect guidance without Gemini. Preserve screening and its generated text. |
| Glossary version | Clear translated variants and translated export eligibility only. Preserve English evidence. A fresh translation requires the existing explicit user action and quota. |
| Locale or report layout | Reformat current checked data without reassessment. Retain the explicit English fallback requirement and export language lock. |

Condition registry version and guidance content version are separate constants in version 2, so an edited guidance entry does not force a new paid screening. The signed guidance snapshot binds its content version, result ID and context revision. A mismatch during an action produces an explicit stale content or compatibility response, never a silent conversion or paid retry.

Review geography records where screening rules and evaluation were reviewed. It is displayed as evidence of that limited review, not a global applicability claim and not a farmer region filter. Condition eligibility uses the reviewed crop, part, image quality, evidence predicates, exclusions and evaluation gate. If a proposed rule needs farmer region to decide the condition, it remains ineligible under this design until a separate change to 0001's regional invariant is approved. Only guidance uses explicit farmer region matching. Unknown region never removes visual findings.

The server retains the existing strict schema, origin, session, signature, upload, timeout and quota checks. Farmer data stays temporary under the existing privacy notice. Logs must not contain photos, raw answers or generated case text. No extra paid request is introduced by summary formatting or PDF creation.

### Critical verification scenarios

| Scenario | Criteria and evidence |
|---|---|
| Supplied 671.jpg and 1741.jpg | UR-1 through UR-4, UR-9 and UR-11. New real requests, equivalent answers and region. Confirm useful descriptions of the differing visible features and photo links, not exact generated wording. Neither is a labelled accuracy case and the spotted image must not be forced to match rust. |
| Blurry photo, non coffee image, unsupported part and mixed usable plus unusable photos | UR-1, UR-2 and UR-6. Controlled fixtures test policy separately; real image checks confirm actual provider behaviour where permitted. No false reassurance or invented result on request failure. |
| Disabled, unknown and out of scope condition; missing evidence; competing evidence | UR-5 and UR-6. Deterministic policy tests reject ineligible suggestions. Fixtures are software evidence only. |
| Approved question selection, empty bank, skip, unknown or extra answer, stale preliminary envelope | UR-7 and UR-10. Answering all starter questions keeps the same photo envelope valid. Changing a photo or its side invalidates it. At most one bounded round, no invented question and no extra request for a skipped answer. |
| No observations, unclear tags, one excluded photo, conflicting model text and missing coverage | UR-1, UR-4 and UR-6. No fabricated quality fault or reassuring summary. Coverage explanation is independent of the deduplicated maximum of two collection prompts. |
| Deployment, rollback, guidance only version change and glossary update | UR-8 and UR-10. Correct invalidation boundary, local inputs retained and no automatic paid screening or translation. |
| Switch language and region, edit photo or answer, export during translation, service failure | UR-8 and UR-10. Evidence preserved or invalidated appropriately, no stale export, existing controls retained. |
| English and draft Tok Pisin PDFs, long content and missing translation | UR-3, UR-8 and UR-9. Render and inspect all pages, verify complete evidence, readable headings and captions, clear language and regional limits. |
| Agricultural release evaluation | UR-5 and UR-11. Specialist defines the candidate, necessary signs, lookalikes, exclusions, geography, acceptable error limits and minimum labelled sample coverage before testing. Hold evaluation cases apart from prompt development. Record false suggestions, missed cases and abstentions, including unsupported and poor quality inputs. Do not substitute schema tests or two demonstration photos for this gate. |

## Build plan

Follow the existing Tracer Bullet approach, one working journey at a time.

1. Build a version 2 observation result through Gemini schema, server checks, result screen and both PDF languages. Add the visual summary, distinct coverage explanation and complete evidence record. Verify this narrow real journey before adding cause logic. Covers UR-1, UR-2, UR-3, UR-6, UR-8, UR-9 and UR-10.
2. Add bounded case information prompts without another model round. Verify relevance, missing views, unknown answers and absence of invented care advice. Repeat both supplied photo journeys and inspect the PDF pages. Covers UR-4 and UR-11, with regression checks for UR-1 through UR-3 and UR-9.
3. Build the authorised AI cause explanations in the same final request, including bounded evidence references, diagnostic background, language support and complete PDF content. Verify real differing photo journeys before publishing. Covers UR-12 and UR-13, with regression checks for UR-2, UR-6 and UR-10. Ordinary references to pesticide injury or spray history must not trigger the old blanket word filter; actual chemical instructions and dosages remain outside this app's scope.
4. Finish the reviewed bank contract and four status policy using controlled software fixtures. Keep the independently reviewed condition and question bank disabled while reviewer material is unavailable. Covers UR-5, UR-6, UR-7 and UR-10. This later work does not block qualified AI explanations.
5. Once review resources arrive, populate one independently reviewed condition and its approved question bank, run the independent evaluation and regional checks, resolve failures, then enable only the eligible scope. Repeat real farmer and officer journeys and record remaining limitations. Covers UR-5, UR-7, UR-8 and UR-11. Do not claim independent agricultural validation before this step passes.

Run the appropriate lint, type checks, meaningful deterministic tests and production build. Keep mocked policy evidence separate from real Gemini evidence. Use the real browser without a simulator or emulator. Do not run heavy builds in parallel on the user's Mac.

## Migration plan

**Strategy**: Incremental changes in the existing app, with the named condition disabled independently of the report improvement.

Deploy the versioned report improvement first after verification. Version 2 does not accept version 1 envelopes for assessment, guidance, translation or complete report generation. Return `assessment_version_changed`, preserve any photos and answers still in the current tab, offer an incomplete record without the incompatible AI result, and explain that a new check requires explicit submission. Do not support a parallel legacy result conversion path. Already downloaded PDFs remain on the user's device; they are not rewritten. A version 2 client shows the specific restart message. An already loaded older client cannot acquire new wording automatically, so verify its existing generic error fallback preserves inputs and does not automatically retry or reload. Its previous in memory report may remain visible as historical content until the farmer starts a new check; do not claim the server can rewrite an already loaded page. Stage the cause logic separately while keeping the registry disabled. Enabling reviewed content is a later explicit, recorded release gate.

Rollback uses the previous verified Cloud Run revision and unchanged Hosting target. Keep signing secret references, exact public origin and `__session` behaviour. Before rollout, verify that an unsupported schema response from the previous revision is handled by the version 2 client as the same explicit restart path, with local inputs and incomplete export preserved. A report improvement must not require a new domain or data migration. No compatibility failure initiates a paid request automatically. Existing tab memory remains temporary and cannot survive a refresh by promise.

## Consequences

The report can provide useful visual findings and tentative possible causes before a specialist is available. An empty independently reviewed condition registry does not block AI hypotheses under your authorised change. These suggestions still require evaluation before the team can make agricultural accuracy claims.

Visual summaries can also be wrong, so they remain qualified observations and require evaluation. No agricultural accuracy percentage, guarantee, treatment, worldwide validation or completed farmer validation follows from this design. English and Tok Pisin, coffee only, public access, the USD 20 allowance and the prohibition on further purchases remain unchanged.

## Follow-up

1. Implementation was authorised on 15 October 2026, including the subsequent AI led explanation change. Keep the original milestone progress intact.
2. Link the approved enhancement to existing scope features 6 and 8; retain feature 7's review gates.
3. Teammate supplies agricultural review, permitted independently labelled examples and fluent Tok Pisin review. Do not wait for these to begin the useful visual report after design approval.
4. Check farmer comprehension and officer usefulness with actual participants. Ask whether they can identify the finding, the uncertainty and the next action without help. Record their feedback rather than claiming success from an internal browser test.

## Design review

A fresh read using the same model found six substantive decisions: visual evidence derivation, collection prompt selection, summary and conflict evidence, question revision binding, migration and version invalidation, and review geography. On 15 October 2026, you authorised applying the recommended clarifications, then accepted the revised specification for implementation. This is not agricultural validation.
