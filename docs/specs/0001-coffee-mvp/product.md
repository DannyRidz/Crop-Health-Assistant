# Product and farmer journey

## Summary

Crop Health Assistant is a globally accessible coffee screening assistant, with initial validation planned with PNG users. Help coffee farmers worldwide make sense of visible leaf changes and collect useful information for local expert help. The app offers initial screening and a portable record. It does not confirm disease, certify health, prescribe generated treatments or claim worldwide agricultural validation.

## Context and intended value

The primary user is a coffee farmer anywhere in the world using a phone browser, possibly with limited connectivity and limited familiarity with technical disease names. PNG coffee farmers are our first validation group. The supporting user is a local agricultural officer receiving a report from the farmer. There is no assumed officer service, reviewer partnership or messaging channel.

The problem to validate is the gap between noticing symptoms and obtaining understandable next steps. Ask farmers how they currently seek advice, which photos officers need, whether Tok Pisin wording helps and whether the report is useful. Do not infer demand, disease prevention or yield improvement from a functioning demo.

Sustainability & Social Impact is the proposed event theme. The intended contribution is access to understandable information and better evidence for advice, which could support informed crop care. These are hypotheses to test, not measured impact claims. The official theme includes community support and informed decisions. See [event themes](https://aibuildercup.com/themes.html).

## Requirements

Coffee leaves only. One reviewed and evaluated condition first. Coffee leaf rust is a candidate, not yet supported. Sweet potato, taro, aibika and cassava are future candidates, with no screening routes in this MVP. Other coffee parts remain unsupported.

English and Tok Pisin are required. Do not remove Tok Pisin if the schedule tightens. Reduce condition breadth, optional bilingual report layout and cosmetic refinements first. If essential translation review cannot happen, describe an internal bilingual demonstration accurately and do not call it ready for farmers.

Deploy a public app without a country restriction, account requirement or PNG only invitation. Welcoming introduction: Coffee farmers everywhere are welcome. Check visible changes in coffee leaves and prepare a report for a local agricultural officer. We are starting validation with PNG users. Guidance is shown only where its reviewed regional scope applies. This describes intended release behaviour, not completed deployment or validation. Future crops, languages and additional region specific guidance remain on the expansion roadmap.

## Decision and complete flow

Use four main surfaces, with progress shown as Photos, Questions, Result and Report. The start explanation sits above Photos instead of becoming an extra screen.

| Step | Farmer action | App behaviour |
|---|---|---|
| 1 | Open the app | Explain initial screening, internet need, temporary session and coffee leaf scope |
| 2 | Choose English or Tok Pisin | Keep the visible toggle throughout; remember preference on this device |
| 3 | Confirm coffee | A fixed Coffee, leaves supported label avoids implying broad crop coverage |
| 4 | Upload one or two photos | Show accepted formats, limits and privacy explanation before submission |
| 5 | Preview and improve | Remove or replace photos; suggest natural light, whole affected leaf and underside when useful |
| 6 | Select Check photos | Real Gemini request returns preliminary observations and quality limitations, no disease result yet |
| 7 | Answer starter questions and guidance context | Four short symptom questions with Not sure; optional one round of at most two follow ups; ask country or broad region if guidance depends on it, with Not sure or skip |
| 8 | Select Get screening result | Real Gemini request, then application checks, return one of four statuses |
| 9 | Read guidance | Approved content matching condition and stated region only; show review geography, including Reviewed specifically for PNG where true, or explain the regional gap and recommend a local officer |
| 10 | Preview and download | Selected language PDF includes photos, answers, farmer's country or region, evidence, uncertainty, guidance applicability and limitations |

Provide Back, Replace photo, Edit answers and Start new check. A destructive Start new check action confirms clearing the active assessment. Navigating back preserves the inputs. Changing the language never clears anything. Photo or answer changes require a new checked result.

If the farmer skips a requested follow up, keep the answer as Not sure and finish with an appropriate limitation. At the question limit, return a bounded result or referral, never another conversational round. Replacing a blurry photo within the active check is allowed; request caps still apply.

## Starter questions

| Identifier | English wording | Answers |
|---|---|---|
| onset | When did you first notice the symptoms? | Today; 2 to 7 days ago; More than a week ago; Not sure |
| spread | Is this affecting one plant or several plants? | One; Several; Not sure |
| symptoms | What changes have you noticed? | Spots; Yellowing; Leaves falling; Other; Not sure, multiple choices except Not sure |
| care_change | Have watering, shade or plant care practices changed? | Yes; No; Not sure; optional detail, 300 characters |

Follow ups come from a reviewed question bank. Examples include Can you provide a clearer photo of the underside of the leaf? and Are the marks also visible underneath? These are hypothetical examples for review. Gemini selects identifiers and explains why more information matters, it cannot create an endless chat. The approved bank determines wording and answer options in both languages.

### Country or region context

When a guidance entry depends on geography, ask Which country or region is your coffee grown in? Explain that advice can differ by location. Offer a searchable country selector, optional broad region only where an entry needs it, and Not sure or skip. This field sits outside the four symptom questions and two follow ups, with no additional question round. Never require GPS, farm address or precise coordinates, infer location from language or IP, or preselect PNG. Unknown location does not prevent photo screening or report download.

If reviewed guidance needs a narrower region than the farmer supplies, explain that applicability cannot be confirmed. Do not keep asking for a precise location. Region edits preserve photos, answers and checked observations; application code rechecks guidance before displaying or exporting it, without rerunning image interpretation. The report is regenerated from that updated guidance selection.

## Result states

| Identifier | Visible label | Meaning |
|---|---|---|
| possible_supported_issue | Possible supported issue | Visible reasons may match an enabled condition, with remaining uncertainty |
| more_information_needed | More information needed | Useful evidence is missing or contradictory, possibly even after the last question |
| unable_to_assess | Unable to assess | Unsupported input or insufficient usable evidence prevents a useful screening |
| no_clear_supported_signs | No clear signs of a supported condition | No clear matching signs in usable photos, this does not mean the plant is healthy |

Request errors are transport states, not agricultural conclusions. Say No screening result was produced and retain inputs for retry. A report may document an incomplete attempt, clearly showing no AI result, but cannot show old or sample results as current.

Keep three distinct sections: What is visible, What this may mean, and What remains uncertain. Hypothetical wording: Yellow patches and small spots are visible. These signs may be consistent with coffee leaf rust, only if enabled. The photo alone does not confirm the cause. No confidence percentages.

## Hypothetical cases, not actual tests

| Case | Intended response and next action |
|---|---|
| Clear supported signs | Tentative enabled condition with linked photo observations; approved guidance if available; report |
| Blurry or dark photos | Preliminary quality explanation; ask once for a replacement; no forced condition |
| Yellowing with several causes | Describe yellowing; explain uncertain cause; select a relevant follow up or referral |
| Unsupported crop or coffee flower | Explain coffee leaf boundary; no coffee condition or guidance; request a supported photo |
| No clear supported signs | Narrow status and explicit statement that the plant is not confirmed healthy |
| Gemini fails | Retry state, no fabricated result; photos and answers remain in the tab |
| Guidance missing or unapproved | Condition result can remain tentative if enabled; say reviewed guidance is unavailable; offer report |
| Farmer outside PNG, only PNG guidance available | Keep supported observations and uncertainty; do not apply PNG recommendations; explain no suitable reviewed regional guidance is available and recommend a local agricultural officer |
| Country or region unknown | Screening and report remain available; withhold geographically restricted guidance and explain why |
| Farmer supplies PNG | Show matching PNG guidance only if review, language, permission and regional checks pass; label its PNG review scope |
| Region changes after screening | Keep the same observation evidence; reselect guidance and refresh report eligibility so old regional advice cannot remain |
| Language switch at Questions | Keep photos, choices and progress; show the same approved question in the other language |
| Language switch at Result | Same condition, status, evidence and source eligibility; reuse translation of this revision |
| Tok Pisin text missing | Clearly label unavailable translation and offer English; no silent mixed language content |
| Contradictory answers | Show what conflicts; more information or referral, no forced disease label |
| No enabled conditions | Observations only; explain screening coverage is not available, never claim a healthy plant |

## Build plan

M1 implements the public narrow journey, region context and report, AC-1 through AC-7, AC-10 through AC-14, AC-17 and AC-19. M2 adds the bounded follow up and complete failure states, AC-3 through AC-8 and AC-19. M3 enables content only after its evidence and geography gates, AC-9 through AC-12 and AC-19. See [delivery milestones](verification-delivery.md#build-plan).

## Consequences

The farmer collects more evidence instead of being promised a diagnosis. This can feel less decisive, so uncertainty must explain a useful next action. The narrow crop and plant part reduce breadth but keep the demo reviewable.

## Rationale

Four starter questions are easier to translate and evaluate than open chat. A reviewed follow up bank is less flexible than free generation but constrains wording, meaning and question count. The initial photo pass fulfils the visible information step without prematurely naming a disease.
