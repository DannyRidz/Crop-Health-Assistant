import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import type { Assessment } from "./assessment";
import { reportCurrent } from "./assessment";
import type { Locale } from "./language";
import { GLOSSARY_VERSION, type LocalPhoto, type TextVariant } from "./contracts";
import { countryName } from "./countries";
import { findingHeadline } from "./result-copy";
import { diagnosticReferences } from "@/content/diagnostic-references";

export type ReportSection = { title: string; lines: string[]; language?: Locale; generatedFrom?: number; includePhotos?: boolean; layout?: "bullets" | "answers" | "metadata"; labels?: string[] };
export type ReportData = { reference: string; title: string; sections: ReportSection[]; photos: LocalPhoto[]; photoLabel: string; photoCaptions?: string[]; filename: string };
export function makeReport(state: Assessment, locale: Locale, variant: TextVariant | undefined, englishAccepted: boolean): ReportData {
  if (!reportCurrent(state)) throw new Error("regionStale");
  const t = (locale === "tpi" ? tokPisin : english).assessment;
  const result = state.result?.data;
  const sourceIds = [...new Set(result?.possibleCauses.flatMap((cause) => cause.sourceIds) ?? [])];
  const translated = !!result && variant?.hash === result.textHash && variant.glossaryVersion === GLOSSARY_VERSION;
  if (locale === "tpi" && result && !translated && !englishAccepted) throw new Error("noTranslationExport");
  const generatedLocale = locale === "tpi" && translated ? "tpi" : "en";
  const obs = (key: string, fallback: string) => generatedLocale === "tpi" ? variant!.values[key] ?? fallback : fallback;
  const region = state.region.response === "known" ? `${countryName(state.region.countryCode!)} (${state.region.countryCode})` : state.region.response === "not_sure" ? t.unknown : t.notProvided;
  const formatDate = (date: string) => new Intl.DateTimeFormat(locale === "tpi" ? "en-GB" : "en", { dateStyle: "medium", timeStyle: "short", timeZone: state.timezone }).format(new Date(date));
  const sections: ReportSection[] = [
    { title: t.caseSummary, lines: [`${t.reference}: ${state.id}`, `${t.assessed}: ${result ? formatDate(result.assessedAt) : t.notProvided}`, `${t.countryValue}: ${region}`, ...(result ? [findingHeadline(result, t), result.visualFinding === "no_clear_changes" ? t.healthCaveat : t.visualCaveat] : [t.noResult]), ...(locale === "tpi" ? [t.fixedDraft, result ? translated ? t.automatic : t.englishFallback : t.fixedDraft].filter((value, index, values) => values.indexOf(value) === index) : [])] },
  ];
  const observationLine = (observation: NonNullable<typeof result>["observations"][number]) => `${t.photo} ${observation.photoIds.map((id) => state.photos.findIndex((photo) => photo.id === id) + 1).join(", ")}${observation.photoIds.some((id) => result!.excludedPhotoIds.includes(id)) ? ` (${t.excludedPhoto})` : ""}: ${obs(`observation:${observation.id}`, observation.textEn)}`;
  const generatedNotice: string[] = [];
  if (result) {
    const keyObservations = result.observations.filter((item) => result.keyObservationIds.includes(item.id));
    sections.push({ title: t.keyFindings, language: generatedLocale, generatedFrom: generatedNotice.length, lines: [...generatedNotice, ...(keyObservations.length ? keyObservations.map(observationLine) : [t.noObservations])] });
    const causeIntro = [t.causeIntro, ...(result.possibleCauses.length ? [] : [t.noCauseStatus]), ...(result.unsupported ? [t.unsupported] : [])];
    sections.push({ title: t.causeTitle, language: generatedLocale, generatedFrom: causeIntro.length, lines: [...causeIntro, obs("causeAssessment", result.causeAssessmentEn)] });
    for (const [index, cause] of result.possibleCauses.entries()) {
      const evidence = cause.observationIds.flatMap((id) => result.observations.find((item) => item.id === id)?.photoIds ?? []);
      sections.push({ title: obs(`cause:${index}:nameEn`, cause.nameEn), language: generatedLocale, lines: [
        t.possibleCauseLabel,
        `${t.whyFits}: ${obs(`cause:${index}:whyEn`, cause.whyEn)}`,
        [...new Set(evidence)].map((id) => `${t.photo} ${state.photos.findIndex((photo) => photo.id === id) + 1}`).join(", "),
        `${t.causeUncertainty}: ${obs(`cause:${index}:uncertaintyEn`, cause.uncertaintyEn)}`,
        `${t.nextCheck}: ${obs(`cause:${index}:nextCheckEn`, cause.nextCheckEn)}`,
        cause.sourceIds.length ? `${t.source}: ${cause.sourceIds.map((id) => sourceIds.indexOf(id) + 1).sort((a, b) => a - b).join(", ")}` : t.modelKnowledge,
      ] });
    }
    if (result.collectionPrompts.length) sections.push({ title: t.nextInformation, lines: [...result.collectionPrompts.map((prompt) => `${t.collection[prompt.id]}${prompt.photoIds.length ? ` (${prompt.photoIds.map((id) => `${t.photo} ${state.photos.findIndex((photo) => photo.id === id) + 1}`).join(", ")})` : ""}`), t.collectionHelp] });
  }
  sections.push({ title: t.photos, includePhotos: true, lines: [`${t.coffee}, ${t.leaf}`, t.processed,
    ...(result ? result.photoChecks.map((check) => `${t.photo} ${state.photos.findIndex((photo) => photo.id === check.photoId) + 1}: ${t.quality}, ${t[check.quality]}; ${t.cropPart}, ${t[check.crop]}, ${t[check.part]}`) : []),
    ...(result?.excludedPhotoIds.length ? [`${t.excludedPhoto}: ${result.excludedPhotoIds.map((id) => `${t.photo} ${state.photos.findIndex((photo) => photo.id === id) + 1}`).join(", ")}`] : [])] });
  sections.push({ title: t.farmerRecord, lines: Object.entries(t.questionBank).map(([id, question]) => {
    const answer = state.answers.find((value) => value.questionId === id);
    const options = question.options as Record<string, string>;
    return `${question.label}\n${answer ? answer.optionIds.map((option) => options[option]).join(", ") + (answer.detail ? `\n${answer.detail}` : "") : t.emptyAnswer}`;
  }) });
  if (result) {
    const remaining = result.observations.filter((item) => !result.keyObservationIds.includes(item.id));
    if (remaining.length) sections.push({ title: t.aiObservations, language: generatedLocale, generatedFrom: generatedNotice.length, lines: [...generatedNotice, ...remaining.map(observationLine)] });
    if (result.limitations.length) sections.push({ title: t.uncertain, language: generatedLocale, lines: result.limitations.map((value, index) => obs(`limitation:${index}`, value)) });
    if (result.contradictions.length) sections.push({ title: t.aiUncertainty, language: generatedLocale, generatedFrom: generatedNotice.length, lines: [...generatedNotice, ...result.contradictions.map((item, index) => `${obs(`conflict:${index}`, item.textEn)}${item.observationIds.length ? ` (${item.observationIds.map((id) => result.observations.find((observation) => observation.id === id)).filter((item) => !!item).map(observationLine).join("; ")})` : ""}`)] });
    if (result.missingInfo.length) sections.push({ title: t.missing, language: generatedLocale, lines: result.missingInfo.map((value, index) => obs(`missing:${index}`, value)) });
  }
  const entries = state.guidance?.data.entries.filter((entry) => entry.language === locale) ?? [];

  if (sourceIds.length) {
    sections.push({ title: t.diagnosticSources, lines: [t.sourcesLimit] });
    sections.push({ title: t.source, language: "en", lines: sourceIds.flatMap((id, index) => { const source = diagnosticReferences[id]; return [`${index + 1}. ${source.title}`, `${source.section}. ${source.geography}.`, source.url]; }) });
  }
  sections.push({ title: t.guidance, lines: entries.length ? entries.flatMap((entry) => [entry.text, `${t.reviewGeography}: ${entry.reviewGeography}`, ...(entry.applicableCountryCodes.includes("PG") ? [t.pngReviewed] : []), ...entry.regionalLimitations, `${t.source}: ${entry.sourceTitle}, ${entry.sectionOrPage}, ${entry.sourceUrl}`, `${entry.agriculturalReviewDate}, ${entry.regionalReviewDate}`, entry.attribution]) : [state.region.response === "known" ? t.noRegional : t.unknownRegional] });
  sections.push({ title: t.limitsHeading, lines: [t.pngPending, t.initial, t.share, t.temporary] });
  sections.push({ title: t.demonstration, lines: [`${t.created}: ${formatDate(state.createdAt)}`, `${t.timezone}: ${state.timezone}`, `${t.language}: ${locale === "tpi" ? "Tok Pisin" : "English"}`, ...(result ? [`${t.reportVersions}: ${result.schemaVersion}, ${result.promptVersion}, ${result.policyVersion}, ${result.registryVersion}`] : [])] });
  const bulletTitles = [t.keyFindings, t.nextInformation, t.aiObservations, t.uncertain, t.aiUncertainty, t.missing, t.limitsHeading];
  for (const section of sections) {
    if (bulletTitles.includes(section.title)) section.layout = "bullets";
    if (section.title === t.farmerRecord) section.layout = "answers";
    if (section.title === t.demonstration) section.layout = "metadata";
    section.labels = [t.reference, t.assessed, t.countryValue, t.screeningStatus, t.whyFits, t.causeUncertainty, t.nextCheck, t.source, t.created, t.timezone, t.language, t.reportVersions];
  }
  return { reference: state.id, title: t.reportHeading, sections, photos: state.photos.slice(), photoLabel: t.photo, photoCaptions: state.photos.map((photo, index) => `${t.photo} ${index + 1}: ${t[photo.side]}`), filename: `coffee-screening-${state.id.slice(0, 8)}-${locale}.pdf` };
}
