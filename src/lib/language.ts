export type Locale = "en" | "tpi";

export const LANGUAGE_STORAGE_KEY = "preferredLanguage";

type PreferenceReader = { getItem: (key: string) => string | null };
type PreferenceWriter = { setItem: (key: string, value: string) => void };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "tpi";
}

export function readLanguage(
  storage: PreferenceReader | null,
  fallback: Locale = "en",
): Locale {
  try {
    const value = storage?.getItem(LANGUAGE_STORAGE_KEY);
    return isLocale(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function rememberLanguage(
  storage: PreferenceWriter | null,
  locale: Locale,
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}
