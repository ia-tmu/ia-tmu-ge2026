"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { useEffect, useState, type ReactNode } from "react";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { type Locale, defaultLocale, locales } from "../../i18n";

type Props = {
  children: ReactNode;
  locale: Locale;
  resources?: Record<string, any>;
};

export default function I18nProvider(props: Props) {
  const { children, locale, resources } = props;

  const [instance] = useState(() => {
    const i18n = createInstance();

    i18n
      .use(initReactI18next)
      .use(
        resourcesToBackend(
          (lang: string, ns: string) =>
            import(`../../../public/locales/${lang}/${ns}.json`)
        )
      )
      .init({
        lng: locale,
        fallbackLng: defaultLocale,
        ns: ["translation"],
        defaultNS: "translation",
        supportedLngs: locales,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
        resources,
      });

    return i18n;
  });

  useEffect(() => {
    instance.changeLanguage(locale);
  }, [locale, instance]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
