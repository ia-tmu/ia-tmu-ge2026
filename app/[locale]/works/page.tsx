"use client"

import { useParams } from "next/navigation";
import Heading from "../components/Heading"
import Button from "../components/Button"
import { useTranslation } from "react-i18next"
import { localePath } from "../lib/localePath";

export default function Works() {
  const params = useParams();
  const locale = params.locale;
  const { t } = useTranslation()
  return (
    <section>
      <Heading title={t("works.title")} />
      <p>{t("works.description")}</p>
      <Button href={localePath(locale as string, "/")}>Go to Home Page</Button>
    </section>
  )
}
