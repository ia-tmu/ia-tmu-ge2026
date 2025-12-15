// app/i18n.ts
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";

// 共通設定ファイルから読み込む（Single Source of Truth）
// eslint-disable-next-line @typescript-eslint/no-require-imports
const i18nConfigData = require("../i18n.config.js");
export const locales = i18nConfigData.locales as readonly ["ja", "en"];
export const defaultLocale = i18nConfigData.defaultLocale as "ja";

export type Locale = (typeof locales)[number];

export const i18nConfig = {
  locales,
  defaultLocale,
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function initI18next(
  locale: Locale,
  namespaces: string[] = ["translation"]
) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      ns: namespaces,
      defaultNS: "translation",
      supportedLngs: locales,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  await i18nInstance.loadNamespaces(namespaces);

  return i18nInstance;
}
