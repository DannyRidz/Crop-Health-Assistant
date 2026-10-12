import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import type { Assessment } from "./assessment";
import { reportCurrent } from "./assessment";
import type { Locale } from "./language";
import type { LocalPhoto, TextVariant } from "./contracts";
import { countryName } from "./countries";

export type ReportSection = { title: string; lines: string[]; language?: Locale; generatedFrom?: number };
export type ReportData = { reference: string; title: string; sections: ReportSection[]; photos: LocalPhoto[]; photoLabel: string; filename: string };
export function makeReport(state: Assessment, locale: Locale, variant: TextVariant | undefined, englishAccepted: boolean): ReportData {
  if (!reportCurrent(state)) throw new Error("regionStale");
  const t = (locale === "tpi" ? tokPisin : english).assessment;
  const result = state.result?.data;
  const translated = !!result && variant?.hash === result.textHash;
  if (locale === "tpi" && result && !translated && !englishAccepted) throw new Error("noTranslationExport");
  const generatedLocale = locale === "tpi" && translated ? "tpi" : "en";
  const obs = (key: string, fallback: string) => generatedLocale === "tpi" ? variant!.values[key] ?? fallback : fallback;
  const region = state.region.response === "known" ? `${countryName(state.region.countryCode!)} (${state.region.countryCode})` : state.region.response === "not_sure" ? t.unknown : t.notProvided;
  const formatDate = (date: string) => new Intl.DateTimeFormat(locale === "tpi" ? "en-GB" : "en", { dateStyle: "medium", timeStyle: "short", timeZone: state.timezone }).format(new Date(date));
  const sections: ReportSection[] = [
    { title: t.demonstration, lines: [t.initial, ...(locale === "tpi" ? [t.fixedDraft] : []), `${t.reference}: ${state.id}`, `${t.created}: ${formatDate(state.createdAt)}`, `${t.assessed}: ${result ? formatDate(result.assessedAt) : t.notProvided}`, `${t.timezone}: ${state.timezone}`, `${t.language}: ${locale === "tpi" ? "Tok Pisin" : "English"}`] },
    { title: t.photos, lines: [`${t.coffee}, ${t.leaf}`, `${t.countryValue}: ${region}`, t.processed] },
    { title: t.answers, lines: Object.entries(t.questionBank).map(([id, question]) => {
      const answer = state.answers.find((value) => value.questionId === id);
      const options = question.options as Record<string, string>;
      return `${question.label}\n${answer ? answer.optionIds.map((option) => options[option]).join(", ") + (answer.detail ? `\n${answer.detail}` : "") : t.emptyAnswer}`;
    }) },
  ];
  if (result) {
    sections.push({ title: t.visible, language: generatedLocale, generatedFrom: locale === "tpi" ? 1 : 0, lines: [
      ...(locale === "tpi" ? [translated ? t.automatic : t.englishFallback] : []),
      ...result.observations.map((observation) => `${t.photo} ${observation.photoIds.map((id) => state.photos.findIndex((photo) => photo.id === id) + 1).join(", ")}: ${obs(`observation:${observation.id}`, observation.textEn)}`),
      ...(result.observations.length === 0 ? [t.noObservations] : []),
    ] });
    sections.push({ title: t.meaning, lines: [`${t.status}: ${t[result.status]}`, t.coverage, ...(result.unsupported ? [t.unsupported] : [])] });
    const generatedNotice = locale === "tpi" ? [translated ? t.automatic : t.englishFallback] : [];
    sections.push({ title: t.uncertain, language: generatedLocale, generatedFrom: 1 + generatedNotice.length, lines: [t.initial, ...generatedNotice, ...result.limitations.map((value, index) => obs(`limitation:${index}`, value))] });
    sections.push({ title: t.missing, ...(result.missingInfo.length ? { language: generatedLocale, generatedFrom: generatedNotice.length } : {}), lines: result.missingInfo.length ? [...generatedNotice, ...result.missingInfo.map((value, index) => obs(`missing:${index}`, value))] : [t.noMissing] });
  } else sections.push({ title: t.status, lines: [t.noResult] });
  const entries = state.guidance?.data.entries.filter((entry) => entry.language === locale) ?? [];
  sections.push({ title: t.guidance, lines: entries.length ? entries.flatMap((entry) => [entry.text, `${t.reviewGeography}: ${entry.reviewGeography}`, ...(entry.applicableCountryCodes.includes("PG") ? [t.pngReviewed] : []), ...entry.regionalLimitations, `${t.source}: ${entry.sourceTitle}, ${entry.sectionOrPage}, ${entry.sourceUrl}`, `${entry.agriculturalReviewDate}, ${entry.regionalReviewDate}`, entry.attribution]) : [state.region.response === "known" ? t.noRegional : t.unknownRegional] });
  sections.push({ title: t.limitsHeading, lines: [t.pngPending, t.initial, t.share, t.temporary] });
  return { reference: state.id, title: t.reportHeading, sections, photos: state.photos.slice(), photoLabel: t.photo, filename: `coffee-screening-${state.id.slice(0, 8)}-${locale}.pdf` };
}
