import { describe, expect, it } from "vitest";
import { LANGUAGE_STORAGE_KEY, readLanguage, rememberLanguage } from "./language";

describe("language preference, AC-10 foundation", () => {
  it("restores the saved Tok Pisin preference", () => {
    expect(readLanguage({ getItem: () => "tpi" })).toBe("tpi");
  });

  it.each([null, "fr", "", "TPI", "<script>"])("uses English for an absent or invalid saved preference %s", (value) => {
    expect(readLanguage({ getItem: () => value })).toBe("en");
  });

  it("keeps the current tab preference when reading storage fails", () => {
    expect(readLanguage({ getItem: () => { throw new Error("Storage blocked"); } }, "tpi")).toBe("tpi");
  });

  it("writes only the language preference to device storage", () => {
    const entries = new Map<string, string>();
    rememberLanguage({ setItem: (key, value) => { entries.set(key, value); } }, "tpi");
    expect([...entries]).toEqual([[LANGUAGE_STORAGE_KEY, "tpi"]]);
  });

  it("handles unavailable or blocked storage without throwing", () => {
    expect(rememberLanguage(null, "tpi")).toBe(false);
    expect(rememberLanguage({ setItem: () => { throw new Error("Storage blocked"); } }, "tpi")).toBe(false);
  });
});
