import type { CheckedResult, ModelOutput, PhotoMeta, RegionContext } from "./contracts";
import { careActions } from "@/content/care-actions";
import { chemicalProducts } from "@/content/chemical-products";
import { CARE_VERSION, PRODUCT_VERSION, CONDITION_IDS, chemicalContextKey, type AdviceSnapshot, type ChemicalContext, type ChemicalDecision, type ChemicalProduct } from "./advice-contracts";

const DAY = 86400000;
export function eligibleObservationIds(result: Pick<CheckedResult, "observations" | "photoChecks">): Set<string> {
  const photos = new Set(result.photoChecks.filter((check) => check.crop === "coffee" && check.part === "leaf" && check.quality === "usable").map((check) => check.photoId));
  return new Set(result.observations.filter((observation) => observation.feature !== "unclear" && observation.feature !== "no_distinct_change" && observation.photoIds.every((id) => photos.has(id))).map((observation) => observation.id));
}
export function sanitizeAdvice(output: ModelOutput): ModelOutput {
  const eligible = eligibleObservationIds(output);
  const issues = new Set(output.adviceIssues ?? []);
  const seen = new Set<string>();
  const selections = (output.careSelections ?? []).filter((item) => {
    const valid = !seen.has(item.actionId) && careActions.some((action) => action.id === item.actionId) && item.observationIds.length > 0 && new Set(item.observationIds).size === item.observationIds.length && item.observationIds.every((id) => eligible.has(id));
    seen.add(item.actionId); if (!valid) issues.add("invalid_selection"); return valid;
  }).slice(0, 3);
  const possibleCauses = output.possibleCauses.map((cause) => ({ ...cause, targetId: cause.targetId ?? null, targetEvidence: (cause.targetEvidence ?? []).filter((sign) => {
    const valid = sign.signId === "orange_yellow_powder_underside" && new Set(sign.observationIds).size === sign.observationIds.length && sign.observationIds.every((id) => eligible.has(id) && cause.observationIds.includes(id));
    if (!valid) issues.add("invalid_selection"); return valid;
  }) }));
  return { ...output, possibleCauses, careSelections: selections, adviceIssues: [...issues] };
}
export function hasRustEvidence(result: CheckedResult): boolean {
  if (result.visualFinding !== "changes_visible" || result.contradictions.length || result.unsupported) return false;
  const eligible = eligibleObservationIds(result);
  return result.possibleCauses.some((cause) => cause.targetId === "coffee_leaf_rust" && cause.targetEvidence?.some((sign) =>
    sign.signId === "orange_yellow_powder_underside" && sign.observationIds.length > 0 && sign.observationIds.every((id) => {
      const observation = result.observations.find((item) => item.id === id);
      return eligible.has(id) && cause.observationIds.includes(id) && observation?.feature === "surface_material" && observation.photoIds.every((photoId) => result.photoSides.some((photo) => photo.id === photoId && photo.side === "underside"));
    })));
}
export function labelDeadline(product: ChemicalProduct): number {
  const verified = Date.parse(product.verifiedAt);
  return Math.min(verified + 7 * DAY, ...[product.officialExpiresAt, product.withdrawnAt].filter((value): value is string => value !== null).map(Date.parse));
}
export function verifiedProduct(product: ChemicalProduct, now: number): boolean {
  const strings = [product.id, product.version, product.name, product.activeIngredient, product.concentration, product.formulation, product.registrationId, product.verifiedBy,
    product.labelRevision, product.labelSection, product.rate, product.units, product.method, product.plantStage, product.timing, product.frequency,
    product.harvestInterval, product.reentryInterval, product.protectiveEquipment, product.environmentalRestrictions, product.otherPrecautions, product.applicability];
  if (strings.some((value) => !value?.trim()) || !/^https:\/\//.test(product.registrationUrl) || !/^https:\/\//.test(product.labelUrl) || !/^[a-f0-9]{64}$/.test(product.labelHash) ||
    product.registrationStatus !== "verified" || product.sourceUse !== "verified" || product.rateKind !== "single" || product.crop !== "coffee" || product.targetId !== "coffee_leaf_rust" ||
    !Number.isFinite(Date.parse(product.verifiedAt)) || Date.parse(product.verifiedAt) > now || !Number.isFinite(labelDeadline(product)) || product.requiredConditions.length > 8) return false;
  const ids = product.requiredConditions.map((condition) => condition.id);
  if (new Set(ids).size !== ids.length || product.requiredConditions.some((condition) => !CONDITION_IDS.includes(condition.id) || !condition.questionEn.trim() || !condition.labelRequirement.trim() || !condition.sourceSection.trim())) return false;
  return CONDITION_IDS.every((id) => ids.includes(id) || !!product.notApplicableConditions[id]?.trim());
}
export function productOptions(result: CheckedResult, region: RegionContext, products: ChemicalProduct[], now: number): ChemicalProduct[] {
  if (region.response !== "known" || !hasRustEvidence(result)) return [];
  const matching = products.filter((product) => product.countryCode === region.countryCode && product.targetId === "coffee_leaf_rust" && verifiedProduct(product, now) && labelDeadline(product) > now);
  return matching.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)).slice(0, 2);
}
export function chemicalEligibility(input: { result: CheckedResult; region: RegionContext; contextRevision: number; context: ChemicalContext | null; locale: "en" | "tpi"; now: number; products?: ChemicalProduct[] }): ChemicalDecision {
  const { result, region, contextRevision, context, locale, now } = input;
  const no = (reason: Exclude<ChemicalDecision["reason"], null>, unmetCondition: string | null = null): ChemicalDecision => ({ reason, product: null, unmetCondition });
  if (region.response !== "known") return no("region_unknown");
  if (!result.possibleCauses.some((cause) => cause.targetId === "coffee_leaf_rust")) return no("no_target");
  if (!hasRustEvidence(result)) return no("insufficient_evidence");
  const products = input.products ?? chemicalProducts;
  const matching = products.filter((product) => product.countryCode === region.countryCode && product.targetId === "coffee_leaf_rust");
  if (!matching.length) return no("no_local_record");
  if (context && matching.some((product) => product.id === context.productId && Number.isFinite(labelDeadline(product)) && labelDeadline(product) <= now)) return no("label_expired");
  const options = productOptions(result, region, products, now);
  if (!options.length) return no(matching.some((product) => verifiedProduct(product, now)) ? "label_expired" : "label_unverified");
  const product = options.find((item) => item.id === context?.productId);
  if (!context || !product || context.resultId !== result.id || context.contextRevision !== contextRevision || context.catalogueVersion !== PRODUCT_VERSION || context.labelHash !== product.labelHash || context.locale !== locale || !context.identityConfirmed) return no("identity_unconfirmed");
  if (locale === "tpi" && !context.englishAccepted) return no("english_not_accepted");
  if (Object.keys(context.answers).some((id) => !product.requiredConditions.some((condition) => condition.id === id))) return no("conditions_not_met");
  for (const condition of product.requiredConditions) {
    if (!context.answers[condition.id] || context.answers[condition.id] === "not_sure") return no("conditions_unanswered", condition.id);
    if (context.answers[condition.id] !== "yes") return no("conditions_not_met", condition.id);
  }
  return { reason: null, product, unmetCondition: null };
}
export function buildAdvice(result: CheckedResult, region: RegionContext, contextRevision: number, options: { now?: number; context?: ChemicalContext | null; locale?: "en" | "tpi"; products?: ChemicalProduct[]; sessionExpiresAt?: number } = {}): AdviceSnapshot {
  const now = options.now ?? Date.now(), locale = options.locale ?? "en", products = options.products ?? chemicalProducts;
  const eligible = eligibleObservationIds(result);
  const selections = result.visualFinding === "changes_visible" ? result.careSelections.filter((selection) => selection.observationIds.length > 0 && selection.observationIds.every((id) => eligible.has(id))) : [];
  const careIds = region.response === "known" ? selections.flatMap((selection) => careActions.filter((action) => action.id === selection.actionId && action.countryCodes.includes(region.countryCode!) && action.permissionStatus === "verified").map((action) => action.id)) : [];
  const chemical = chemicalEligibility({ result, region, contextRevision, context: options.context ?? null, locale, now, products });
  return { resultId: result.id, contextRevision, region, careVersion: CARE_VERSION, productVersion: PRODUCT_VERSION, careIds: [...new Set(careIds)],
    careAvailability: region.response !== "known" ? "region_unknown" : careIds.length ? "available" : selections.length ? "no_regional_source" : "no_selection",
    issues: result.adviceIssues, products: productOptions(result, region, products, now), chemical, checkedAt: now,
    validUntil: Math.min(now + 600000, options.sessionExpiresAt ?? now + 600000, chemical.product ? labelDeadline(chemical.product) : now + 600000),
    contextKey: options.context ? chemicalContextKey(options.context) : null, contextDigest: null, locale };
}
export function chemicalReportProduct(result: CheckedResult, snapshot: AdviceSnapshot, context: ChemicalContext | null, region: RegionContext, revision: number, locale: "en" | "tpi", now: number, verifiedDigest: string | null = null): ChemicalProduct | null {
  if (!context || snapshot.validUntil <= now || snapshot.checkedAt > now || snapshot.resultId !== result.id || snapshot.contextRevision !== revision || snapshot.locale !== locale || JSON.stringify(snapshot.region) !== JSON.stringify(region) || snapshot.careVersion !== CARE_VERSION || snapshot.productVersion !== PRODUCT_VERSION || snapshot.contextKey !== chemicalContextKey(context) || !verifiedDigest || snapshot.contextDigest !== verifiedDigest) return null;
  const decision = chemicalEligibility({ result, region, contextRevision: revision, context, locale, now, products: chemicalProducts });
  return decision.product && decision.product.labelHash === snapshot.chemical.product?.labelHash ? decision.product : null;
}
// Photo sides remain explicit farmer input, never inferred from language or geography.
export function checkedPhotoSides(photos: PhotoMeta[]): PhotoMeta[] { return photos.map(({ id, side }) => ({ id, side })); }
