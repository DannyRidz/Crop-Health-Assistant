"use client";

import { useState } from "react";
import type english from "@/content/locales/en.json";
import { COUNTRIES } from "@/lib/countries";
import type { RegionContext } from "@/lib/contracts";
import type { Locale } from "@/lib/language";
import styles from "./screening.module.css";

type Props = { value: RegionContext; text: typeof english.assessment; locale: Locale; disabled: boolean; onChange: (region: RegionContext) => void };
export function RegionControl({ value, text: t, locale, disabled, onChange }: Props) {
  const [search, setSearch] = useState("");
  const matches = COUNTRIES.filter((country) => `${country.name} ${country.code}`.toLowerCase().includes(search.toLowerCase()));
  const options = matches.some((country) => country.code === value.countryCode) ? matches : [...matches, ...COUNTRIES.filter((country) => country.code === value.countryCode)];
  return <fieldset className={styles.region} disabled={disabled}>
    <legend>{t.countryTitle}</legend><p id="country-help">{t.countryHelp}</p>
    <label>{t.locationChoice}
      <select aria-describedby="country-help" value={value.response} onChange={(event) => onChange({ response: event.target.value as RegionContext["response"], countryCode: null, regionId: null })}>
        <option value="not_provided">{t.skipLocation}</option><option value="not_sure">{t.unknown}</option><option value="known">{t.knownCountry}</option>
      </select>
    </label>
    {value.response === "known" && <>
      <label>{t.countrySearch}<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      {locale === "tpi" && <p lang="tpi">{t.countryEnglish}</p>}
      <label>{t.country}
        <select lang="en" value={value.countryCode ?? ""} onChange={(event) => onChange({ response: "known", countryCode: event.target.value || null, regionId: null })}>
          <option value="" lang={locale}>{t.chooseCountry}</option>{options.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
        </select>
      </label>
      {matches.length === 0 && <p role="status">{t.noCountries}</p>}
    </>}
  </fieldset>;
}
