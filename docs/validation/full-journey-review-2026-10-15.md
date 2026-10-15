# Full farmer journey clarity review, 15 October 2026

## Scope and changes

The user requested a review and simplification of Photos, Questions, Result, Report and downloadable PDFs. This refines the existing Organic design and useful report requirements. It does not change the supported crop, languages, AI evidence, condition review status or regional guidance scope.

Photos keeps the upload and camera choices, file limit, sharing notice, screening uncertainty and consent visible. The separate repeated What to know warning was removed. About leaf checks remains available as supporting detail. Questions keeps the four starter questions and one optional country selector, removes the repeated Questions heading and explicitly says that multiple symptom choices may be selected. Result retains the photo groups, visible cause explanations and uncertainty, highlighted next checks and compact country summary. Step 4 keeps a short result overview, country and regional limitation, one Download PDF action and a Back action. Print is inside the optional full preview. Start over is in a secondary disclosure with a warning to save the report before clearing it. The usage count is displayed when at most one check remains, rather than on every normal screen.

PDFs retain all actual findings, cause explanation fields, farmer answers, photo checks, photos, uncertainty, missing information, region, diagnostic source scope, privacy and review limitations and version metadata. The repeated positive cause status line and separate repeated meaning heading were removed. Per cause citations now refer to numbered entries in the complete source list, so each full source title appears once. Empty boilerplate sections are omitted. Draft Tok Pisin translation or fallback status is stated once at the top, with language annotations preserved for generated sections. Each cause keeps its Not confirmed qualifier.

## Automated verification

Lint, type checks and 89 deterministic tests passed. Existing report tests now also check that a source title is retained once with a matching numbered cause citation, that the unconfirmed label is present, and that the language fallback notice is stated once. These are controlled software checks, not agricultural evidence.

## Deployment and real checks

The remote production build succeeded. Final public browser journeys used the existing permitted BRACOL samples. No local production build, simulator or device emulation was used. Generated observations were checked without treating the photos as verified disease labels.

## Findings from the real review and corrections

The first deployed review, revision coffee-health-demo-00020-znd, passed the live input and flow checks but exposed two PDF layout issues. The longer draft Tok Pisin report could put a cause heading and its qualifier at the bottom of a page without its explanation. The mostly green report could add a nearly empty page containing only technical record details. These were actual rendered report findings, not inferred from passing unit tests.

The PDF renderer now keeps the first two content groups with a section heading, so a short qualifier cannot stand alone without the explanation. It keeps the same complete record details in a small footer on the final page. The body reserves space for those footer lines. Cause source numbers are sorted for easier lookup. A controlled pagination fixture, clearly labelled as software evidence, reproduced the heading issue before the change and verified the heading plus explanation after it. It also checked that the version field remains in the final footer. The fixture lives in ignored tmp/pdfs and is not a leaf or agricultural test.

Lint, type checks and the same 89 deterministic tests passed after both corrections. Final source archive: coffee-farmer-journey-final-20261015.zip, 50 allowlisted files, SHA256 996b63a45b63433e463c2311e0b1f89f0905a22708b833fdd93ebbff9a324fab. Its app files match the checked local files. Initial build 7af33c5f-8cde-40f8-b1c4-8db39415dc0d and intermediate correction build 51fa462f-b1e5-4861-81ad-82a7fe800a9f are superseded by final build cc6a2c96-3c0d-4f32-ab49-40cdb34b4344, revision coffee-health-demo-00022-2hd.

Earlier completed cases: d2c31a1c-cc7e-4b12-a931-5b9ccb97ffe1 used 1741.jpg, explicit PNG, three Not sure answers and Spots plus Yellowing; 277c4acf-c370-4bae-af60-2785b11de970 used 671.jpg, four Not sure answers and skipped country. Their initial report pages were rendered and inspected to find the issues above. A further preliminary request was issued on the intermediate revision, but was not used as completion evidence.

The Photos and Questions live checks covered missing photo, missing consent, missing answers, clearing consent errors, and no incomplete report offer for these local input errors. The symptom hint was visible, multiple choices worked and Not sure cleared other symptom choices. Both real photos produced distinct specific observations and qualified causes. The green sample did not receive a forced fungal disease list. These photos have no verified diagnostic labels for this comparison.

Native Chrome zoom, not a simulator or device emulation, gave width equal to scrollWidth at CSS widths 735 and 367 on Report. Photos, Questions and Result also reflowed at width 367. Zoom was restored to 100 percent. Print was hidden initially and available inside the full preview. Start over returned the sample journey to Photos and cleared its temporary check. A dialog automation timing mismatch prevented a reliable new observation of the Cancel branch, so that branch is not newly claimed as runtime proof here; the confirmation guard code is unchanged.

## Final public verification

Revision coffee-health-demo-00022-2hd serves 100 percent of traffic through https://coffee-leaf-check.web.app. Runtime settings retain screening enabled, paid mode, maximum one instance, the exact Hosting public origin and TRUST_PROXY false. No purchases, new roles or public access changes were made.

Final cases: 4ed2cbca-9a83-44c3-8ac3-87da96812bed used 671.jpg, four Not sure answers and skipped country. ec87529c-790c-4bb7-9aea-9c35f91ec40d used 1741.jpg, explicit PNG, three Not sure answers and Spots plus Yellowing. Each completed real preliminary and final Gemini requests. The spotted case also completed a real draft Tok Pisin translation. The final green report has three pages; spotted English and draft Tok Pisin each have five. Every page of these three downloaded PDFs was rendered and visually inspected. Text stays inside page margins, causes keep their heading with the first explanation, metadata remains in the final footer, photos keep their captions and there are no metadata only pages. The automatic translation notice appears once.

The complete task issued nine real screening requests, including the intermediate preliminary request that is not completion evidence, and two translations. Controlled pagination and deterministic tests are separate software evidence. Generated disease hypotheses remain unconfirmed; agricultural accuracy, fluent Tok Pisin review and physical phone validation are not claimed.

Final samples and photo attribution are in ignored output/pdf/full-journey. Rendered pages and the controlled pagination fixture are in ignored tmp/pdfs. A screenshot of the final English Step 4 is saved as /private/tmp/coffee-final-report-screen.png. No code was committed or pushed.
