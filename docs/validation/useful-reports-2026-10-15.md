# Useful coffee screening reports, 15 October 2026

## Scope and authorisation

You approved specification 0003 and its six review clarifications. During implementation, you explicitly requested AI led cause analysis without waiting for an unavailable agricultural reviewer. The [authorised amendment](../specs/0003-useful-screening-reports.md#authorised-change-ai-led-cause-explanations) records that change. AI hypotheses are distinct from independently evaluated condition screening and regionally approved treatment guidance.

No simulator, emulator, permanent case store, new vendor, credential purchase or IAM role was introduced. An already running local development server was reused. Production builds run in Google Cloud. No commit or push was made.

## Automated software evidence

Node 24.15.0, committed dependency lockfile, lint and type checks passed. The final deterministic suite passed 88 tests across 15 files with `npm test -- --maxWorkers=1`.

New checks cover visual findings from eligible photos, missing and unclear observations, mixed photo support, complete photo coverage before reassurance, collection request priorities, separate photo revisions, compatibility preservation, report evidence, tentative cause references, translation hash invalidation and the distinction between possible pesticide injury and an actual chemical instruction. The route tests mock the Gemini SDK boundary. These tests do not establish agricultural correctness.

## Real local journeys

All cases used the supplied BRACOL collection photos with permission, four Not sure starter answers, no extra detail, Brazil context and unknown leaf side. The [earlier comparison](two-leaf-comparison-2026-10-15.md) records their provenance and limitations. Neither appearance was treated as a verified case label.

| Case | Evidence and observation |
|---|---|
| `560594bd-ca8a-4697-b382-3f117169d372` | First visual report slice, 671.jpg. Real preliminary and final Gemini calls described a green surface and minor edge notches. English PDF exported and all three pages inspected. |
| `c74c761f-adba-4461-bbc0-34cb732a2213` | First visual report slice, 1741.jpg. Real preliminary and final calls described brown spots, yellowing and tip markings. Real translation, English and draft Tok Pisin PDFs, three pages each, inspected. |
| `c1bc1f5a-f478-44e1-9c73-b5e21a788c17` | AI explanation amendment, 1741.jpg. Real preliminary and final calls produced two tentative explanations, Cercospora leaf spot and coffee leaf rust. Each had supporting observations, uncertainty, a concrete next check and fixed diagnostic references. A real translation preserved the cause list. Both five page PDFs were exported and visually inspected. |

These three journeys made six real screening requests and two real translation requests. They were not simulated provider responses. The final pesticide wording correction was subsequently covered by deterministic tests; the local case above used policy version `coffee-analysis-2`.

The PDF inspection covered readable A4 text, page numbering, running headers, grouped photo captions, full farmer answers, cause evidence, uncertainty, diagnostic source geography and regional guidance limitations. The five page case includes complete officer details rather than only the collapsed screen summary. Draft Tok Pisin was checked for rendering and preserved structure, not fluent linguistic accuracy.

## Deployment evidence

The source archives use an explicit allowlist of application code, public fonts, build scripts and required configuration. Local secrets, test fixtures, generated files and repository metadata were excluded.

The initial archive SHA256 was `679fbdc48ab718f18b5199bf0c1956c7fde915e5cf9f8fd6b05b8ca1b43d92e5`. Build `c70ae699-f5ef-47c6-8005-d92904fbe027` passed the production build and deployed intermediate revision `coffee-health-demo-00014-ks5`. A source path using an unexpanded tilde failed before a build was started, then was corrected to its absolute path.

Build `14809101-7f0f-4dc7-914c-0fa111caaab6`, containing the source link correction, was deliberately cancelled before deployment so the final policy correction could be included. The deployment command reported CANCELLED. It was not a failed application test.

Final source archive SHA256: `4a8539a17eb5043df2c65b6803b64abc7005e0e0fac54a8dce04c9163dfde779`, 49 source files. This hash was verified again in Cloud Shell before unpacking. Final build: `4a09e503-f63e-49da-a899-cbe50291489d`.

Automatic approval review initially rejected the Cloud Shell Authorize action because it grants credential access. You then explicitly authorised Cloud Shell and deployment, and the session was authorised. No credentials were printed or new secret access granted.

## Final public verification

The intermediate public green leaf journey completed real preliminary and final Gemini calls. It described a predominantly green leaf and a minor notch. It did not populate a disease hypothesis list. Its explanation distinguished possible handling or chewing damage from insufficient evidence for a particular pest or disease.

Final revision `coffee-health-demo-00015-lfb` serves 100% of traffic at https://coffee-leaf-check.web.app. Final build `4a09e503-f63e-49da-a899-cbe50291489d` completed successfully. All 49 files in the final source archive were compared with the local working source after deployment; none differed.

The final runtime configuration was inspected without retrieving secret values: screening enabled, paid Gemini service, exact public origin, proxy trust false, service level maximum one instance, existing coffee runtime account and two secret references only. No hosting target, IAM role, credential value or payment setting was changed.

| Final public case | Observed result and export |
|---|---|
| `f21425fe-cb1d-4f84-9b93-70c244af1a9e`, 671.jpg | Real preliminary and final requests described the mostly green surface and edge notches. One tentative physical or insect feeding damage explanation was produced, with uncertainty about the cause. No specific disease was forced into the list. English and real translated draft Tok Pisin PDFs exported, four pages each. |
| `dc99fb1d-2f62-4abc-801a-b9ffa7d17e7c`, 1741.jpg | Real preliminary and final requests described brown rounded spots, tip discolouration and an indented edge. Two tentative explanations, Cercospora leaf spot and coffee leaf rust, included evidence, uncertainties, specific checks and diagnostic references. English and real translated draft Tok Pisin PDFs exported, five pages each. |

These final journeys made four actual screening requests and two actual translation requests. Both PDFs identify schema 2, prompt `coffee-analysis-4` and policy `coffee-analysis-3`. Every page of all four final files was rendered and visually inspected. Headers, footers, numbered photos, caption grouping and wrapping were intact. Files are approximately 141 to 144 kB, below the 3 MiB export limit. Samples and attribution are in ignored `output/pdf/useful-reports/`.

The spotted result's complete cause text was compared before and after choosing Not sure for region and remained unchanged. Brazil was restored and confirmed as the selected country. The regional guidance request did not require the farmer to submit another screening. Diagnostic source links have `target="_blank"` so navigating to a source preserves the current check.

An older open result returned the existing expired session message during a guidance update, with photos and answers retained and no automatic retry. Because expiry occurred before the version check, this is session failure evidence, not a live proof of the specific schema migration message. Legacy schema rejection and compatibility data preservation are covered by the deterministic route and reducer tests.

Native Chrome zoom was checked at 200% (735 CSS pixels wide) and 400% (367 CSS pixels wide). Document width equalled viewport width, including Tok Pisin at 367 pixels. This is desktop browser reflow evidence, not a phone or emulator test. Zoom was restored to 100% (1470 CSS pixels wide).

Proof screenshots: `/private/tmp/coffee-ai-public-causes.png` and `/private/tmp/coffee-ai-public-full-result.png`. The final spotted result was left open in English.

## Criteria coverage

UR-1 through UR-4 and UR-9 have real browser and PDF evidence plus deterministic boundary checks. UR-6 and UR-10 have real successful journeys and session failure evidence, with malformed output, unusable evidence and compatibility boundaries tested using controlled software fixtures. UR-8 has preserved language and region evidence; fluent language review and worldwide agricultural validation are not claimed. UR-12 and UR-13 have real AI hypotheses, source presentation, translation, PDF and region preservation evidence.

UR-5, UR-7 and the independently evaluated condition release part of UR-11 remain pending in the later reviewed screening and question bank work. They do not block the separately authorised AI hypotheses. No milestone covering all agricultural screening, farmer validation or physical phone behaviour is marked complete from this slice.

The cloud dependency install also reported five high severity audit warnings on the existing lockfile. Dependency versions were unchanged by this feature. A separate local runtime audit could not reach the registry because DNS resolution failed, so no clean dependency audit or security certification is claimed here. Dependency maintenance remains open.

## Limits

The example leaves have not been independently diagnosed for this comparison. Neither two pictures nor software tests measure agricultural accuracy. Independent agricultural evaluation, fluent Tok Pisin review and farmer comprehension testing remain pending. Published reference material is diagnostic background and has not reviewed these cases. No worldwide agricultural validation or local treatment approval is claimed.
