import i18next from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { locales, defaultLocale } from './i18n';

let initialized = false;

export function initI18nClient(locale: string) {
  if (initialized) return;

  i18next
    .use(initReactI18next)
    .use(
      resourcesToBackend((lng: string, ns: string) =>
        import(`../public/locales/${lng}/${ns}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

  initialized = true;
}

export { i18next };
