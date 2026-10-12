"use client";

import { useEffect, useSyncExternalStore } from "react";
import english from "@/content/locales/en.json";
import tokPisin from "@/content/locales/tpi.json";
import { LANGUAGE_STORAGE_KEY, readLanguage, rememberLanguage, type Locale } from "@/lib/language";
import styles from "./welcome.module.css";

const LANGUAGE_EVENT = "crop-health:language";
let currentLocale: Locale | null = null;

function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === LANGUAGE_STORAGE_KEY || event.key === null) {
      currentLocale = null;
      listener();
    }
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LANGUAGE_EVENT, listener);
  };
}

function getLocale(): Locale {
  if (currentLocale !== null) return currentLocale;
  try {
    return readLanguage(window.localStorage);
  } catch {
    return "en";
  }
}

function selectLocale(locale: Locale) {
  currentLocale = locale;
  try {
    rememberLanguage(window.localStorage, locale);
  } catch {
    // The current tab can still change language when device storage is blocked.
  }
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function Welcome() {
  const locale = useSyncExternalStore(subscribe, getLocale, () => "en" as Locale);
  const text: typeof english = locale === "tpi" ? tokPisin : english;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className={styles.shell} lang={locale}>
      <a className={styles.skipLink} href="#main">{text.skipLink}</a>
      <header className={styles.header}>
        <p className={styles.wordmark}>Crop Health Assistant</p>
        <div className={styles.language} role="group" aria-label={text.languageLabel}>
          <button type="button" aria-pressed={locale === "en"} onClick={() => selectLocale("en")} lang="en">English</button>
          <button type="button" aria-pressed={locale === "tpi"} onClick={() => selectLocale("tpi")} lang="tpi">Tok Pisin</button>
        </div>
      </header>

      <main id="main" className={styles.main} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="welcome-title">
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1 id="welcome-title">{text.title}</h1>
            <p className={styles.lead}>{text.introduction}</p>
            <ul className={styles.scope} aria-label={text.scopeLabel}>
              <li>{text.scopeLabel}</li>
              <li>{text.validationLabel}</li>
            </ul>
          </div>
          <aside className={styles.availability} aria-labelledby="availability-title">
            <p className={styles.prototype}>{text.prototypeLabel}</p>
            <h2 id="availability-title">{text.availabilityTitle}</h2>
            <p>{text.availabilityText}</p>
            <p className={styles.screeningStatement}>{text.screeningStatement}</p>
          </aside>
        </section>

        {locale === "tpi" && (
          <aside className={styles.translationNotice} aria-label="Translation review" lang="en">
            <p>{english.translationNotice}</p>
            <p lang="tpi">{text.translationNotice}</p>
          </aside>
        )}

        <section className={styles.journeySection} aria-labelledby="journey-title">
          <h2 id="journey-title">{text.journeyTitle}</h2>
          <ol className={styles.journey}>
            {text.journey.map((step, index) => (
              <li key={index}>
                <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.beforeSection} aria-labelledby="before-title">
          <h2 id="before-title">{text.beforeTitle}</h2>
          <div className={styles.notes}>
            <article><h3>{text.uncertaintyTitle}</h3><p>{text.uncertaintyText}</p></article>
            <article><h3>{text.regionalTitle}</h3><p>{text.regionalText}</p></article>
            <article><h3>{text.sessionTitle}</h3><p>{text.sessionText}</p></article>
          </div>
        </section>
      </main>
      <footer className={styles.footer}><p>{text.footer}</p></footer>
    </div>
  );
}
