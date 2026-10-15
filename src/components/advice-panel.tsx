"use client";

import { useEffect, useState } from "react";
import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import { careActions } from "@/content/care-actions";
import { PRODUCT_VERSION, type AdviceSnapshot, type ChemicalContext, type ChemicalProduct } from "@/lib/advice-contracts";
import { chemicalLines } from "@/lib/chemical-copy";
import { chemicalReportProduct } from "@/lib/ai-advice";
import type { CheckedResult, RegionContext } from "@/lib/contracts";
import type { Locale } from "@/lib/language";
import styles from "./screening.module.css";

export function AdvicePanel({ advice, result, region, revision, locale, context, verifiedDigest, busy, onChange, onSubmit }: {
  advice: AdviceSnapshot; result: CheckedResult; region: RegionContext; revision: number; locale: Locale; context: ChemicalContext | null; verifiedDigest: string | null; busy: boolean;
  onChange: (context: ChemicalContext | null) => void; onSubmit: (context: ChemicalContext) => Promise<void>;
}) {
  const t = (locale === "tpi" ? tokPisin : english).assessment;
  const [englishAccepted, setEnglishAccepted] = useState(false);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const actions = advice.careIds.flatMap((id) => careActions.filter((action) => action.id === id));
  const product = chemicalReportProduct(result, advice, context, region, revision, locale, now, verifiedDigest);
  const selected = advice.products.find((item) => item.id === context?.productId);
  const choose = (item: ChemicalProduct) => onChange({ resultId: result.id, contextRevision: revision, productId: item.id, labelHash: item.labelHash, catalogueVersion: PRODUCT_VERSION, answers: {}, identityConfirmed: false, locale, englishAccepted: locale === "tpi" && englishAccepted });
  return <section className={styles.collectionNotes}>
    <h2>{t.careTitle}</h2>
    {actions.length ? <><p className={styles.small}>{t.careUnreviewed}</p><ul>{actions.map((action) => <li key={action.id}>{t.careActions[action.textKey]}</li>)}</ul><p className={styles.small}>{t.careHelper}</p>
      <details className={styles.disclosure}><summary>{t.sourcesDetails}</summary><p>{t.careSourceScope}</p><p><a href={actions[0].sourceUrl} target="_blank" rel="noopener noreferrer" lang="en">{actions[0].sourceTitle}</a></p><ul lang="en">{[...new Set(actions.map((action) => action.section))].map((section) => <li key={section}>{section}</li>)}</ul></details></> :
      <p>{advice.careAvailability === "region_unknown" ? t.careRegionUnknown : advice.careAvailability === "no_regional_source" ? t.careNoRegion : t.careNone}</p>}
    {advice.issues.length > 0 && <p className={styles.small}>{t.careInvalid}</p>}
    <h3>{t.chemicalTitle}</h3>
    {!advice.products.length ? <p>{advice.chemical.reason === "region_unknown" ? t.chemicalUnknown : advice.chemical.reason === "insufficient_evidence" ? t.chemicalNoEvidence : t.chemicalUnavailable}</p> : <>
      {locale === "tpi" && !englishAccepted ? <><p>{t.chemicalEnglish}</p><button disabled={busy} onClick={() => setEnglishAccepted(true)}>{t.chemicalShowEnglish}</button></> : <div lang="en">
        <p>{english.assessment.chemicalCaveat}</p>
        {advice.products.map((item) => <article key={item.id}><h4>{item.name} ({item.concentration}, {item.formulation})</h4><p>{item.activeIngredient} | {item.registrationId}</p><button disabled={busy} onClick={() => choose(item)}>{english.assessment.chemicalChoose}</button></article>)}
        {selected && context && <form onSubmit={(event) => { event.preventDefault(); void onSubmit(context); }}>
          <h4>{selected.name}</h4><p>{english.assessment.chemicalConditions}</p>
          <label className={styles.permission}><input type="checkbox" disabled={busy} checked={context.identityConfirmed} onChange={(event) => onChange({ ...context, identityConfirmed: event.target.checked })} />{english.assessment.chemicalIdentity}</label>
          {selected.requiredConditions.map((condition) => <label className={styles.condition} key={condition.id}>{condition.questionEn}<select required disabled={busy} value={context.answers[condition.id] ?? ""} onChange={(event) => onChange({ ...context, answers: { ...context.answers, [condition.id]: event.target.value as "yes" | "no" | "not_sure" } })}><option value="" disabled>{english.assessment.chooseAnswer}</option><option value="yes">Yes</option><option value="no">No</option><option value="not_sure">Not sure</option></select></label>)}
          <button disabled={busy} type="submit">{english.assessment.chemicalSubmit}</button>
          {!product && <p role="status">{advice.chemical.reason === "conditions_unanswered" || advice.chemical.reason === "conditions_not_met" ? english.assessment.chemicalConditionsFailed : now >= advice.validUntil && advice.contextKey ? english.assessment.chemicalExpired : english.assessment.chemicalPending}</p>}
        </form>}
        {product && <section className={styles.chemicalGroup} data-chemical-group><h4>{product.name}: {english.assessment.chemicalLabel}</h4><p>{english.assessment.careUnreviewed}</p><p>{english.assessment.chemicalCaveat}</p>{chemicalLines(product).map((line) => <p key={line.label}><strong>{line.label}:</strong> {line.text}</p>)}<p>{product.labelRevision}, {product.labelSection}</p><a href={product.labelUrl} target="_blank" rel="noopener noreferrer">{english.assessment.chemicalLabel}</a><p>{english.assessment.chemicalChecked}: {new Date(advice.checkedAt).toISOString()}</p></section>}
      </div>}
    </>}
  </section>;
}
