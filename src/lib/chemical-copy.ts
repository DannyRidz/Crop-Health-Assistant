import english from "@/content/locales/en.json";
import type { ChemicalProduct } from "./advice-contracts";

export function chemicalLines(product: ChemicalProduct): { label: string; text: string }[] {
  const t = english.assessment;
  return [
    { label: t.chemicalRate, text: `${product.rate} ${product.units}` }, { label: t.chemicalMethod, text: product.method }, { label: t.chemicalStage, text: product.plantStage },
    { label: t.chemicalTiming, text: product.timing }, { label: t.chemicalFrequency, text: product.frequency }, { label: t.chemicalHarvest, text: product.harvestInterval },
    { label: t.chemicalReentry, text: product.reentryInterval }, { label: t.chemicalPpe, text: product.protectiveEquipment }, { label: t.chemicalEnvironment, text: product.environmentalRestrictions },
    { label: t.chemicalPrecautions, text: product.otherPrecautions }, { label: t.chemicalApplicability, text: product.applicability },
  ];
}
