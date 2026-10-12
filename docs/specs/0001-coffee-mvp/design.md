# Frontend direction and layouts

## Summary

Use the Organic visual direction as a practical field guide. Sand surfaces, moss accents and rounded photo panels make the photos feel central. Every observation links to its source photo, so a farmer can see what the app is describing without reading a dense report first.

## Context

Audience: coffee farmers worldwide using phones, with PNG users as the first validation group and local officers reading reports later. Purpose: collect useful photos and answers, explain a bounded screening and regional guidance limitations, and prepare a portable record. Connectivity may be limited; successful analysis needs internet. Content density is low during collection and moderate at Result. Each surface has one clear primary task.

This follows the installed frontend-design process: context, one anchor, one differentiator, a token system and layout planning. The visual direction is approved. M0 implements the welcome shell and CSS tokens; the actual photo, questions, result and report surfaces below remain later milestone work. No photo or font assets are bundled.

## Decision and memorable feature

**Anchor:** Organic. Its earthy palette and gentle shapes suit a field guide viewed beside plant photos. Keep the interface deliberate and quiet rather than adding decorative farming imagery.

**Differentiator:** each photo has a simple number, and each visible observation carries the matching photo number. Selecting an observation focuses its photo. This relationship appears in the result and report. Do not draw invented symptom boxes or claim a precise lesion location that has not been evaluated.

**Implementation skill:** frontend-design, installed outside the project. Do not copy the skill into the repository.

## Design tokens

| Element | Proposed value |
|---|---|
| Main background | Sand `#E8DCC7` |
| Secondary surface | Oat `#D4B895`, use sparingly |
| Main text and focus | Deep earth `#283322` |
| Primary action and rules | Moss `#606C38`, dark text on sand for small links |
| Secondary accents | Sage `#8B9D83` and clay `#B08B6E` |
| Needs more information | Ochre `#C08E3A` as a border or marker, deep earth text |
| Unable or request error | Terracotta `#C66B3D` as a border or marker, deep earth text |
| Possible supported issue | Moss marker with the complete status label |
| No clear supported signs | Clay marker and the plant health caveat; no healthy green success badge |
| Typography | Locally bundled Epilogue for headings and body if licence verified; Arial and sans-serif fallback |
| Type sizes | 28 to 32 px surface heading, 20 to 24 px section heading, 18 px body, 16 px minimum secondary text |
| Line height | 1.5 body, 1.2 headings |
| Spacing | 4, 8, 12, 16, 24, 32 and 48 px |
| Corners | 16 px controls, 24 px photo panels and major sections |
| Borders | 1 px earth rule, 2 px selected and error states; no heavy shadows |
| Texture | Optional procedural grain at 1% on outer background only, never over photos or text; omit if it affects speed or contrast |
| Motion | At most 300 ms ease for panel changes; no breathing animation, parallax or heavy effects |

Maintain the Organic token family. Do not introduce pure white, pure black, cold grey, cream surfaces or hard rectangular cards. User photos naturally retain their real colours.

Small status text uses deep earth, not ochre or terracotta, on sand. Calculated text contrast is about 9.8:1 for deep earth on sand and about 4.2:1 for moss on sand, so moss is reserved for large text or nontext accents. Deep earth text on oat primary buttons is about 7.0:1. Verify rendered WCAG AA contrast before delivery. Status always has words and a visible icon from a real icon set only if needed, never a Unicode glyph pretending to be an icon.

## Wireframe descriptions

### Photos, main task: provide useful images

Phone order:

1. Crop Health Assistant title and an English / Tok Pisin two button toggle.
2. Welcoming worldwide introduction, short initial screening explanation and Coffee leaves only label. Explain PNG is the first validation group, with no claim of completed or worldwide validation.
3. Compact progress text, Photos, step 1 of 4.
4. Photo instructions: one affected whole leaf, natural light, close enough to see detail. Offer underside photo when useful.
5. Add photo button with native file picker; camera option where the browser supports it, gallery still available.
6. One or two preview panels with Photo 1 or Photo 2, side selector, Replace and Remove.
7. Format and size limits, temporary session and Google processing explanation.
8. Check photos primary action. Try a coffee sample appears only when an image has confirmed reuse permission, labelled Demonstration sample.

Empty state uses instructions and a real upload control, not a stock leaf or fictitious farmer. Invalid file feedback sits beside the affected file. Local previews appear without uploading anything until Check photos.

### Questions, main task: give context

Show the preliminary photo quality message and observations as visible information, explicitly not a diagnosis. Keep compact photo thumbnails above four short questions, arranged vertically. Each uses large answer buttons or native checkbox controls. Not sure is always visible. Optional follow up appears once with Why this helps. Show a count such as Question 3 of 4, or up to 6 if the optional bank questions apply. Count is actual, not fake activity.

