"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import { TracingPaper } from "../components/TracingPaper";
import Button from "../components/Button";

export default function Teaser() {
  const { t } = useTranslation();
  // const initialOpacity = 0; // TracingPaperのopacityは0-1の範囲
  const initialBlur = 20;

  // アニメーションの状態管理（BlurEffect.tsxを参考にStateベースに戻す）
  // const [fogOpacity, setFogOpacity] = useState(initialOpacity);
  const [fogBlur, setFogBlur] = useState(initialBlur);
  const [isVisible, setIsVisible] = useState(true);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // マウント確認
    if (!isVisible) return;

    const duration = 4000; // 4秒かけてアニメーション
    const startTime = Date.now();

    // ease-out cubic関数
    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / (duration / 1000), 1);

      const eased = easeOutCubic(progress);

      // 初期値から0へ徐々に減らす
      // const newOpacity = initialOpacity * (1 - eased);
      const newBlur = initialBlur * (1 - eased);

      // 小数点以下の精度を調整（不要な再レンダリングを減らすため）
      // const roundedOpacity = Math.round(newOpacity * 1000) / 1000;
      const roundedBlur = Math.round(newBlur * 100) / 100;

      // setFogOpacity(roundedOpacity);
      setFogBlur(roundedBlur);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        // アニメーション完了
        setIsVisible(false);
        rafIdRef.current = null;
      }
    };

    // アニメーション開始
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []); // 初回マウント時のみ実行

  return (
    <div className="relative w-full z-0 h-dvh overflow-hidden bg-gray-400/50 md:bg-background text-white md:text-foreground font-sans">
      {/* Background Layer (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* PC: Cover + Right Position */}
        <div className="hidden md:block w-full h-full relative">
          <Image
            src="/images/top/fv/fv-bg.png"
            alt=""
            fill
            sizes="100vw"
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
            sizes="100vw"
            className="object-contain object-center"
            priority
          />
        </div>
      </div>

      {/* Fog Layer - TracingPaper (z-30: 最前面) */}
      {/* Stateベースでアニメーション制御 */}
      {isVisible && (
        <TracingPaper
          opacity={0}
          blurAmount={fogBlur}
          textureType="rough"
          baseFrequency="0.006 0.006"
          numOctaves={20}
          className="w-full h-full pointer-events-none"
        />
      )}

      {/* Content Layer (z-20) */}
      <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16 animate-fade-in">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Logo Area */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-serif tracking-widest leading-none [writing-mode:vertical-rl]">
              {t("teaser.logo")}
            </h1>
          </div>

          {/* Lang Switcher */}
          <div className="bg-white/80 p-2 rounded-md backdrop-blur-sm shadow-sm text-foreground">
            <LangSwitcher />
          </div>
        </div>

        {/* Center/Main Title Area */}
        <div className="flex flex-col justify-center grow mt-8 mb-8 md:max-w-[70%] lg:max-w-[50%]">
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
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pt-6">
            <div>
              <div className="flex items-start gap-3 md:gap-5 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                    {t("teaser.dates.start")}
                  </span>
                  <span className="text-3xl md:text-4xl font-normal mt-1 inline-block scale-y-80 origin-top tracking-widest">
                    {t("teaser.dates.startDay")}
                  </span>
                </div>
                <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                  -
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                    {t("teaser.dates.end")}
                  </span>
                  <span className="text-3xl md:text-4xl font-normal mt-1 inline-block scale-y-80 origin-top tracking-widest">
                    {t("teaser.dates.endDay")}
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
            <Button
              href="https://www.instagram.com/tmu_ia_sotsuten/"
              target="_blank"
            >
              Instagram
            </Button>
            <Button href="https://x.com/tmu_ia_sotsuten" target="_blank">
              X (Twitter)
            </Button>
            <Button href="https://industrial-art.sd.tmu.ac.jp/" target="_blank">
              Department Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
