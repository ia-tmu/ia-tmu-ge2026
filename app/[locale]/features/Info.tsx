"use client"

import Section from "../components/Section"
import Heading from "../components/Heading"
import { useTranslation } from "react-i18next";

export default function Info() {
  const { t } = useTranslation();

  const rowStyle = "flex flex-col gap-3 text-md";
  const access = t("teaser.access", { returnObjects: true }) as string[];

  return (
    <Section title={"Information"}>
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-9">
        <div className="flex flex-col items-start w-full mt-6 gap-9">
          <div className={rowStyle}>
            <Heading size="sm" title={t("teaser.periodTitle")} />
            <p>{t("teaser.period")}</p>
          </div>
          <div className={rowStyle}>
            <Heading size="sm" title={t("teaser.datesTitle")} />
            <div className="flex flex-col gap-3">
              <p>{t("teaser.hours")}</p>
              <p>{t("teaser.lastDayHours")}</p>
              <p>{t("teaser.closed")}</p>
            </div>
          </div>
          <div className={rowStyle}>
            <Heading size="sm" title={t("teaser.locationTitle")} />
            <div className="flex flex-col gap-3">
              <p>{t("teaser.location")}</p>
              <ul className="flex flex-col gap-1 list-disc pl-5">
                {access.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6478.732430516302!2d139.772939!3d35.717211!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c281e3bfa6f%3A0x8418dfeeb8bcab50!2z5p2x5Lqs6YO9576O6KGT6aSo!5e0!3m2!1sja!2sjp!4v1766077753050!5m2!1sja!2sjp"
          className="w-full aspect-square h-auto grayscale rounded-lg overflow-hidden"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Section>
  )
}
