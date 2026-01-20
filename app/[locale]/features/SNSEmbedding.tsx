"use client";

import Image from "next/image";
import Section from "../components/Section";
import { useTranslation } from "react-i18next";
import { InstagramEmbed } from "../components/InstagramEmbed";
import Link from "next/link";
import xLogo from "../../../public/images/logo/x-logo-white.svg";
import instagramLogo from "../../../public/images/logo/Instagram-logo-white.svg";
import Guruguru from "./GuruguruVideo";
import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guruguru01Webm = `${basePath}/images/top/guruguru_01.webm`;
const guruguru02Webm = `${basePath}/images/top/guruguru_02.webm`;
const guruguru03Webm = `${basePath}/images/top/guruguru_03.webm`;
const guruguru04Webm = `${basePath}/images/top/guruguru_04.webm`;
const guruguru05Webm = `${basePath}/images/top/guruguru_05.webm`;


export default function SNSEmbedding() {
  const [currentGuruguru, setCurrentGuruguru] = useState(0);
  const guruguruWebm = [guruguru01Webm, guruguru02Webm, guruguru03Webm, guruguru04Webm, guruguru05Webm];


  const { t } = useTranslation();
  return (
    <Section title={"SNS"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full max-w-5xl mx-auto mb-8">
        {/* Instagram埋め込みエリア PC */}
        <div className="justify-center hidden md:flex md:justify-end w-full">
          <InstagramEmbed url="https://www.instagram.com/p/DSe5lniElEw/?utm_source=ig_embed&amp;utm_campaign=loading" />
        </div>
        {/* テキストエリア */}
        <div className="space-y-6 py-8">
          <div className="space-y-2">
            <div className="relative">
              <h3 className="text-xl text-center md:text-2xl font-bold z-10">
                {t("sns.sectionTitle")}
              </h3>
              <button className="cursor-pointer w-36 md:w-60 aspect-square absolute top-1/2 left-1/2 md:-translate-x-1/4 lg:translate-x-0 -translate-y-5/8" onClick={() => {
                setCurrentGuruguru((currentGuruguru + 1) % guruguruWebm.length);
              }}>
              <Guruguru
                    src={guruguruWebm[currentGuruguru]}
                    className=""
                    startDelayMs={1000}
              />
              </button>
            </div>
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

        {/* Instagram埋め込みエリア SP */}
        <div className="justify-center flex md:hidden w-full">
          <InstagramEmbed url="https://www.instagram.com/p/DSe5lniElEw/?utm_source=ig_embed&amp;utm_campaign=loading" />
        </div>
      </div>
    </Section>
  );
}
