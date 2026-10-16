# Tok Pisin language review completion

The user confirmed on 16 October 2026 that the review covered the app's fixed Tok Pisin instructions and labels and AI generated sample findings and report text. The review is complete for that scope. This is a user supplied completion record, not a newly performed language review by the development assistant.

Reviewer identity, review date, exact sampled case references and written signoff were not supplied. They remain unspecified rather than invented. The confirmation date is not the review date.

## Scope and boundaries

- Fixed interface, care check and report wording are recorded as language reviewed.
- AI generated sample reports were reviewed. Newly generated case text remains automatic translation; it is not individually human reviewed by this record.
- Agricultural accuracy, care suitability, regional treatment approval and farmer usability are separate. They are not approved by the language review.
- No chemical registration or dose eligibility changes are authorised.
- Any future substantive translation changes should receive their own review status rather than silently inherit this record.

The app removes the blanket draft banner and the report draft notice. It keeps an automatic translation notice for generated case text. The stale notices were removed or shortened using existing text; this change does not introduce a new translated agricultural instruction.

Metadata: `src/content/translation-review.json`, per key status in `src/content/translation-keys.json`, and fixed care text status in `src/content/care-actions.ts`.

## Software verification

On 16 October 2026, lint, type checks and all 127 tests passed. A temporary PDF source copy from an earlier layout comparison caused the first type check to fail; that generated copy was removed and the checks rerun successfully. Controlled report exports verified absence of the obsolete draft notice while retaining agricultural limitations. They are software fixtures, not a new language review or real AI case. The live deployment is revision `coffee-health-demo-00031-tqh`, maximum one instance. Public Tok Pisin labels and About text were checked with no browser errors.

## Cause wording update, 16 October 2026

After the completed review, the user requested wording consistent with the positive English cause cards. Three fixed keys changed: `assessment.causeIntro`, `assessment.causeUncertainty` and `assessment.possibleCauseLabel`. Their per key status is `pending_review`, and `translation-review.json` lists the exception under `pendingWordingUpdates`. This does not reopen review of unchanged wording or remove the prior sample report review.

Suggested phrases for the fluent reviewer:

| English meaning | Updated Tok Pisin |
|---|---|
| Possible causes are based on photos and answers; checking the plant can distinguish them | AI i yusim ol poto na bekim bilong yu long soim ol samting i ken kamapim dispela hevi. Sekim diwai inap helpim yu long painim wanem as i stret. |
| What needs checking | Wanem samting i nidim sek |
| Possible cause | Samting i ken kamapim hevi |

Software checks and rendered PDF layout checks pass. These are not a new fluent language review. Agricultural decisions, evidence and treatment eligibility are unchanged.
