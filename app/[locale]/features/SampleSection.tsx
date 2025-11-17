"use client"

import Button from "../components/Button"
import Section from "../components/Section"
import LangSwitcher from "../features/LangSwitcher"
import { localePath } from "../lib/localePath";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next"

export default function SampleSection() {
  const params = useParams();
  const locale = params.locale;
  const { t } = useTranslation()

  return (
    <Section>
      <Button href={localePath(locale as string, "/works")}>
        {t("sampleSection.works")}
      </Button>
      <LangSwitcher />
    </Section>
  )
}
