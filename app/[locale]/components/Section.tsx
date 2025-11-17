"use client"

import React from "react"
import Heading from "./Heading"
import { useTranslation } from "react-i18next"

export default function Section({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <section className="p-8 flex flex-col gap-3">
      <Heading title={t("samplesection.title")} />
      <p>{t("samplesection.subtitle")}</p>
      {children}
    </section>
  )
}
