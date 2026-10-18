# Try the app as a judge

[Open Crop Health Assistant](https://coffee-leaf-check.web.app). No account is required. Internet is required. This is a working coffee leaf screening prototype, with agricultural accuracy and farmer validation still pending.

## A complete check

1. Save the [permitted sample leaf photo](671.jpg) to your device. Its source country is Brazil. It is a demonstration input, not an independently verified health or disease label.
2. Open the app in English and add the photo. Read and tick the permission checkbox, then choose **Check photos**.
3. Answer all four history questions with **Not sure**, because this dataset image does not provide growing history. Choose **Brazil** as the country.
4. Choose **See result**. Read the photo findings, any possible causes, next checks and available country matched care. The exact AI prose can vary. No particular disease output is expected or guaranteed.
5. Choose **Prepare report**, then **Download PDF report**. Confirm that the report includes the photo, Brazil, your answers, findings, sources and limitations.
6. Optionally switch to **Tok Pisin** and prepare its PDF. New case text is automatically translated. The completed language review covers fixed wording and sampled reports, including the three later cause wording edits, confirmed by the user on 17 October 2026.

Changing the country updates regional care and the report without rerunning the photo analysis. Not sure or Skip withholds country specific care. If you select PNG, Indonesia or Kenya with this Brazilian sample, that is a simulated country context, not evidence of validation with images from that country.

## What to expect

- Useful visible findings can be returned without a supported possible cause. A mostly green leaf is not proof that the plant is healthy.
- Care suggestions come from published, country scoped sources. They have not received independent agricultural approval of this app. Chemical products and spray doses are outside this submission MVP. The live catalogue is empty; any future release requires verified local registrations, matching labels and testing.
- Keep the tab open. Refreshing or closing clears the temporary case. PDF files remain on your device.
- A normal full check uses two screening requests. The current session allowance is 12 screening requests per ten minute window, subject to shared capacity, service availability and funded quota. Translation has its own allowance. A busy or quota response includes a retry delay and retains inputs.
- Do not submit faces, private personal details or photos you lack permission to share. Content is sent to the app and Google for processing after consent.

For source setup, architecture, controls and verification records, return to the [project README](../../README.md). For feedback, use the [reviewer guide](../validation/reviewer-guide.md). Software test counts are not diagnostic accuracy scores.

## Sample attribution and permissions

**BRACOL:** Renato A. Krohling, Guilherme J. M. Esgario and José A. Ventura, *A Brazilian Arabica Coffee Leaf Images Dataset to Identification and Quantification of Coffee Diseases and Pests*, version 1. [Dataset, DOI 10.17632/yy2k5y8mxg.1](https://data.mendeley.com/datasets/yy2k5y8mxg/1). [CC BY 4.0 licence](https://creativecommons.org/licenses/by/4.0/).

This repository sample is the original, unchanged `coffee-datasets/coffee-datasets/leaf/images/671.jpg`. Its SHA-256 is `e6fcae3942c4e3cef73fa270afb0f9bb77fa217f6c299c7bf2e7a1a308a804f2`; provenance was verified against the publisher archive member. The app resizes and reencodes the image for processing and report embedding. Source authors do not endorse the app. Keep this attribution with shared example reports or reused image material.

The image is included only in repository documentation, not as a bundled public app sample. Its licence is separate from the application source and dependency licences. [Full provenance record](../data-sources/bracol.md).
