# Desktop accessibility and report checks, 15 October 2026

App: https://coffee-leaf-check.web.app

Method: the existing Chrome tab and native Chrome zoom controls. No simulator, device emulator, local app server, local build or parallel test processes were started. Actual browser zoom changed from 100 percent to 200 percent, confirmed by devicePixelRatio changing from 2 to 4 and CSS viewport width from 1470 to 735. Normal zoom and English were restored afterwards. This is a focused manual check, not a complete accessibility audit or real farmer test.

## Observed checks

| Check | Outcome |
|---|---|
| Fresh load and keyboard entry | Skip to content was the first Tab stop and visibly focused. Initial load did not force focus to the heading. |
| Photo controls and language | Keyboard focus moved between language, photo and disclosure controls. Visible focus ring observed. |
| Privacy disclosure | Enter opened it, with paid processing and temporary data explanations visible. |
| Missing photo | Keyboard submission focused the Add at least one photo alert. |
| Missing consent | Error focused, and pressing Space on consent cleared the error. |
| Real photo preparation | Permitted BRACOL 671.jpg prepared using keyboard file input. No other private files were submitted. |
| Questions | A real preliminary request reached questions and focused the heading. Missing answers focused the alert; all four Not sure answers were accepted using keyboard controls. |
| Long text | 300 characters of explicit layout test text fitted the field. It was removed before final screening and did not enter the report. |
| Actual 200 percent zoom | English and draft Tok Pisin photo, question, result and report screens had no horizontal document overflow. Report preview opened by keyboard. Draft Tok Pisin preliminary text was unavailable when returning to questions and the explicit English fallback was visible. |
| Selected contrast and target sizes | Measured enabled question screen buttons and disclosures were at least 48 CSS px high. Measured text contrast on sampled controls and headings was 6.99:1 or 9.76:1. This does not cover every possible state. |
| Service error | The first final attempt returned the generic service error. Photo and four answers remained. Error focus and incomplete report action worked. Root cause was not established from the browser. |
| Incomplete report | Explicitly stated no result was produced and focused its heading. Returning to questions preserved inputs. |
| Manual retry | One retry completed with observations and the conservative Cannot tell the cause status. No supported disease or treatment was claimed. |
| Region | Skip for now remained Not provided in the report, with a country limitation and local officer referral. No location was inferred. |
| PDF exports | Normal keyboard export completed in English and draft Tok Pisin. Both downloaded files have three pages, the matching full reference, language and embedded photo. English contents also match the four Not sure answers, visible observation, missing country and local officer referral. |
| Reset cancellation | Native confirmation displayed the loss warning. Cancel retained one photo and four checked answers. |
| Reset confirmation | OK cleared the disposable test case, returned to Photos and focused its heading. No photos or checked answers remained. Session allowance was retained. |
| Reduced motion | Source inspection found the existing reduced motion override and no authored animation or transition elsewhere. An operating system reduced motion setting was not toggled. |

## Finding requiring follow up

Switching language during PDF preparation cancels the pending download without a cancellation explanation. The language change increments epoch, exportReport deliberately rejects the stale export, and changeLocale skips translation while busy. This protects against exporting stale content but leaves an unclear recovery step. Reproduced during this run: no file appeared after the overlapping actions; a normal English export after preparation completed worked, followed by a normal draft Tok Pisin export.

Recommended correction: prevent language changes only while PDF export is running, retaining the existing epoch guard. Verify that the controls become available after export success or failure and that a subsequent language change still loads its translation. This was recorded, not silently changed or deployed during the checks.

## Evidence

Case reference: 94636866-6318-49b8-93f4-9ce4ffd9fb9c. Permitted photo provenance: ../data-sources/bracol.md. Source country is Brazil, but this interface test intentionally skipped country selection to exercise unknown context. No field history was inferred.

Browser downloads: coffee-screening-94636866-en.pdf and coffee-screening-94636866-tpi.pdf in the local Downloads folder. They are test reports, not agricultural validation.

Scratch screenshots: /private/tmp/coffee-access-en-200.png, coffee-access-tpi-200.png, coffee-access-questions-200.png, coffee-access-service-error-200.png, coffee-access-result-en-200.png, coffee-access-report-en-200.png, coffee-access-report-tpi-200.png, coffee-access-result-tpi-200.png, coffee-access-questions-tpi-200.png and coffee-access-reset-verified.png.

## Acceptance status

AC-7 recovery, AC-13 report consistency and AC-14 actual desktop zoom received additional real browser evidence. AC-15 keyboard, focus, labels, sampled contrast and targets received partial evidence. Do not mark the complete M2 or M4 milestone done: real phone camera, slow connection coverage, complete keyboard and assistive technology coverage, all state contrast checks, independent agricultural and Tok Pisin review and farmer comprehension remain pending. The download and language overlap finding also remains open.

The specialist and farmer guide and blank feedback template are prepared beside this record. No feedback or specialist approval is fabricated.
