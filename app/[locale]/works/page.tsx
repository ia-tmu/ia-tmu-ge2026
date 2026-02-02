"use client"

import { useParams } from "next/navigation";
import Button from "../components/Button"
import Section from "../components/Section"
import { useTranslation } from "react-i18next"
import { localePath } from "../lib/localePath";

export default function Works() {
  const params = useParams();
  const locale = params.locale;
  const { t } = useTranslation()
  return (
    <Section title={t("works.title")} subtitle={t("works.subtitle")}>
      <Button href={localePath(locale as string, "/")}>{t("works.back")}</Button>
    </Section>
  )
}
