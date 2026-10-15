import type { CareAction } from "@/lib/advice-contracts";
import { CARE_VERSION, CARE_IDS } from "@/lib/advice-contracts";

// Original care checks with source attribution, not independent review of this app.
export const careActions: CareAction[] = CARE_IDS.map((id) => ({
  id, version: CARE_VERSION, textKey: id, countryCodes: ["PG"], crop: "coffee", plantPart: "leaf",
  reviewStatus: "unreviewed", translationStatus: "draft", permissionStatus: "verified",
  sourceTitle: "Smallholder coffee production in Papua New Guinea, Farmer Training Guide, Unit 2, Module 5: Pest and disease management, ACIAR",
  sourceUrl: "https://www.aciar.gov.au/sites/default/files/2024-08/05_FTG_Unit2-M5-pests-diseases.pdf",
  section: id === "pg_check_weeds" ? "Section 5.2, printed page 15 (PDF page 21)" : id === "pg_check_drainage" ? "Sections 5.2 and 5.5, printed pages 13 and 52 (PDF pages 19 and 58)" : "Sections 5.2 and 5.5, printed pages 13 to 14 and 52 (PDF pages 19 to 20 and 58)",
  publicationDate: "2023", publicationReleaseDate: "2024-08-07", sourceUseBasis: "original_text_with_citation", copiedSourceAssets: false,
}));
