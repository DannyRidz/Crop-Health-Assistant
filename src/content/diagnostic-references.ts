// Published diagnostic background, not review of this app or approval of local treatments.
export const diagnosticReferences = {
  aps_coffee_rust: {
    title: "Coffee rust, American Phytopathological Society",
    url: "https://www.apsnet.org/edcenter/pdlessons/Pages/CoffeeRust.aspx",
    section: "Symptoms and Signs",
    geography: "General coffee disease education; not a regional treatment approval",
    context: "Coffee rust can show pale yellow spots above the leaf and orange powder below. Older affected areas may become brown. Yellowing alone cannot identify rust.",
  },
  hawaii_leaf_identification: {
    title: "Surveying and identifying coffee leaf rust, University of Hawaii Cooperative Extension",
    url: "https://www.hawaiicoffeeed.com/uploads/2/6/7/7/26772370/surveying_and_identifying_clr_publication_122020_final.pdf",
    section: "Pages 2 and 13, including Appendix D",
    geography: "Hawaii diagnostic publication; not reviewed guidance for PNG or other countries",
    context: "Cercospora leaf spot can show circular brown spots with light yellow halos. Rust often has irregular yellow spots and orange powder underneath. Early rust need not show powder; older rust spots can brown. Top and bottom views help distinguish patterns. Other pest, nutritional and disease symptoms can resemble rust.",
  },
} as const;
export type DiagnosticReferenceId = keyof typeof diagnosticReferences;
