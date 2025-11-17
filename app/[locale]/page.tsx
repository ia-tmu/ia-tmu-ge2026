import { initI18next, Locale } from '../i18n';

export default async function Page({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const i18n = await initI18next(locale, ['translation']);

  console.log('Current locale:', locale);
  console.log('Loaded resources:', i18n.services.resourceStore.data);
  console.log('Translation test:', i18n.t('test'));

  const { t } = i18n;

  return (
    <div>
      <h1>{t("test")}</h1>
    </div>
  );
}
