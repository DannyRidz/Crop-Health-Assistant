# 0002. Public app address

**Date**: 2026-10-14
**Status**: Accepted

## Summary

You approved serving the app at coffee-leaf-check.web.app so the short address stays in the browser. Replace the redirect with Firebase Hosting requests routed to the existing Cloud Run service.

## Requirements

- **AC-1**: The HTTPS start screen, assets and four step journey stay at coffee-leaf-check.web.app without redirecting to Cloud Run.
- **AC-2**: The signed temporary session works through Hosting; missing or invalid sessions and foreign origins remain rejected.
- **AC-3**: A permitted coffee photo completes real preliminary and final checks, country limitations and English plus draft Tok Pisin report downloads through the short address.
- **AC-4**: Existing crop, language, review gates, secrets, instance limits and spending rules are preserved.

## Decision

Use Firebase Hosting rewrites to coffee-health-demo in asia-southeast1, in gen-lang-client-0276450924. Reuse the existing preview target and site. No new app service, custom domain purchase or database is needed. Do not pin a Cloud Run tag, so the live service revision remains the deployment source.

Firebase passes only the __session cookie. Rename the existing signed cookie to __session, keeping HttpOnly, Secure in production, SameSite strict and the existing expiry and quota logic. Existing checks can require a fresh session after deployment.

Configure PUBLIC_APP_ORIGIN=https://coffee-leaf-check.web.app. The request boundary accepts that exact HTTPS origin as well as the existing incoming host check. Do not trust arbitrary forwarded host values. Retain missing origin and cross site rejection. App API responses remain no-store; Hosting has no-store headers. There are no static app copies in Hosting.

## Options considered

A redirect is simplest but changes the browser address. A custom purchased domain adds cost and setup. The chosen rewrite reuses the already approved Google services and address while keeping the existing backend.

## Value sourcing

| Value | Source |
|---|---|
| Browser address | Existing coffee-leaf-check Hosting site |
| Backend service and region | Existing Cloud Run deployment |
| Session identity and expiry | Existing signed temporary session module |
| Accepted additional origin | Exact PUBLIC_APP_ORIGIN environment value |
| Observations and reports | Existing verified screening and report code |

## Build plan

1. Update session cookie and exact configured origin boundary, add rejection and session regressions, run required checks (AC-2, AC-4).
2. Deploy the app with the exact public origin, then replace the Hosting redirect with the service rewrite (AC-1, AC-4).
3. Verify headers, asset loading, real photo journey, regional limitation and both PDFs at the short address (AC-1 through AC-4).

## Migration and rollback

Deploy the compatible app before the Hosting rewrite. The existing Cloud Run address remains a fallback. If Hosting verification fails, restore the prior 302 configuration. Do not claim completion before the new origin journey passes.

## Consequences

Firebase Hosting traffic can incur usage charges above its allowance. Its request timeout is 60 seconds, matching the current service timeout. API keys stay server side. This change does not complete agricultural validation or fluent language review.

## References

[Cloud Run integration](https://firebase.google.com/docs/hosting/cloud-run), [session cookie handling](https://firebase.google.com/docs/hosting/manage-cache).
