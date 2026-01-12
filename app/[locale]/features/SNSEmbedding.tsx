"use client";

import Image from "next/image";
import Section from "../components/Section";
import { useTranslation } from "react-i18next";
import { InstagramEmbed } from "../components/InstagramEmbed";
import Link from "next/link";
import xLogo from "../../../public/images/logo/x-logo-white.svg";
import instagramLogo from "../../../public/images/logo/Instagram-logo-white.svg";

export default function SNSEmbedding() {
  const { t } = useTranslation();
  return (
    <Section title={"SNS"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full max-w-5xl mx-auto mb-8">
        {/* テキストエリア */}
        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <h3 className="text-xl text-center md:text-2xl font-bold">
              {t("sns.sectionTitle")}
            </h3>
            <p className="leading-relaxed text-sm md:text-base text-center">
              {t("sns.description")}
            </p>
          </div>

          <div className="flex gap-8 justify-center items-center">
            <Link
              href="https://x.com/tmu_ia_sotsuten"
              target="_blank"
              className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image
                src={xLogo}
                alt="X (Twitter)"
                fill
                className="object-contain"
              />
            </Link>
            <Link
              href="https://www.instagram.com/tmu_ia_sotsuten/"
              target="_blank"
              className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image
                src={instagramLogo}
                alt="Instagram"
                fill
                className="object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Instagram埋め込みエリア */}
        <div className="flex justify-center md:justify-end w-full">
          <InstagramEmbed url="https://www.instagram.com/p/DSe5lniElEw/?utm_source=ig_embed&amp;utm_campaign=loading" />
        </div>
      </div>
    </Section>
  );
}
