"use client"

import Heading from "./Heading"
import { useTranslation } from "react-i18next"

export default function Section() {
  const { t } = useTranslation()
  return (
    <section>
      <Heading title={t("samplesection.title")} />
      <p>{t("samplesection.subtitle")}</p>
    </section>
  )
}
