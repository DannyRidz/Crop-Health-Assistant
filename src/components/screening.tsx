"use client";

import { useEffect, useRef, useState } from "react";
import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import { assessmentReducer, newAssessment, reportCurrent, type AssessmentAction, type Stage } from "@/lib/assessment";
import { ANSWER_OPTIONS, STARTER_IDS, regionSchema, type AssessInput, type AssessResponse, type LocalPhoto, type RegionContext, type Signed, type GuidanceSnapshot, type TextVariant, type Preliminary, type CheckedResult, type StarterAnswer } from "@/lib/contracts";
import { api, RequestFailure } from "@/lib/client-api";
import { preparePhoto } from "@/lib/client-photos";
import { selectLocale, useLanguage } from "@/lib/use-language";
import type { Locale } from "@/lib/language";
import { makeReport, type ReportData } from "@/lib/report";
import { RegionControl } from "./region-control";
import { ReportPreview } from "./report-preview";
import styles from "./screening.module.css";

type Busy = "photos" | "result" | "guidance" | "translation" | "export" | "photo" | null;
type TranslationState = { status: "pending" | "failed" } | { status: "ready"; variant: TextVariant };
type Props = { screeningAvailable: boolean; serviceTier: "demo" | "paid" };

export function Screening({ screeningAvailable, serviceTier }: Props) {
  const locale = useLanguage();
  const text = locale === "tpi" ? tokPisin : english;
  const t = text.assessment;
  const [state, setState] = useState(newAssessment);
  const memory = useRef(state);
  const epoch = useRef(0);
  const localeMemory = useRef(locale);
  const [busy, setBusy] = useState<Busy>(null);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<{ code: string; requestId?: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [permission, setPermission] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [translations, setTranslations] = useState<Record<string, TranslationState>>({});
  const translationCache = useRef(new Map<string, TranslationState>());
  const [acceptedEnglish, setAcceptedEnglish] = useState<Record<string, boolean>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(state.stage);
  const errorPanel = useRef<HTMLDivElement>(null);
  const reportDisclosure = useRef<HTMLDetailsElement>(null);

  useEffect(() => { localeMemory.current = locale; }, [locale]);
  useEffect(() => {
    if (previousStage.current === state.stage) return;
    previousStage.current = state.stage;
    heading.current?.focus();
  }, [state.stage]);
  useEffect(() => { if (error) errorPanel.current?.focus(); }, [error]);
  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [busy]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);
  useEffect(() => () => { for (const photo of memory.current.photos) URL.revokeObjectURL(photo.url); }, []);

  function apply(action: AssessmentAction) {
    memory.current = assessmentReducer(memory.current, action);
    setState(memory.current);
    setNotice(null);
  }
  function fail(error: unknown) {
    const failure = error instanceof RequestFailure ? error : new RequestFailure(error instanceof Error ? error.message : "unavailable", true);
    setError({ code: failure.code, requestId: failure.requestId });
    setCooldown(failure.retryAfter);
  }
  function clearMessage() { setError(null); setNotice(null); setSlow(false); }
  function currentText() {
    return memory.current.stage === "questions" ? memory.current.preliminary : memory.current.result;
  }
  async function ensureTranslation(value: Signed<Preliminary> | Signed<CheckedResult> | null, kind: "preliminary" | "result", target: Locale) {
    if (target !== "tpi" || !value || translationCache.current.has(value.data.textHash)) return;
    const hash = value.data.textHash;
    const pending: TranslationState = { status: "pending" };
    translationCache.current.set(hash, pending);
    setTranslations(Object.fromEntries(translationCache.current));
    setBusy("translation");
    try {
      const variant = await api<TextVariant>("/api/translate", JSON.stringify({ schemaVersion: 1, envelope: value.envelope, kind, target: "tpi", textHash: hash }), true);
      const expected = [
        ...value.data.observations.map((item) => `observation:${item.id}`),
        ...value.data.limitations.map((_, index) => `limitation:${index}`),
        ...value.data.missingInfo.map((_, index) => `missing:${index}`),
      ];
      if (variant.hash !== hash || Object.keys(variant.values).length !== expected.length || expected.some((key) => typeof variant.values[key] !== "string" || !variant.values[key].trim())) throw new Error("translation_unavailable");
      translationCache.current.set(hash, { status: "ready", variant });
    } catch { translationCache.current.set(hash, { status: "failed" }); }
    finally { setTranslations(Object.fromEntries(translationCache.current)); setBusy(null); setSlow(false); }
  }
  function changeLocale(next: Locale) {
    if (busy === "export") return;
    epoch.current++;
    localeMemory.current = next;
    selectLocale(next);
    if (!busy) void ensureTranslation(currentText(), memory.current.stage === "questions" ? "preliminary" : "result", next);
  }
  async function addPhoto(file: File | undefined, replaceId?: string) {
    if (!file || busy) return;
    clearMessage(); setBusy("photo"); epoch.current++;
    try {
      const previous = memory.current.photos.find((photo) => photo.id === replaceId);
      if (!previous && memory.current.photos.length >= 2) return;
      const photo = await preparePhoto(file, previous);
      const photos = previous ? memory.current.photos.map((item) => item.id === replaceId ? photo : item) : [...memory.current.photos, photo];
      if (previous) URL.revokeObjectURL(previous.url);
      apply({ type: "photos", photos });
    } catch (error) { fail(error); }
    finally { setBusy(null); }
  }
  function removePhoto(id: string) {
    epoch.current++;
    const photo = memory.current.photos.find((item) => item.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    apply({ type: "photos", photos: memory.current.photos.filter((item) => item.id !== id) }); clearMessage();
  }
  function answer(questionId: StarterAnswer["questionId"], option: string, checked: boolean) {
    epoch.current++;
    const previous = memory.current.answers.find((item) => item.questionId === questionId);
    let optionIds = [option];
    if (questionId === "symptoms" && option !== "not_sure") {
      const old = previous?.optionIds.filter((id) => id !== "not_sure") ?? [];
      optionIds = checked ? [...new Set([...old, option])] : old.filter((id) => id !== option);
    }
    apply({ type: "answer", answer: { questionId, optionIds, detail: previous?.detail ?? "" } }); setError(null);
  }
  async function assess(phase: "preliminary" | "final") {
    if (busy || cooldown) return;
    clearMessage();
    const captured = memory.current;
    if (!captured.photos.length) { fail(new Error("needPhoto")); return; }
    if (!permission) { fail(new Error("needPermission")); return; }
    if (phase === "final" && (!captured.preliminary || STARTER_IDS.some((id) => !captured.answers.find((answer) => answer.questionId === id)?.optionIds.length))) { fail(new Error("needAnswers")); return; }
    if (!regionSchema.safeParse(captured.region).success) { fail(new Error("needCountry")); return; }
    setBusy(phase === "preliminary" ? "photos" : "result");
    try {
      await api("/api/session");
      const metadata: AssessInput = { schemaVersion: 1, assessmentId: captured.id, inputRevision: captured.inputRevision,
        contextRevision: captured.contextRevision, phase, photos: captured.photos.map(({ id, side }) => ({ id, side })),
        starterAnswers: phase === "final" ? captured.answers : [], followUpAnswers: [],
        preliminaryEnvelope: phase === "final" ? captured.preliminary!.envelope : null, region: captured.region, isDemo: captured.isDemo };
      const form = new FormData(); form.append("metadata", JSON.stringify(metadata));
      for (const photo of captured.photos) form.append("photos", photo.blob, `${photo.id}.jpg`);
      const response = await api<AssessResponse>("/api/assess", form);
      setRemaining(response.remaining);
      if (response.phase === "preliminary") {
        apply({ type: "preliminary", assessmentId: captured.id, revision: captured.inputRevision, preliminary: response.preliminary });
        await ensureTranslation(response.preliminary, "preliminary", localeMemory.current);
      } else {
        apply({ type: "result", assessmentId: captured.id, revision: captured.inputRevision, result: response.result, guidance: response.guidance });
        await ensureTranslation(response.result, "result", localeMemory.current);
      }
    } catch (error) { setRemaining(null); fail(error); }
    finally { setBusy(null); setSlow(false); }
  }
  async function updateGuidance(region: RegionContext, applyChange = true) {
    if (busy) return;
    epoch.current++;
    if (applyChange) apply({ type: "region", region });
    const captured = memory.current;
    if (!captured.result || !regionSchema.safeParse(region).success) return;
    clearMessage(); setBusy("guidance");
    try {
      const guidance = await api<Signed<GuidanceSnapshot>>("/api/guidance", JSON.stringify({ schemaVersion: 1, resultEnvelope: captured.result.envelope, contextRevision: captured.contextRevision, region }), true);
      apply({ type: "guidance", guidance });
    } catch (error) { fail(error); }
    finally { setBusy(null); setSlow(false); }
  }
  function newCheck() {
    if (busy || !window.confirm(t.confirmClear)) return;
    epoch.current++;
    for (const photo of memory.current.photos) URL.revokeObjectURL(photo.url);
    memory.current = newAssessment(); setState(memory.current);
    translationCache.current.clear(); setTranslations({}); setAcceptedEnglish({}); setPermission(false); clearMessage();
  }
  const activeText = state.stage === "questions" ? state.preliminary?.data : state.result?.data;
  const translation = activeText ? translations[activeText.textHash] : undefined;
  const variant = translation?.status === "ready" ? translation.variant : undefined;
  const englishAllowed = !!activeText && !!acceptedEnglish[activeText.textHash];
  const canShowGenerated = locale === "en" || !!variant || englishAllowed;
  const generatedLocale = locale === "tpi" && variant ? "tpi" : "en";
  function generated(key: string, value: string) { return generatedLocale === "tpi" ? variant!.values[key] : value; }
  let report: ReportData | null = null;
  if (state.stage === "report" && reportCurrent(state) && (locale === "en" || !state.result || variant || englishAllowed)) report = makeReport(state, locale, variant, englishAllowed);

  async function exportReport() {
    if (busy || !report) return;
    clearMessage(); setBusy("export");
    const frozen = report, capturedEpoch = epoch.current;
    try {
      const response = await fetch("/fonts/NotoSans-Regular.ttf", { cache: "force-cache" });
      if (!response.ok) throw new Error("exportError");
      const { createPdf } = await import("@/lib/pdf");
      const bytes = await createPdf(frozen, new Uint8Array(await response.arrayBuffer()));
      if (epoch.current !== capturedEpoch || !reportCurrent(memory.current)) return;
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = frozen.filename; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000); setNotice("downloaded");
    } catch { setNotice("exportError"); }
    finally { setBusy(null); }
  }
  const steps: Stage[] = ["photos", "questions", "result", "report"];
  const titles = { photos: t.photoTitle, questions: t.questionTitle, result: state.result ? t.resultTitle : t.noResultShort, report: t.reportTitle };
  const errorMessage = error ? (t.errors as Record<string, string>)[error.code] ?? (t as Record<string, unknown>)[error.code] as string ?? t.errors.unavailable : null;
  const canPrepareIncompleteReport = !!error && ["disabled", "unavailable", "network", "timeout", "invalid_output", "expired", "busy", "quota"].includes(error.code);

  function photoPanel(photo: LocalPhoto, index: number, editable: boolean) {
    return <figure className={styles.photoPanel} key={photo.id} id={`photo-${photo.id}`} tabIndex={-1}>
      {/* Local photo blobs are temporary and are not remote optimisation inputs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={`${t.photo} ${index + 1}`} width={photo.width} height={photo.height} />
      <figcaption>{t.photo} {index + 1}</figcaption>
      {editable ? <>
        <label>{t.side}<select disabled={!!busy} value={photo.side} onChange={(event) => { epoch.current++; apply({ type: "photos", photos: memory.current.photos.map((item) => item.id === photo.id ? { ...item, side: event.target.value as LocalPhoto["side"] } : item) }); }}>
          <option value="unknown">{t.unknown}</option><option value="upper">{t.upper}</option><option value="underside">{t.underside}</option>
        </select></label>
        <div className={styles.actions}><label className={styles.fileButton} aria-disabled={!!busy}>{t.replace}<input disabled={!!busy} type="file" accept="image/jpeg,image/png,image/webp" aria-label={`${t.replace} ${t.photo} ${index + 1}`} onChange={(event) => { void addPhoto(event.target.files?.[0], photo.id); event.target.value = ""; }} /></label>
          <button disabled={!!busy} onClick={() => removePhoto(photo.id)}>{t.remove} {index + 1}</button></div>
      </> : <p>{t.side}: {t[photo.side]}</p>}
    </figure>;
  }

  const translationPanel = activeText && locale === "tpi" && <aside className={styles.note}>
    {variant ? <p>{t.automatic}</p> : translation?.status === "pending" ? <p role="status">{t.translationLoading}</p> : <>
      <p>{t.translationUnavailable}</p><button disabled={!!busy} onClick={() => setAcceptedEnglish((old) => ({ ...old, [activeText.textHash]: true }))}>{t.showEnglish}</button>
    </>}
    {englishAllowed && !variant && <p>{t.englishFallback}</p>}
  </aside>;
  const observationPanel = activeText && <section className={styles.section}>
    <h2>{state.stage === "questions" ? t.preliminary : t.visibleShort}</h2>
    {canShowGenerated && <div className={styles.observations} lang={generatedLocale}>
      {activeText.observations.length ? activeText.observations.map((observation) => <article key={observation.id}>
        <div className={styles.photoLinks}>{observation.photoIds.map((id) => <button key={id} onClick={() => { const target = document.getElementById(`photo-${id}`); target?.focus(); target?.scrollIntoView({ block: "nearest", behavior: "auto" }); }}>{t.photo} {state.photos.findIndex((photo) => photo.id === id) + 1}</button>)}</div>
        <p>{generated(`observation:${observation.id}`, observation.textEn)}</p>
      </article>) : <p lang={locale}>{t.noObservations}</p>}
    </div>}
    {state.stage === "questions" && canShowGenerated && activeText.limitations.length > 0 && <>
      <h3>{t.uncertain}</h3>{activeText.limitations.map((value, index) => <p key={index} lang={generatedLocale}>{generated(`limitation:${index}`, value)}</p>)}
    </>}
    {state.stage === "questions" && canShowGenerated && activeText.missingInfo.length > 0 && <>
      <h3>{t.missing}</h3>{activeText.missingInfo.map((value, index) => <p key={index} lang={generatedLocale}>{generated(`missing:${index}`, value)}</p>)}
    </>}
  </section>;
  const guidancePanel = <section className={styles.note}>
    <h2>{t.nextShort}</h2>
    <p>{state.region.response === "known" ? t.noRegionalShort : t.unknownRegionalShort}</p>
    <details className={styles.disclosure}><summary>{t.reviewDetails}</summary><p>{t.pngPending}</p><p>{t.initial}</p></details>
    {state.result && !reportCurrent(state) && <><p>{t.regionStale}</p><button disabled={!!busy || !regionSchema.safeParse(state.region).success} onClick={() => void updateGuidance(state.region, false)}>{t.regionRetry}</button></>}
  </section>;

  return <div className={styles.shell} lang={locale}>
    <a className={styles.skipLink} href="#main">{text.skipLink}</a>
    <header className={styles.header}>
      <p className={styles.wordmark}>Crop Health Assistant</p>
      <div className={styles.language} role="group" aria-label={text.languageLabel}>
        <button disabled={busy === "export"} aria-pressed={locale === "en"} onClick={() => changeLocale("en")} lang="en">English</button>
        <button disabled={busy === "export"} aria-pressed={locale === "tpi"} onClick={() => changeLocale("tpi")} lang="tpi">Tok Pisin</button>
      </div>
    </header>
    <main id="main" className={styles.main}>
      {state.stage === "photos" && <div className={styles.intro}><p>{t.introShort}</p>
        <div className={styles.tags}><span>{text.scopeLabel}</span></div>
      </div>}
      {locale === "tpi" && <p className={styles.small}>{t.draftShort}</p>}
      <ol className={styles.progress} aria-label={text.journeyTitle}>{steps.map((step, index) => <li key={step} aria-current={state.stage === step ? "step" : undefined}><span>{index + 1}</span>{t[step]}</li>)}</ol>
      <div className={styles.title}><p>{t.step} {steps.indexOf(state.stage) + 1} {t.of} 4</p><h1 ref={heading} tabIndex={-1}>{titles[state.stage]}</h1></div>
      {error && <div id="assessment-error" className={styles.error} role="alert" ref={errorPanel} tabIndex={-1}><p>{errorMessage}</p>{error.requestId && <p className={styles.small}>{t.reference}: {error.requestId}</p>}{cooldown > 0 && <p>{cooldown}s</p>}</div>}
      {busy && <div className={styles.note} role="status"><p>{busy === "photos" ? t.checkingPhotos : busy === "result" ? t.checkingResult : busy === "guidance" ? t.regionUpdating : busy === "translation" ? t.translationLoading : busy === "export" ? t.downloading : t.processing}</p>{slow && <p>{t.slow}</p>}</div>}
      {state.stage === "photos" && <div className={styles.collection}>
        <section className={styles.section}>
          <p>{t.photoHelpShort}</p><div className={styles.photoGrid}>{state.photos.map((photo, index) => photoPanel(photo, index, true))}</div>
          {state.photos.length < 2 && <div className={styles.upload}>
            <label className={styles.fileButton} aria-disabled={!!busy}>{t.addPhoto}<input disabled={!!busy} type="file" accept="image/jpeg,image/png,image/webp" aria-label={t.addPhoto} onChange={(event) => { void addPhoto(event.target.files?.[0]); event.target.value = ""; }} /></label>
            <label className={styles.fileButton} aria-disabled={!!busy}>{t.camera}<input disabled={!!busy} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" aria-label={t.camera} onChange={(event) => { void addPhoto(event.target.files?.[0]); event.target.value = ""; }} /></label>
          </div>}
          <p className={styles.small}>{t.fileHint}</p>
          <p className={styles.small}>{t.privacyShort}</p><p className={styles.small}>{t.coverageShort}</p>
          {serviceTier === "demo" && <p className={styles.note}>{t.demoPrivacy}</p>}
          <details className={styles.disclosure}><summary>{t.privacyDetails}</summary><p>{t.limits}</p><p>{serviceTier === "paid" ? t.paidPrivacy : t.demoPrivacy}</p><p>{t.privacy}</p></details>
          <label className={styles.permission}><input type="checkbox" checked={permission} disabled={!!busy} aria-invalid={error?.code === "needPermission"} aria-describedby={error?.code === "needPermission" ? "assessment-error" : undefined} onChange={(event) => { setPermission(event.target.checked); if (error?.code === "needPermission") setError(null); }} />{t.permission}</label>
          <div className={styles.actions}><button className={styles.primary} disabled={!!busy || cooldown > 0} onClick={() => void assess("preliminary")}>{t.checkPhotos}</button>
            {state.preliminary && <button disabled={!!busy} onClick={() => apply({ type: "stage", stage: "questions" })}>{t.questions}</button>}
            {canPrepareIncompleteReport && state.photos.length > 0 && <button disabled={!!busy} onClick={() => { clearMessage(); apply({ type: "stage", stage: "report" }); }}>{t.incompleteReport}</button>}
          </div>
        </section>
        <aside className={styles.context}><h2>{text.beforeTitle}</h2><p>{t.initialShort}</p><details className={styles.disclosure}><summary>{t.prototypeDetails}</summary><p>{t.intro}</p><p>{t.pngPending}</p><p>{t.coverage}</p></details>{!screeningAvailable && <p className={styles.note}>{t.enableNote}</p>}</aside>
      </div>}
      {state.stage === "questions" && <>
        <div className={`${styles.photoGrid} ${styles.questionPhotos}`}>{state.photos.map((photo, index) => photoPanel(photo, index, false))}</div>
        {translationPanel}<details className={styles.disclosure} open={state.preliminary?.data.photoChecks.some((check) => check.quality !== "usable" || check.crop !== "coffee" || check.part !== "leaf")}><summary>{t.photoDetails}</summary>{observationPanel}
          {state.preliminary && <ul className={styles.quality}>{state.preliminary.data.photoChecks.map((check) => <li key={check.photoId}>{t.photo} {state.photos.findIndex((photo) => photo.id === check.photoId) + 1}: {t.quality}, {t[check.quality]}; {t.cropPart}, {t[check.crop]}, {t[check.part]}</li>)}</ul>}</details>
        <section className={styles.section}><h2>{t.questions}</h2><p>{t.questionsShort}</p>
          {STARTER_IDS.map((id, index) => {
            const question = t.questionBank[id], selected = state.answers.find((item) => item.questionId === id);
            return <fieldset className={styles.question} key={id} disabled={!!busy} aria-invalid={error?.code === "needAnswers" && !selected?.optionIds.length} aria-describedby={error?.code === "needAnswers" && !selected?.optionIds.length ? "assessment-error" : undefined}><legend>{index + 1}. {question.label}</legend>
              <div className={styles.options}>{ANSWER_OPTIONS[id].map((option) => <label key={option} className={selected?.optionIds.includes(option) ? styles.selected : undefined}>
                <input type={id === "symptoms" ? "checkbox" : "radio"} name={id} checked={!!selected?.optionIds.includes(option)} onChange={(event) => answer(id, option, event.target.checked)} />
                {(question.options as Record<string, string>)[option]}</label>)}</div>
              {id === "care_change" && <label>{t.detail}<textarea maxLength={300} value={selected?.detail ?? ""} onChange={(event) => { epoch.current++; apply({ type: "answer", answer: { questionId: id, optionIds: selected?.optionIds ?? ["not_sure"], detail: event.target.value } }); }} /></label>}
            </fieldset>;
          })}
          <RegionControl value={state.region} text={t} locale={locale} disabled={!!busy} onChange={(region) => { epoch.current++; if (error?.code === "needCountry") setError(null); apply({ type: "region", region }); }} />
          <div className={styles.actions}><button className={styles.primary} disabled={!!busy || cooldown > 0} onClick={() => void assess("final")}>{t.getResult}</button><button disabled={!!busy} onClick={() => { clearMessage(); apply({ type: "stage", stage: "photos" }); }}>{t.backPhotos}</button>{canPrepareIncompleteReport && <button disabled={!!busy} onClick={() => { clearMessage(); apply({ type: "stage", stage: "report" }); }}>{t.incompleteReport}</button>}</div>
        </section>
      </>}
      {state.stage === "result" && state.result && <>
        <div className={styles.status}><strong>{t[state.result.data.status]}</strong>{state.result.data.coverageUnavailable && <p>{t.photoCheckComplete}</p>}<p>{t.initialShort}</p></div>{translationPanel}
        <div className={styles.resultGrid}><div className={styles.photoGrid}>{state.photos.map((photo, index) => photoPanel(photo, index, false))}</div>{observationPanel}</div>
        <section className={styles.section}><h2>{t.uncertainShort}</h2><p>{t.coverageShort}</p>{state.result.data.unsupported && <p>{t.unsupported}</p>}{canShowGenerated && state.result.data.limitations.map((value, index) => <p key={index} lang={generatedLocale}>{generated(`limitation:${index}`, value)}</p>)}{canShowGenerated && state.result.data.missingInfo.length > 0 && <><h3>{t.missing}</h3>{state.result.data.missingInfo.map((value, index) => <p key={index} lang={generatedLocale}>{generated(`missing:${index}`, value)}</p>)}</>}</section>
        <RegionControl value={state.region} text={t} locale={locale} disabled={!!busy} onChange={(region) => void updateGuidance(region)} />{guidancePanel}
        <div className={styles.actions}><button className={styles.primary} disabled={!!busy || !reportCurrent(state)} onClick={() => apply({ type: "stage", stage: "report" })}>{t.prepareReport}</button><button disabled={!!busy} onClick={() => apply({ type: "stage", stage: "questions" })}>{t.editAnswers}</button><button disabled={!!busy} onClick={() => apply({ type: "stage", stage: "photos" })}>{t.backPhotos}</button></div>
      </>}
      {state.stage === "report" && <>
        <p>{t.reportShort}</p><p className={styles.small}>{t.reportSummary}</p>{!state.result && <p className={styles.note}>{t.noResult}</p>}{translationPanel}
        <RegionControl value={state.region} text={t} locale={locale} disabled={!!busy} onChange={(region) => void updateGuidance(region)} />{guidancePanel}
        {!report && state.result && locale === "tpi" && !variant && !englishAllowed && <p>{t.noTranslationExport}</p>}
        {report && <details className={styles.preview} ref={reportDisclosure}><summary>{t.reportPreview}</summary><ReportPreview report={report} /></details>}
        <div className={styles.actions}><button className={styles.primary} disabled={!!busy || !report} onClick={() => void exportReport()}>{t.download}</button><button disabled={!!busy || !report} onClick={() => { if (reportDisclosure.current) reportDisclosure.current.open = true; window.print(); }}>{t.print}</button><button disabled={!!busy} onClick={() => apply({ type: "stage", stage: state.result ? "result" : state.preliminary ? "questions" : "photos" })}>{state.result ? t.backResult : state.preliminary ? t.questions : t.backPhotos}</button></div>
        {notice && <p role="status" className={styles.note}>{(t as Record<string, unknown>)[notice] as string}</p>}
      </>}
      {remaining !== null && <p className={styles.small}>{t.remaining}: {remaining}</p>}
      {state.photos.length > 0 && <button className={styles.newCheck} disabled={!!busy} onClick={newCheck}>{t.newCheck}</button>}
    </main><footer className={styles.footer}><p>{t.sessionShort}</p></footer>
  </div>;
}
