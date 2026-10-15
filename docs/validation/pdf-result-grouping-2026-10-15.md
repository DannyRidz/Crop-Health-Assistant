# PDF result grouping correction, 15 October 2026

The user reported that the visual result and uncertainty appeared to belong to the Country or region field. The report summary placed those unlabelled lines immediately after the country value, so the PDF renderer and full preview gave them no distinct heading.

The shared report structure now ends the summary after the country value. A separate Result section contains the visual finding, uncertainty or incomplete result message and any draft translation notices. It reuses the existing English and draft Tok Pisin Result labels. No AI evidence, country rules, report content or screening policy changed.

A regression test checks the boundary for completed and incomplete reports in both languages. Existing finding checks locate their section by title rather than its old array index. Lint, type checks and all 90 deterministic tests passed. An old ignored pagination source copy was moved outside the project after it caused unrelated type errors during the first check. No simulator or local production build was used.

Only src/lib/report.ts was uploaded to the existing verified cloud source folder. Its local and uploaded SHA256 is 5491a13100fa1788c22707c42234c3525c5eb068d51fa3cb1f6871a13cd33d66. Cloud build f775b009-e189-4189-ae8b-f1483cca29da succeeded. Revision coffee-health-demo-00023-6vp serves 100 percent of traffic through the existing public address. Credentials, permissions and public access were not changed.


## Real public verification

Assessment b4d57abf-af26-473d-bd0c-6e9a9de7df6f used the permitted BRACOL 1741.jpg, explicit Brunei context, three Not sure answers and Spots plus Yellowing. Real preliminary and final requests completed, followed by one real draft Tok Pisin translation. Generated causes remain unconfirmed and this is software verification, not agricultural validation.

Both language PDFs were downloaded from the public app. Each has five A4 pages. All ten pages were rendered and visually inspected, including headings, spacing, bullets, wrapping, photos and captions, cause explanations, source lists, page numbers and the final metadata footer. The country ends with Brunei (BN), followed by its own Result or Risalt heading and the screening statements. No clipped text, overlapping text or cause heading stranded without its explanation was observed. Extracted text bounds stay inside the margins, and every page contains body content. The full English preview was also checked for the separate country and Result sections.

Samples and attribution are in ignored output/pdf/result-grouping; rendered pages are in ignored tmp/pdfs/result-grouping. The browser proof screenshot is /private/tmp/coffee-result-grouping-preview.png. Tok Pisin remains a draft requiring fluent review. No code was committed or pushed. Existing downloaded files are unchanged by this deployment.
