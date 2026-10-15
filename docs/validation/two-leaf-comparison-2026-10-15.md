# Two leaf comparison, 15 October 2026

The user reported that unhealthy leaf reports did not explain likely causes and requested a comparison using a healthy looking and unhealthy looking photo from the supplied Google Drive folder. The live app was left unchanged during this test. No simulator, emulator, local app build or mocked provider output was used.

## Selected photos

| Visual selection, not a confirmed label | Shared image | Visual inspection |
|---|---|---|
| Mostly green, healthy looking | 671.jpg, https://drive.google.com/file/d/1wz5C-t4LFm6fxPUeFfyHwDPUZ2VMhkzV/view | Green leaf with visible veins and small irregular or missing sections along the edge. No prominent brown patches. |
| Brown spotted, unhealthy looking | 1741.jpg, https://drive.google.com/file/d/1Gll38pljTVoux5YKGBKzMFen-zuoRCca/view | Several brown patches, including a rounded patch with a yellow border and discoloration near the tip. |

Both came from the shared collection identified as BRACOL. The 671.jpg original match was previously verified. The 1741.jpg copy is 147316 bytes with SHA-256 df2cbe2aaa2f911d0b59513fc90c4525506f8e7e9f13602c7038408f621c0d16; exact original archive matching and disease label mapping were not established. Source record: ../data-sources/bracol.md. Do not score agricultural accuracy from these visual selections.

## Method

Two fresh cases were completed sequentially at https://coffee-leaf-check.web.app. Each used one photo, leaf side Not sure, all four starter answers Not sure, no optional detail, country Brazil from the dataset source and English reports. These choices avoid inventing field history or giving the model a desired diagnosis. Four live screening requests completed, preliminary and final for each photo. No translation was requested. Both downloaded PDFs have three pages and retain the observations, country context, answers and limitations.

## Actual observations

Mostly green leaf, reference 67d25d02-1cb1-49b9-ad53-c96ca6488e47:

* The leaf surface is green with visible leaf veins and no distinct spots or powdery patches.
* Small missing sections or slight tears are visible along the leaf edge.

Brown spotted leaf, reference fd154b5e-bb6e-4909-8757-bd7bbbe40f5c:

* Dark brown rounded spots are visible on the leaf surface and near the leaf edge.
* Yellow patches and yellow halos appear around some brown spots near the leaf tip and leaf edge.

Both display Cannot tell the cause, no named condition and the same missing reviewed regional guidance referral. The app distinguishes the visible features in these two samples, but does not provide cause assessment. This reproduces the user's central complaint. It is not evidence that either sample is healthy or that a particular disease has been identified.

## Why the interpretation is missing

src/lib/server/gemini.ts explicitly instructs the model not to name diseases, requires candidateConditionId null and sends enabledConditions as an empty list. src/lib/server/policy.ts checkedResult always sets status unable_to_assess, conditionId null and coverageUnavailable true. This is an unfinished capability behind deliberate review gates. It is not a conclusion that Gemini independently found both photos equally uninformative, and reviewer signoff alone will not implement the missing decision logic.

The next substantive product work is a narrow cause assessment design and implementation with reviewed condition evidence, useful questions, photo specific uncertainty and evaluation. Universal fallback wording should not be presented as completed agricultural screening. Disease or treatment enablement still requires the approved review and evaluation gates. No such enablement was performed here.

## Evidence

PDF copies and extracted text: ignored output/pdf/leaf-comparison/mostly-green-leaf-report.pdf and brown-spotted-leaf-report.pdf, each with a matching text file. ATTRIBUTION.md beside the reports records authors, source, licence and resizing. Keep it with shared reports.

Scratch screenshots: /private/tmp/coffee-comparison-green-result.png and /private/tmp/coffee-comparison-spotted-result.png. Rendered result text was saved beside each screenshot as JSON. The live tab retains the spotted leaf report. No code, cloud configuration, condition registry or guidance entry was changed.
