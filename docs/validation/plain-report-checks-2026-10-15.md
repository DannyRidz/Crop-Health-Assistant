# Clear results and report layout, 15 October 2026

## Requested refinement

Simplify English on Step 3 and Step 4 and make the exported PDF easy to scan. This refines the approved useful report design, especially UR-3, UR-8, UR-9 and UR-12. It does not change the agricultural interpretation rules or enable reviewed regional treatment guidance.

Step 3 separates what the photos show, what might be causing it, why each suggestion may fit, what remains unknown and what to check next. Each cause card says it is possible and unconfirmed. Step 4 shows the visual finding and AI summary before download instructions. The complete record remains available through a disclosure and in every PDF export.

Prompt `coffee-analysis-5` asks for short explanations in familiar words and gives plain alternatives to specialist terminology. This is a wording instruction, not a guarantee that every generated sentence is simple or agriculturally correct. Existing signed content version checks remain enforced.

## Report format

The PDF embeds Noto Sans Regular and Bold. Findings, missing information, limits and collection notes use hanging bullet points. Labels for cause explanations and farmer questions use bold text. Section headings use larger bold type and a short sage rule. Metadata is compact. A continuing section repeats its title after a page break. All photos, answers, cause evidence, limitations, source scopes and regional context remain included.

The additional bold font is from the official Noto font repository, `hinted/ttf/NotoSans/NotoSans-Bold.ttf`, under the existing SIL Open Font License. Both font files retain their embedded Google copyright notices. No new package dependency is required.

## Local verification

Lint, type checking and 89 deterministic tests across 15 files passed. Tests cover embedded regular and bold fonts, unsupported farmer characters, full evidence and exact farmer answers, structured findings, and keeping both photo references together. These tests use controlled fixtures and are not agricultural evidence.

A real Chrome journey on the existing development server used the permitted BRACOL 1741.jpg sample, four Not sure answers and Not sure region. Case `74d771b7-5340-46b6-8b8e-fa17805f9734` completed two actual Gemini screening requests and one actual translation request. The final result suggested tentative brown eye spot and rust explanations with distinct evidence, uncertainties and next checks. The sample has no independently verified disease label for this check.

English and draft Tok Pisin PDF exports contain five A4 pages each. All pages were rendered and inspected. An initial six page English export had sparse record details on its final page; compact metadata removed that extra page. The longer draft Tok Pisin cause section repeats its heading when it continues onto the following page. Draft translation is still clearly identified and has not received fluent review.

The development server uses the demo service tier, so only the permitted sample was submitted. No simulator, emulator or local production build was used. No new credits were purchased.

## Public verification

The remote production build `fe655716-a916-44f9-b08c-514b5b1fd00b` succeeded. Cloud Run revision `coffee-health-demo-00016-ltz` serves 100 percent of traffic through https://coffee-leaf-check.web.app. The uploaded archive contained 50 explicitly selected source files and no local secrets, test fixtures or generated reports. SHA256: `a4bbb94e494bb69c6b33779206658a454397accc37b014b2b568fe1814edc553`. Every archived app file was compared with the final local source and matched.

A fresh public Chrome journey used 1741.jpg, four Not sure answers and Not sure region. Case `916610f6-eced-44eb-9355-1d97a11185c8` completed actual preliminary, final and translation requests. The result offered tentative Cercospora and rust explanations with specific next checks. Step 3 and Step 4 displayed the new plain English headings and structured cause labels. The full preview opened, both language PDFs downloaded, and the English result remained available after returning from the report step. Language controls were disabled while preparing each PDF and recovered afterwards.

Both public PDFs contain five A4 pages. Every page was rendered and visually inspected. Regular and bold font spans are present, text stays within the horizontal margins, bullet points wrap with a hanging indent, full photo and caption remain together, and all answers, cause explanations, source scopes and regional limits remain included. The draft Tok Pisin cause heading repeats above its continuation. No clipped text, overlapping text or sparse extra metadata page was found in these samples. The English PDF is 152,536 bytes and the draft Tok Pisin PDF is 153,342 bytes.

The runtime settings were read without retrieving secret values. Screening remains enabled in paid mode, service scaling remains maximum one instance, PUBLIC_APP_ORIGIN remains exactly the Hosting address, TRUST_PROXY remains false and only the existing two secret references are configured. No IAM, secret value, Hosting target or payment setting changed.

Across local and public checks for this refinement, there were four real screening requests and two real translation requests. Automated fixtures are recorded separately above. This verifies the requested software and layout refinement, not disease accuracy, fluent Tok Pisin, physical phone usability or worldwide agricultural validation. Those broader milestones remain pending.

## Findings grouped by photo

The user requested one Photo 1 card with bullet points after noticing repeated Photo 1 cards for separate observations. The observation panel now groups displayed findings by the actual input photo ID, preserving the existing selected evidence and generated wording. A finding linked to both photos appears under both. Each photo has one heading and one focusable photo link; its excluded evidence notice appears once. The same panel is used for preliminary notes and supporting result details. Report content and screening decisions are unchanged.

Lint, type checking and all 89 existing tests passed after this presentation change. No additional test suite was added for this small reversible layout adjustment. Build `0abf771f-dfbd-4c95-a106-71c853602f72` succeeded and revision `coffee-health-demo-00017-bws` serves 100 percent of traffic. The source archive had 50 allowlisted files, SHA256 `fc6b0785e6658389ce2def3776c2084dcc6f95e8a4172be6f2bd2a11e8168825`, and matched the checked local app.

A fresh public Chrome journey with permitted BRACOL 1741.jpg, four Not sure answers and Not sure region completed two actual Gemini screening requests. In Step 3, the main findings section had exactly one article, one Photo 1 heading and three list items. Its photo button focused the actual photo element `photo-47095d87-ca07-4436-898e-992d6b8198a4`. The screenshot `/private/tmp/coffee-grouped-findings.png` was visually inspected and shows the photo beside one grouped findings card. This check covers the English desktop presentation; it does not claim new agricultural, fluent language or physical phone validation. No simulator or local production build was used.
