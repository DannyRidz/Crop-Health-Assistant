"use client";

import { useEffect, useId, useRef, useState } from "react";
import type english from "@/content/locales/en.json";
import { COUNTRIES, countryName } from "@/lib/countries";
import type { RegionContext } from "@/lib/contracts";
import type { Locale } from "@/lib/language";
import styles from "./screening.module.css";

type Props = { value: RegionContext; text: typeof english.assessment; locale: Locale; disabled: boolean; compact?: boolean; onChange: (region: RegionContext) => void };
export function RegionControl({ value, text: t, locale, disabled, compact = false, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const helpId = useId();
  const selectRef = useRef<HTMLSelectElement>(null);
  const changeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (disabled) return;
    if (compact && editing) selectRef.current?.focus();
    else if (restoreFocus.current) { changeRef.current?.focus(); restoreFocus.current = false; }
  }, [compact, editing, disabled]);
  const selected = value.response === "known" ? value.countryCode ?? "not_provided" : value.response;
  if (compact && !editing) return <div className={styles.regionSummary}>
    <p><strong>{t.country}: </strong><span lang={value.response === "known" ? "en" : locale}>{value.response === "known" && value.countryCode ? countryName(value.countryCode) : value.response === "not_sure" ? t.unknown : t.notProvided}</span></p>
    <button ref={changeRef} disabled={disabled} aria-label={t.changeCountry} onClick={() => setEditing(true)}>{t.change}</button>
  </div>;
  return <fieldset className={styles.region} disabled={disabled}>
    <legend>{t.countryTitle}</legend><p id={helpId}>{t.countryHelp}</p>
    {locale === "tpi" && <p className={styles.small} lang="tpi">{t.countryEnglish}</p>}
    <label>{t.countryOptional}
      <select ref={selectRef} aria-describedby={helpId} value={selected} onChange={(event) => {
        const choice = event.target.value;
        onChange(choice === "not_provided" || choice === "not_sure" ? { response: choice, countryCode: null, regionId: null } : { response: "known", countryCode: choice, regionId: null });
        if (compact) { restoreFocus.current = true; setEditing(false); }
      }}>
        <option value="not_provided">{t.skipLocation}</option><option value="not_sure">{t.unknown}</option>
        {COUNTRIES.map((country) => <option key={country.code} value={country.code} lang="en">{country.name}</option>)}
      </select>
    </label>
    {compact && <button onClick={() => { restoreFocus.current = true; setEditing(false); }}>{t.cancelCountryChange}</button>}
  </fieldset>;
}
