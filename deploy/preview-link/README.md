# Public app address

Status: deployed and verified on 14 October 2026. Public app address: https://coffee-leaf-check.web.app. The address stays in the browser throughout the app journey.

Firebase Hosting routes all paths to the existing coffee-health-demo Cloud Run service in asia-southeast1. This replaces the earlier 302 redirect. The preview target is scoped to gen-lang-client-0276450924. Only this target should be deployed from this directory. No public app files, photos or credentials are stored here.

The backend uses the signed __session cookie that Firebase forwards, with HttpOnly, Secure and SameSite strict. PUBLIC_APP_ORIGIN is exactly https://coffee-leaf-check.web.app. The request boundary retains foreign origin, missing origin and invalid session rejection. API responses and Hosting use no-store. Do not replace this with an iframe or an unrestricted proxy. Future app releases should preserve the cookie name and configured origin.

Verification: HTTPS HEAD returned 200 with no Location header. A fresh Chrome tab kept the short URL, loaded app assets and completed real preliminary and final Gemini checks with the permitted BRACOL 671 image. Country Brazil and four Not sure answers were retained. English and draft Tok Pisin three page PDFs downloaded, with country and case reference 0b137704 verified. Missing and foreign origins returned 400; missing and invalid sessions returned 409. Health returned 200.

Cloud Run revision: coffee-health-demo-00012-2b4. Build: 42fc7fa2-57bc-4089-b1aa-0f176f5fe9ba. Runtime secrets and the existing service account remain in use. Analytics remains disabled. No domain or additional credits were purchased. Hosting and Cloud Run usage may incur charges above the relevant allowances; USD 20 is a target, not an automatic cutoff.

Rollback: restore the prior 302 redirect to https://coffee-health-demo-952364218688.asia-southeast1.run.app/ and deploy only hosting:preview. The Cloud Run address remains a fallback.

Design: [public app address](../../docs/specs/0002-public-app-address.md). Official references: [Cloud Run rewrites](https://firebase.google.com/docs/hosting/cloud-run), [cookie handling](https://firebase.google.com/docs/hosting/manage-cache).
