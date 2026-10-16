# Ask the expert session notes

Reviewed on 16 October 2026 using the complete exported English auto generated captions for the 53 minute session. This is a transcript based review, not independent listening verification. Names and technical terms may be mistranscribed. Paraphrases below retain timestamps so important requirements can be checked against the recording. No app, deployment or permission changes were made from this review.

[Google Cloud AI Builder Cup 2026 | Ask the expert session](https://www.youtube.com/watch?v=_75UeGNj1GY)

## Requirements relevant to our submission

| Time | Session guidance | Action for this project |
|---|---|---|
| 3:00 to 4:26 | Host says team formation was reopened until 16 October and is necessary to access submission. | Existing registered team should verify the dashboard shows both members. This updates the earlier public FAQ date but is not a new submission cutoff. |
| 4:41 to 5:39 | Host lists deck, a 3 to 4 minute demonstration, functional deployed prototype, accessible repository and a brief technology description naming Firebase, Firestore, Cloud Run and Gemini. | This supports the user supplied screenshot. Video length still conflicts with the template and FAQ; obtain final clarification. Listing Firestore here is not an explicit exemption for apps without a database. |
| 5:57 to 6:31 | Host reiterates professionals only, excluding students. | Registration does not replace individual eligibility checks. |
| 8:09 to 8:21 | Deployment through Cloud Run or Firebase is required. | Our Cloud Run service and Firebase Hosting address match this deployment route. |
| 8:41 to 10:08 | Speaker discusses an existing commercial product and suggests a separate repository with sufficient technical evidence, without exposing proprietary core algorithms. | This conflicts with the public FAQ requiring fresh hackathon work. Our project should document its own actual build history, not use the verbal discussion as a blanket exception. |
| 11:02 to 12:32 | Speaker allows redeployment to the same endpoint and recommends leaving the app available through results announcement. Scaling to zero when idle is discussed. | Keep the submitted address stable and dependencies funded and operational. Scale to zero does not make AI requests, builds or storage free. Existing maximum one instance remains. |
| 13:13 to 14:57 | Direct AI Studio API calls are described as possible, but the speaker also describes using Agent Platform capabilities to meet submission requirements. ADK is recommended rather than a scoring preference. | **New unresolved compliance question:** our app uses the official Gemini SDK directly and does not use ADK or an Agent Platform runtime, memory or session service. Confirm whether direct Gemini plus Cloud Run and Firebase Hosting is sufficient, or whether a separate Agent Platform capability is required. Do not claim we already use it. |
| 15:01 to 17:57 | Existing data and guardrails may be enough without search if outside verification is unnecessary. Documentation should explain data sources, guardrails and sample inputs for judges. | Include BRACOL provenance, published care sources, regional filtering, tentative causes, exclusions and a permitted example image with clear test steps. Sourced care is not proof of agricultural accuracy. |
| 20:09 to 22:04 and 47:13 to 48:59 | Speaker accepts hybrid or direct approaches while emphasising a meaningful Gemini role. Public and synthetic data are discussed as acceptable. | Describe real Gemini photo analysis. Public data remains subject to its actual licence. Label synthetic software fixtures separately from real images and accuracy evidence. |
| 22:47 to 24:39 | Speaker does not expect continuously warm instances; cold starts are discussed as normal prototype constraints. Actual latency improvements may be explained. | Do not add paid minimum instances just for this session. Report only measured timing, with any cold start effects, not invented performance claims. |
| 25:36 to 26:13 | Speaker recommends a Cloud Run or Firebase URL for clear hosting evidence. | Submit https://coffee-leaf-check.web.app, with the Cloud Run backend explained in the architecture. No custom domain purchase is needed. |
| 27:16 to 28:12 | Speaker stresses that credentials must not appear in repository or submission materials. | Check source, deck, screenshots and recording for secret values. Runtime uses scoped Secret Manager references; show service roles without exposing credentials. |
| 28:13 to 29:38 | Quota limitations should be disclosed with practical evaluation instructions. | Document photo limits and session quotas, and verify API availability. Do not promise unlimited checks or guaranteed service availability from the allowance. |
| 29:46 to 34:27 | Camera appearance is optional. The recording must show genuine app behaviour, input, output, use case and impact; clear audio and presentation matter. | Use readable actual app capture and audible English narration. Editing is acceptable only when it does not misrepresent app behaviour. |
| 34:30 to 36:18 | Speaker prefers minimal access barriers; discusses supplied credentials and labelled synthetic examples. | Our public app needs no account. Retain the stricter written public repository and link requirements until clarified. |
| 36:23 to 38:18 | Feasibility, meaningful implementation and clear communication affect evaluation. | Explain the focused coffee use case, limits, costs and next validation steps. Do not inflate maturity to make the prototype sound stronger. |
| 38:26 to 39:22 | Speaker personally suggests opening with the product, then explaining architecture while a request runs. | Optional presentation idea, explicitly not a binding judging rule. |
| 39:27 to 41:35 | Speaker discusses temporary AI failures and judges accessing the deployed app throughout evaluation. | Preserve honest failure handling and a labelled previous result when presenting. The host and screenshot are stricter about unavailable services; do not assume retries will be granted. |
| 41:39 to 42:49 | Speaker permits critical fixes without adding features after submission and warns against breaking access. | Freeze the submission scope and record the submitted commit. No post submission work or git actions are authorised by this note. |
| 44:43 to 45:38 | ADK and several Agent Platform services are discussed again. | Reinforces the need to clarify the technology requirement, not a reason to silently add services. |
| 52:28 to 52:58 | Host reiterates team formation and says 18 October is the submission deadline with no extension. | Exact cutoff time and timezone remain unverified; check the dashboard and aim to finish earlier. |

## Questions for the organiser

1. Does a prototype using direct Gemini API calls through the official SDK, hosted on Cloud Run with Firebase Hosting, satisfy the AI requirement? Is an additional Agent Platform or ADK component mandatory?
2. Is Firestore required even when the application has no permanent database, or should the brief describe only the Google services actually used?
3. Which video limit governs this submission: the dashboard/session's 3 to 4 minutes, the template's 3 minutes, or the FAQ's under 3 minutes?
4. What is the exact 18 October cutoff time and timezone, and through what date should the deployed service remain available?

These questions are prepared for the user. No message has been sent to the organiser.

## Later organiser reply

The user supplied a support email response on 16 October 2026. For current preparation, strictly under three minutes supersedes the session duration advice; the confirmed cutoff is 18 October 2026 at 11:59 PM IST. The reply permits explaining Firestore nonapplicability in the deck and technical documentation, while Agent Platform and ADK remain unresolved. The historical session notes above are retained. See [current instructions](instructions.md).
