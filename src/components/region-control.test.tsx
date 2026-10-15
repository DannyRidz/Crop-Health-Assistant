import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RegionControl } from "./region-control";
import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import { UNKNOWN_REGION } from "@/lib/contracts";

describe("four country location form", () => {
  it.each(["en", "tpi"] as const)("renders only four countries plus skipped and unknown choices in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(RegionControl, { value: UNKNOWN_REGION, text: (locale === "en" ? english : tokPisin).assessment, locale, disabled: false, onChange: () => {} }));
    const values = [...html.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1]);
    expect(values).toEqual(["not_provided", "not_sure", "PG", "ID", "KE", "BR"]);
    expect(html).not.toContain('value="BN"'); expect(html).not.toContain('value="US"');
    expect(html).toContain('value="not_provided" selected=""');
  });
});
