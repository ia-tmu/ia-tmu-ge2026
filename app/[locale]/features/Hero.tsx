"use client";

import Heading from "../components/Heading";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="w-full h-[50dvh] bg-muted text-primary p-8">
      <Heading title={t("hero.title")} />
      <p>{t("hero.subtitle")}</p>
    </section>
  );
}
