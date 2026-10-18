# Final submission record, 18 October 2026

## Status

Submitted for team J2D through the signed in Hack2skill prototype form. The user authorised completing the listed preparation, checking, export and submission steps. The confirmation described attempt 1. After the final confirmation, the saved form retained all values and the uploaded PDF after reload. The dashboard then explicitly showed **Prototype Submission, Submitted**. This establishes portal submission, not eligibility approval or a judging result.

Dashboard: https://hack2skill.com/event/aibuildercup2026/dashboard/submissions

Local confirmation screenshot: `output/pdf/pitch-deck/J2D-submission-confirmation-2026-10-18.png`. No receipt email was found in the targeted check immediately after submission. A separate receipt ID was not shown.

## Submitted package

- Challenge: Sustainability & Social Impact.
- Prototype: https://coffee-leaf-check.web.app
- Repository: https://github.com/DannyRidz/Crop-Health-Assistant
- Video: https://www.youtube.com/watch?v=ayTe-1-lcMc
- Uploaded deck: `J2D-Crop-Health-Assistant-Pitch-Final.pdf`, 321,777 bytes, below the portal 5 MB limit.
- PDF SHA256: `07b324514453fb248dec8edb9044dcaa121654829c9f3a68d5f29f082d68e091`.
- Editable native deck: https://docs.google.com/presentation/d/1yDtFQGKbZr5J8b2HUHDgrX1xq2nOT-mc6lEZvD7TdB0/edit
- PowerPoint kept locally: `output/presentations/J2D-Crop-Health-Assistant-Pitch-Final.pptx`, 987,159 bytes. It was not required as a separate portal upload.

## Description submitted, 912 of 1024 characters

Crop Health Assistant by J2D is a globally accessible coffee leaf screening assistant in English and Tok Pisin, initially tested with a PNG coffee farmer. Farmers add up to two leaf photos, answer four short questions, read visible findings and possible causes, and download a PDF with evidence, care sources and limitations. Published-source care covers PNG, Indonesia, Kenya and Brazil. Gemini through the official Google Gen AI SDK analyses photos and translates findings; Cloud Run runs the server, Firebase Hosting provides the public website, and Secret Manager protects server credentials. Firestore is not used because cases are temporary and PDFs are saved on the device. ADK and a separate Agent Platform service are not used. The demo includes genuine farmer feedback and an opened PDF. Agricultural accuracy has not been independently measured; chemical products and spray doses are outside this MVP.

## Checks completed in order

1. Updated the existing native prescribed template deck, retaining 13 slides. Added the genuine farmer video, Richard’s feedback and next validation steps. The structural checker reported zero issues. No agricultural accuracy or specialist approval was invented.
2. Exported the native deck as PDF and rendered all 13 pages with native PDFKit, because the connector file reference did not materialise locally and the previous Python rendering dependency was unavailable. Inspected all 13 rendered slides. No clipped text or overlapping content was found. The PowerPoint ZIP passed integrity checks, contained 13 slides and included Richard and the video ID. Both final exports retain the prescribed template.
3. Anonymous HTTP requests returned 200 for the app and its health route, with ready true. This is service readiness, not another paid Gemini inference. Earlier real Gemini journeys remain separate evidence.
4. Anonymous repository metadata returned private false, archived false, default branch main. Its public README was readable. Source was already published. The newest local README edits describing the received video and farmer feedback have not been committed or pushed by this work.
5. Anonymous YouTube watch returned HTTP 200, playability OK and isPrivate false. Metadata duration is 177 seconds, while the player displayed 2:56. Both are under three minutes. This does not imply a complete audio quality review or a private window viewing. Transcript and sampled visual review are described in the farmer feedback record.
6. Populated the portal with the checked app, repository, video, 912 character description and verified PDF. Confirmed the uploaded file and fields, then submitted attempt 1. Reloaded the form to verify saved values and read the dashboard Submitted status.

## Video duration conflict resolved for this action

The portal still displays 3 to 4 minutes. An initial automatic approval review rejected submission on that basis. Before retrying, the current official FAQ was opened both through web lookup and the connected browser. Its submission format answer explicitly requires a video under three minutes, matching the organiser email previously supplied by the user. The retry used the same standard portal controls after establishing this evidence and was allowed. No control was bypassed and no new video was invented or padded.

Official FAQ checked 18 October 2026: https://aibuildercup.com/Faqs.html

## Evidence and remaining limits

Richard’s genuine farmer walkthrough is one qualitative usability example. Broader farmer testing, independent agricultural review, labelled accuracy evaluation and measured yield or income outcomes remain uncompleted. Current Tok Pisin wording and sample reports have completed language review in the recorded scope. Chemical products and spray doses remain outside this submission MVP.

The current stack uses Gemini through the official SDK, Cloud Run, Firebase Hosting and Secret Manager. It does not use Firestore, ADK or a separate Agent Platform service. The organiser permits explaining why Firestore is not applicable. The ambiguity about a separate Agent Platform requirement remains recorded, not resolved by the submission acknowledgement.

No app feature, cloud configuration, spending control, purchase, Git commit or push was changed by this submission work. Keep the app and its dependencies available during evaluation. The native deck remains private; the portal received the exported PDF.
