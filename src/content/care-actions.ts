import type { CareAction } from "@/lib/advice-contracts";
import { CARE_VERSION, CARE_IDS } from "@/lib/advice-contracts";

// Original care checks with source attribution, not independent review of this app.
export const careActions: CareAction[] = CARE_IDS.map((id) => ({
  id, version: CARE_VERSION, textKey: id, countryCodes: ["PG"], crop: "coffee", plantPart: "leaf",
  reviewStatus: "unreviewed", translationStatus: "reviewed", permissionStatus: "verified",
  sourceTitle: "Smallholder coffee production in Papua New Guinea, Farmer Training Guide, Unit 2, Module 5: Pest and disease management, ACIAR",
  sourceUrl: "https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf",
  section: id === "pg_check_weeds" ? "Section 5.2, printed page 15 (PDF page 21)" : id === "pg_check_drainage" ? "Sections 5.2 and 5.5, printed pages 13 and 52 (PDF pages 19 and 58)" : "Sections 5.2 and 5.5, printed pages 13 to 14 and 52 (PDF pages 19 to 20 and 58)",
  publicationDate: "2023", publicationReleaseDate: "2024-08-07", sourceUseBasis: "original_text_with_citation", copiedSourceAssets: false,
}));

// Country records retain original check wording and have their own supporting sources.
const management = careActions.find((action) => action.id === "pg_review_garden_management")!;
const weeds = careActions.find((action) => action.id === "pg_check_weeds")!;
const kenya = {
  sourceTitle: "Kenya Coffee Sustainability Manual, Kenya Coffee Platform",
  sourceUrl: "https://www.globalcoffeeplatform.org/wp-content/uploads/2021/03/KCS-MANUAL-review-03112020.pdf",
  publicationDate: "Not stated", publicationReleaseDate: "Not stated",
};
export const regionalCareActions: CareAction[] = [
  ...careActions,
  { ...management, countryCodes: ["ID"], sourceTitle: "Good Agricultural Practices (GAP) Coffee, Elvina Herdiani, BBPP Lembang, Indonesian Ministry of Agriculture",
    sourceUrl: "https://bbpplembang.bppsdmp.pertanian.go.id/publikasi-detail/1219", section: "Coffee maintenance and coffee leaf rust management paragraphs", publicationDate: "2018-12-17", publicationReleaseDate: "2018-12-17" },
  { ...management, ...kenya, countryCodes: ["KE"], section: "Modules 4 and 6, section 8.4.2; printed pages 38 to 48, 55 to 60 and 68" },
  { ...weeds, ...kenya, countryCodes: ["KE"], section: "Section 7.5.1, printed page 64 (PDF page 64)" },
  { ...management, countryCodes: ["BR"], sourceTitle: "Coffee Leaf Rust in Brazil: Historical Events, Current Situation, and Control Measures, Sera and colleagues, Agronomy 2022, 12, 496",
    sourceUrl: "https://ainfo.cnptia.embrapa.br/digital/bitstream/doc/1150780/1/Coffee-Leaf-Rust-in-Brazil.pdf", section: "Section 5, Cultural Management, pages 15 to 16; mainly Arabica coffee evidence", publicationDate: "2022-02-17", publicationReleaseDate: "2022-02-17" },
];
export function careActionsForCountry(countryCode: string | null): CareAction[] {
  return regionalCareActions.filter((action) => countryCode !== null && action.countryCodes.includes(countryCode) && action.permissionStatus === "verified");
}
