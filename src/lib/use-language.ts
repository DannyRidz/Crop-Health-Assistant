"use client";

import { useEffect, useSyncExternalStore } from "react";
import { LANGUAGE_STORAGE_KEY, readLanguage, rememberLanguage, type Locale } from "./language";

const LANGUAGE_EVENT = "crop-health:language";
let currentLocale: Locale | null = null;
function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === LANGUAGE_STORAGE_KEY || event.key === null) { currentLocale = null; listener(); }
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_EVENT, listener);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(LANGUAGE_EVENT, listener); };
}
function getLocale(): Locale {
  if (currentLocale !== null) return currentLocale;
  try { return readLanguage(window.localStorage); } catch { return "en"; }
}
export function selectLocale(locale: Locale) {
  currentLocale = locale;
  try { rememberLanguage(window.localStorage, locale); } catch { /* The tab still supports language changes. */ }
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}
export function useLanguage(): Locale {
  const locale = useSyncExternalStore(subscribe, getLocale, () => "en" as Locale);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return locale;
}
