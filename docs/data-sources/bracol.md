# BRACOL sample source record

Checked on 14 October 2026. The teammate supplied a shared collection identified as BRACOL. This is a candidate source for the M1 coffee image journey and later evaluation. The selected image provenance was subsequently verified and used for a completed public M1 journey, assessment 78ca06f5-1a5f-432b-af01-d044cea864c3. No image is bundled in the public app.

## Original source and attribution

BRACOL: A Brazilian Arabica Coffee Leaf images dataset to identification and quantification of coffee diseases and pests.

Creators: Renato A. Krohling, Guilherme J. M. Esgario, José A. Ventura.

Version 1, published 6 November 2019. DOI: 10.17632/yy2k5y8mxg.1.

Original dataset: https://data.mendeley.com/datasets/yy2k5y8mxg/1

Licence: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/

The original dataset page identifies this licence. Retain appropriate creator credit, source and licence links, supplied notices and an indication of changes. Do not imply creator endorsement. State resizing and reencoding when used through the app. If displayed in a report, app sample, deck or demo, keep attribution with that use in a reasonable accessible location. This record does not grant a licence to unrelated files added to the shared folder.

## Shared collection and candidate

Supplied folder: https://drive.google.com/drive/folders/1Ci1blXqH6Wo4u2ljD7gscDGKITE69rlh

Nested collection: https://drive.google.com/drive/folders/1M28k0pfGEFU2ruSJDKIJN9litrh3xZP6

The connector returned a bounded listing of 100 direct JPEG children. This is not a verified total count of the shared collection.

Visually inspected candidate: 671.jpg, 141487 bytes, JPEG, https://drive.google.com/file/d/1wz5C-t4LFm6fxPUeFfyHwDPUZ2VMhkzV/view

The image shows a whole green leaf on a light background, with visible veins and irregular margins. No disease or health conclusion was assigned. Shared copy provenance is supplied by the teammate; exact matching to the original archive and the original label and split have not been verified. Before using it as a scored evaluation case, retain the original label mapping, source filename, split and file hash. Do not infer a diagnosis from the numeric filename.

## Applicability and MVP boundary

The publisher describes 1747 whole leaf images and 2147 symptom crops from Arabica leaves collected in Espirito Santo, Brazil. Whole leaf photos were taken from the lower side under partially controlled conditions on a white background. Labelling was assisted by an expert. These acquisition conditions differ from farmer photos in the field.

For the M1 journey, prefer a whole leaf image and explicitly set the actual source country to Brazil. Farmer history questions must remain Not sure where the dataset does not provide answers. PNG or other region interface checks using this sample are simulated guidance context, not the photo's collection location or evidence of PNG validation.

Use as a permitted demonstration candidate with attribution after source provenance is settled. No custom model training is planned. Dataset labels alone do not approve a condition, treatment, PNG guidance or Tok Pisin wording. The condition registry remains disabled and guidance remains empty until the existing review and evaluation gates pass. M1 remains in progress until a real public Gemini journey and PDF are verified.

## Competition interpretation

Official FAQ checked: https://aibuildercup.com/Faqs.html

The FAQ requires a fresh project built during the hackathon, a working deployed prototype on Google Cloud, a public source repository, a video under three minutes and a deck. The inspected FAQ does not explicitly prohibit external datasets, but it does not explicitly approve BRACOL either. Dataset licensing and organiser acceptance are separate matters. No likelihood of judge acceptance is claimed; any additional dashboard declarations or terms still apply.

## M1 sample provenance verified, 14 October 2026

The original archive download URL was observed on the publisher page: https://data.mendeley.com/public-files/datasets/yy2k5y8mxg/files/c16b08ee-3ca6-4bf0-8f4e-4285a53a4a24/file_downloaded

The downloaded archive was truncated and lacked a readable central directory. No whole archive integrity or full dataset inventory is claimed. Local entries for the leaf CSV and 671.jpg were complete, extracted directly and verified against their stored CRC values.

Original member: coffee-datasets/coffee-datasets/leaf/images/671.jpg. Original and shared file size: 141487 bytes. Both files have SHA-256 e6fcae3942c4e3cef73fa270afb0f9bb77fa217f6c299c7bf2e7a1a308a804f2, confirming an exact match. This settles the selected image provenance and CC BY 4.0 source for the M1 demonstration.

The original leaf CSV records id 671, predominant_stress 5, miner 0, rust 0, phoma 0, cercospora 0 and severity 0. The numeric category mapping and original split were not established, so these are retained as raw source labels, not interpreted as a diagnosis or scored accuracy result.

The app prepares a resized JPEG copy and removes metadata on the server. Attribution: BRACOL, Renato A. Krohling, Guilherme J. M. Esgario and José A. Ventura, version 1, DOI 10.17632/yy2k5y8mxg.1, CC BY 4.0. Image changes: resized and reencoded for screening and report embedding. Source authors do not endorse this app. Retain this attribution with any shared demonstration report.

The completed journey produced English and draft Tok Pisin Brazil reports and an English unknown region report. Three provider requests used 4030 total tokens. Dataset labels were not supplied to Gemini or used to claim accuracy. The ignored output/m1-verification directory retains report copies with ATTRIBUTION.md; retain that notice whenever these sample reports are shared.