When guidance depends on geography, place a compact Country or region section after the symptom questions. Explain Advice can differ by location. Use a searchable country selector and, only if needed, an optional broad region choice, with Not sure or skip. Do not default to PNG or ask for an exact address or GPS. This is separate guidance context, not another diagnostic question round or access gate. Include the location labels and regional fallback notices in the central English and Tok Pisin collection.

Primary action: Get screening result. Back to photos and Edit remain available. Avoid a chat bubble interface that implies unlimited interaction. Input panels grow with Tok Pisin text and long optional answers.

### Result, main task: understand the checked screening

1. Complete status label and first uncertainty sentence above the fold.
2. What is visible, with observation cards linked to photo numbers.
3. What this may mean, tentative enabled condition only when eligible.
4. What remains uncertain and missing evidence.
5. Reviewed guidance, exact source and section, actual review geography and any narrower regional limits. Use Reviewed specifically for PNG only when true. Missing suitable regional content has a visible limitation and local agricultural officer recommendation, while observations stay visible.
6. Edit answers, Replace photo and Prepare report.

On desktop, photo column at left and observations at right. On phone, photo panels sit above their observation list; selecting Photo 1 scrolls and focuses that panel. Do not use confidence gauges, diagnosis trophies or a green healthy plant graphic.

### Report, main task: check and download

Show a compact summary first, then expandable preview of all report sections. Keep Download report primary, Print as fallback, and Back to result. Show selected report language, a note about processed photo copies and You choose who to share this with. Offer bilingual report only when the relevant text exists and the selected language export is already reliable.

The preview and file use the same revision. During an export failure retain the result and show Try download again. Do not say Saved until the file creation and download action completes.

Include the farmer's stated country or region and guidance limitations in the preview. Region changes display Updating guidance, preserve photos and observations, then refresh the guidance and report snapshot without rerunning image screening. Unknown region and no matching reviewed guidance are normal supported states, not errors that block screening or download.

## Components and states

| Component | Required states |
|---|---|
| Language toggle | Current selection, keyboard focus, storage unavailable, translation loading or fallback |
| Photo panel | Empty, decoding, ready, invalid, replacing, removed |
| Answer group | Unanswered, selected, Not sure, optional detail, invalid |
| Country or region context | Not sure, skipped, country selected, optional broad region, changed context, no applicable reviewed guidance |
| Progress | Current step, completed previous step, return after edit |
| Analysis action | Ready, busy, slow connection, failed, rate limited, disabled screening |
| Result panel | All four statuses, missing guidance, contradictory evidence, observations only demo |
| Guidance panel | Approved selected language, English available by choice, no approved content |
| Export panel | Ready, generating, downloaded action complete, generation failed |

Loading uses clear wording such as Checking the photos and keeps previews visible. Do not invent a percentage or elapsed work phases. Use a polite live region for completion and errors. At 15 seconds, a fixed message can say This is taking longer than usual. At the request deadline, show retry or unavailable state. Input collection and local previews remain usable when disconnected; screening does not claim offline operation.

## Phone, desktop and accessibility

Phone content width is the viewport minus 16 px padding on each side, no horizontal scrolling at 320 px. Desktop maximum width 1040 px with a 2 column result and otherwise a focused form no wider than 640 px. Controls wrap text and have no fixed heights that clip translations. Minimum target 48 by 48 px and 8 px separation for adjacent actions.

Use semantic headings, labels, fieldsets and error descriptions. All steps work with keyboard alone. Visible 3 px deep earth focus outline and sufficient offset; never remove focus. Keep focus on the relevant question or first error after submission. Language toggle uses pressed state and retains focus after switching. Locale codes are `en` and `tpi`; annotate explicit English fallback regions with the correct language.

Text size can reach 200% without lost actions. Use words with status colours. Photos have descriptive accessible labels and processed image previews use contain fit without hiding leaf edges. Respect reduced motion, which removes transition animation and animated loading decoration. No automatic scroll jump on language change. A bottom action area may remain visible but must not cover focused inputs or conflict with the phone safe area.

Before delivery check 360 by 800, 390 by 844 and 1280 by 800, plus 320 px reflow and keyboard zoom. Test both languages with long answers, long translated country names, missing regional guidance, unknown region, retry, quota and report failure. A draft translation length stress test is useful but not fluent language review.

## Build plan and consequences

M1 uses this direction for the whole narrow journey and optional region context, AC-1, AC-2, AC-10, AC-13, AC-14 and AC-19. M4 verifies all states and sizes, AC-14, AC-15 and AC-19. A locally bundled font improves consistency but needs licence attribution and adds bytes; omit it if the font cannot be obtained legitimately within the build time. Decorative grain is optional and not a delivery dependency.

## Rationale

The Organic direction offers one coherent palette and large tactile controls without heavy effects. A plain unstyled form would be quicker but would make the photo and observation relationship less clear. Extra decorative photography would increase transfer and permission work without helping the task.
