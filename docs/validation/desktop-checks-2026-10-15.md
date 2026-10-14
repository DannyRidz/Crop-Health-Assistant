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

## Finding, subsequently resolved

Switching language during PDF preparation cancels the pending download without a cancellation explanation. The language change increments epoch, exportReport deliberately rejects the stale export, and changeLocale skips translation while busy. This protects against exporting stale content but leaves an unclear recovery step. Reproduced during this run: no file appeared after the overlapping actions; a normal English export after preparation completed worked, followed by a normal draft Tok Pisin export.

Recommended correction: prevent language changes only while PDF export is running, retaining the existing epoch guard. Verify that the controls become available after export success or failure and that a subsequent language change still loads its translation. This was recorded, not silently changed or deployed during the checks.

## Evidence

Case reference: 94636866-6318-49b8-93f4-9ce4ffd9fb9c. Permitted photo provenance: ../data-sources/bracol.md. Source country is Brazil, but this interface test intentionally skipped country selection to exercise unknown context. No field history was inferred.

Browser downloads: coffee-screening-94636866-en.pdf and coffee-screening-94636866-tpi.pdf in the local Downloads folder. They are test reports, not agricultural validation.

Scratch screenshots: /private/tmp/coffee-access-en-200.png, coffee-access-tpi-200.png, coffee-access-questions-200.png, coffee-access-service-error-200.png, coffee-access-result-en-200.png, coffee-access-report-en-200.png, coffee-access-report-tpi-200.png, coffee-access-result-tpi-200.png, coffee-access-questions-tpi-200.png and coffee-access-reset-verified.png.

## Acceptance status

AC-7 recovery, AC-13 report consistency and AC-14 actual desktop zoom received additional real browser evidence. AC-15 keyboard, focus, labels, sampled contrast and targets received partial evidence. Do not mark the complete M2 or M4 milestone done: real phone camera, slow connection coverage, complete keyboard and assistive technology coverage, all state contrast checks, independent agricultural and Tok Pisin review and farmer comprehension remain pending. The download and language overlap finding was subsequently resolved as recorded below.

The specialist and farmer guide and blank feedback template are prepared beside this record. No feedback or specialist approval is fabricated.

## PDF language fix verified, 15 October 2026

The user approved fixing this finding. Language buttons are now disabled only while PDF export is running, and changeLocale also refuses changes during export. The existing epoch check still rejects stale exports. Buttons return through the existing finally cleanup after both success and failure.

Local lint, type checks and all 70 tests passed. Tests ran with maximum one worker at a time. The production build ran remotely on Google Cloud. Cloud Run revision coffee-health-demo-00013-j4v serves all traffic, from build 31bda350-616e-4162-af22-334b7f1ca4fa. The patched remote source hash matched the checked local component before deployment. A first remote patch command had a quoting error; its unnecessary build 28ff4bf7-3470-4f9e-a047-04d15220ec55 was cancelled and never deployed.

Live regression case dbc01f35-0724-4e81-996d-44c128362317 used the permitted BRACOL 671 photo and four Not sure answers. An explicit software test detail containing characters unsupported by the report font caused the intended clear PDF error. Both language controls were observed disabled during preparation and enabled after failure. The photo, answers and result remained available.

The test detail was removed, and a fresh final check completed. Normal English and draft Tok Pisin exports each showed both language buttons disabled during preparation and enabled when finished. Switching to Tok Pisin after the English export started and completed translation normally. Both three page PDF downloads contain the matching reference and exclude the removed test detail. No provider responses were mocked for this regression check. These are software checks, not agricultural validation.

Proof screenshots: /private/tmp/coffee-pdf-failure-controls-restored.png, /private/tmp/coffee-pdf-language-fix-en.png and /private/tmp/coffee-pdf-language-fix-tpi.png. English and draft Tok Pisin files are coffee-screening-dbc01f35-en.pdf and coffee-screening-dbc01f35-tpi.pdf in Downloads. The app remains open in English at the report screen. Cloud Shell was closed after verification. No simulator, emulator or local production build was used.

Service inspection confirmed maximum one instance, paid observation screening, the exact public app origin, TRUST_PROXY false and the two existing secret reference names. No new credit purchase, domain, service account or secret permission was introduced. Remaining phone, independent review and full accessibility gates are unchanged.
