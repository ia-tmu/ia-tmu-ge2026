"use client";

import Heading from "../components/Heading";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="bg-neutral-200 p-8">
      <Heading title={t("hero.title")} />
      <p>{t("hero.subtitle")}</p>
    </section>
  );
}
