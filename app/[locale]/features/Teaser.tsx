"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";

export default function Teaser() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-foreground font-sans animate-fade-in">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* PC: Cover + Right Position */}
        <div className="hidden md:block w-full h-full relative">
          <Image
            src="/images/top/fv/fv-bg.png"
            alt="Background"
            fill
            className="object-cover object-right"
            priority
          />
        </div>
        {/* SP: Contain + Center */}
        <div className="block md:hidden w-full h-full relative">
          <Image
            src="/images/top/fv/fv-bg-sp.png"
            alt="Background"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16 box-border">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Logo Area */}
          <div className="flex flex-col">
            <h1
              className="text-4xl md:text-6xl font-serif tracking-widest leading-none"
              style={{ writingMode: "vertical-rl" }}
            >
              {t("teaser.logo")}
            </h1>
          </div>

          {/* Lang Switcher */}
          <div className="bg-white/80 p-2 rounded-md backdrop-blur-sm shadow-sm">
            <LangSwitcher />
          </div>
        </div>

        {/* Center/Main Title Area */}
        <div className="flex flex-col justify-center flex-grow mt-8 mb-8 md:max-w-[70%] lg:max-w-[50%]">
          <p className="text-xs md:text-sm font-medium mb-3 tracking-wide whitespace-pre-line">
            {t("teaser.department")}
          </p>
          <h2 className="text-2xl md:text-4xl font-light mb-6 tracking-wider">
            {t("teaser.exhibitionTitle")}
          </h2>
          <p className="text-xs md:text-sm opacity-70 font-light leading-relaxed whitespace-pre-line tracking-wide">
            {t("teaser.englishTitle")}
          </p>
        </div>

        {/* Bottom Details Area */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-t border-foreground/10 pt-6">
            <div>
              <div className="flex items-start gap-3 md:gap-5 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                    3/1
                  </span>
                  <span className="text-lg md:text-2xl font-normal mt-1">
                    Sat
                  </span>
                </div>
                <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                  -
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                    3/7
                  </span>
                  <span className="text-lg md:text-2xl font-normal mt-1">
                    Sun
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium">{t("teaser.admission")}</p>
            </div>

            <div className="flex flex-col gap-1 text-sm md:text-right">
              <p>{t("teaser.hours")}</p>
              <p>{t("teaser.lastDayHours")}</p>
              <p>{t("teaser.closed")}</p>
              <p className="text-lg font-medium mt-2">{t("teaser.location")}</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-6 text-xs md:text-sm font-medium opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">
              Instagram
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              X (Twitter)
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              Department Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
