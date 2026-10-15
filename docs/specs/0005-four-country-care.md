# 0005. Care sources for four pilot countries

**Date**: 2026-10-15
**Status**: In Progress
**Implementation approval**: The user accepted the recommended Indonesia, Kenya and Brazil expansion alongside PNG and requested that the country selector list only those four countries. Approval was given on 15 October 2026.

## Summary

Extend the existing sourced care path in specification 0004. Keep the public app accessible from any country, but shorten the location form to the four pilot care countries, Not sure and Skip for now. Care remains AI selected and not independently reviewed. This does not enable chemical products or establish agricultural validation in the new countries.

## Requirements

- **RC-1**: Both languages and every country edit surface list PG, ID, KE and BR only, plus the existing unknown and skipped choices. The English order is Papua New Guinea, Indonesia, Kenya, Brazil. Existing ISO input validation and country display remain available for older signed cases; the selector is not an access rule.
- **RC-2**: An explicitly stated country selects its own source records. Unknown, skipped and other existing country contexts receive no regional care. Language and location changes preserve the photo evidence.
- **RC-3**: Keep the three finite action identifiers and the existing maximum of three model selections. Regional records resolve those selections to matching sources. No extra model request is added for country selection.
- **RC-4**: Preserve all three existing PG checks. Add the general garden management check for ID, KE and BR. Add the weed check for KE, where the source supports avoiding injury. No drainage check is extended outside PG.
- **RC-5**: The result, full preview and PDF retain the chosen country's source, section, scope, unreviewed status and limitations in English and draft Tok Pisin. Never label a published source as a review of this app. Brazil's source is mainly Arabica evidence; show that limitation and give no variety specific prescription.
- **RC-6**: Existing chemical eligibility, label requirements, quotas, secrets, four step layout and public URL remain. Verify the country list in a real browser, the regional selections with deterministic tests and representative live result and PDF paths. Keep one Cloud Run instance; use a remote build and no simulator.

## Decision

Extend the current catalogue in place. Keep the internal action IDs stable, including their legacy pg prefix, because they identify evidence linked checks rather than a runtime geography rule. Add separate fully attributed regional records and one shared resolver used by selection, UI and report generation. The model sees the available source scopes without seeing the farmer's location. Bump care, prompt and policy versions to invalidate older signed advice.

No new provider, library, service, secret, persistence or page is needed. The short selector is the user's requested product choice. Retain full ISO validation to avoid making it a country admission rule or corrupting older records.

## Source mapping and content boundaries

All wording is the existing original team authored care wording, with attribution. No source images, page scans, tables, exact spray rates or copied text are redistributed. Source use verification is limited to this original factual paraphrase. Independent review remains pending.

| Country | Selected check | Source and exact scope |
|---|---|---|
| PG | Existing three checks | Existing ACIAR record and source sections in specification 0004 |
| ID | Garden management | BBPP Lembang, Indonesian Ministry of Agriculture, Good Agricultural Practices (GAP) Coffee, Elvina Herdiani, 17 December 2018, coffee maintenance and coffee leaf rust management paragraphs. General check only, no pruning amount or fertilizer instruction |
| KE | Garden management and weeds | Kenya Coffee Platform, Kenya Coffee Sustainability Manual, modules 4 and 6, sections 7.5.1 and 8.4.2, printed pages 38 to 48, 55 to 60, 64 and 68. Publication date not stated in the inspected document; do not infer it from the URL. General checks only |
| BR | Garden management | Sera and colleagues, Coffee Leaf Rust in Brazil: Historical Events, Current Situation, and Control Measures, Agronomy 2022, 12, 496, section 5, pages 15 to 16, published 17 February 2022. Mainly Arabica evidence, not a variety specific prescription. Original article states CC BY 4.0 |

The shared helper remains: These are general garden checks. The photo does not show which change is needed. No disease diagnosis, deficiency, pruning method, shade amount, fertilizer dose or cure follows from these checks. The broader general care path for unknown countries remains a later source and design task; current observational next checks remain available.

## Build plan

1. Shorten the country selector and explain that farmers can skip if their country is absent. RC-1.
2. Add regional records and a shared country resolver. Preserve existing evidence filtering and review separation; bind current versions. RC-2 to RC-4.
3. Resolve sources and source scope consistently in results and both PDF languages. RC-5.
4. Run local lint, types and meaningful boundary checks, then remote build and real public verification. RC-1 to RC-6.

## Failure and rollout

Missing source, wrong region, unavailable care selection or unknown country keeps the photo findings and existing limitations. A browser from another country remains able to use screening. Source version changes require a new check through existing version handling. Deploy to the existing service with maximum one instance and preserve the exact Hosting origin and secret references. Rollback is routing traffic to revision coffee-health-demo-00027-567 if the real flow fails.

## References

- Indonesia: https://bbpplembang.bppsdmp.pertanian.go.id/publikasi-detail/1219
- Kenya: https://www.globalcoffeeplatform.org/wp-content/uploads/2021/03/KCS-MANUAL-review-03112020.pdf
- Brazil: https://ainfo.cnptia.embrapa.br/digital/bitstream/doc/1150780/1/Coffee-Leaf-Rust-in-Brazil.pdf
- Prior approved feature: [0004](0004-ai-care-and-label-based-treatment.md).
