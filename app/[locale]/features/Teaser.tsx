"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import geLogoBlack from "../../../public/images/logo/ge-logo-black.png";
import LangSwitcher from "./LangSwitcher";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Teaser() {
  const { t } = useTranslation();
  const [contentOpacity, setContentOpacity] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // スクロール監視（Conceptエリアとの切り替え用）
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end start"],
  });

  // スクロールに応じてフェードアウト（初期ロード時のフェードインと組み合わせ）
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const duration = 4000; // 4秒かけてアニメーション（FixedBackgroundと同じ）
    const delay = 0.3; // 0.3秒遅延（もやが晴れるタイミングより少し遅く）
    const startTime = Date.now();

    // ease-out cubic関数（FixedBackgroundと同じ）
    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // 遅延を考慮した進行度の計算
      if (elapsed < delay) {
        // 遅延中はopacityを0に保つ
        setContentOpacity(0);
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // 遅延後の経過時間で進行度を計算
      const delayedElapsed = elapsed - delay;
      const progress = Math.min(delayedElapsed / (duration / 1000), 1);

      const eased = easeOutCubic(progress);

      // 0から1へ徐々に増やす（ブラーが晴れるタイミングより少し遅く）
      const newOpacity = eased;

      // 小数点以下の精度を調整
      const roundedOpacity = Math.round(newOpacity * 1000) / 1000;

      setContentOpacity(roundedOpacity);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        // アニメーション完了
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
    <>
      {/* スクロール監視用のスペーサー（非表示） */}
      <div ref={scrollContainerRef} className="h-[100dvh]" />
      <motion.div
        className="fixed inset-0 w-full z-10 h-dvh flex flex-col justify-between p-6 md:p-8 lg:p-10 text-foreground font-sans pointer-events-none"
        style={{
          opacity: scrollOpacity,
        }}
      >
        {/* Top Section - フェードイン */}
        <div
          className="flex justify-between items-start"
          style={{
            opacity: contentOpacity,
            transition: "opacity 0.1s ease-out",
          }}
        >
          {/* Logo Area */}
          <div className="relative">
            <h1>
              {/* Black Logo */}
              <div className="block relative w-44 md:w-82 h-auto aspect-square ">
                <Image
                  src="/images/logo/ge-logo-white.png"
                  alt={t("teaser.logo")}
                  fill
                  sizes="192px"
                  className="object-contain object-top-left"
                  priority
                />
              </div>
            </h1>
          </div>

          {/* Lang Switcher */}
          <div className="p-2 pointer-events-auto">
            <LangSwitcher />
          </div>
        </div>

        {/* Center/Main Title Area - フェードイン */}
        {/* <div */}
        {/*   className="flex flex-col justify-center grow mt-6 mb-6 md:max-w-[70%] lg:max-w-[50%]" */}
        {/*   style={{ */}
        {/*     opacity: contentOpacity, */}
        {/*     transition: "opacity 0.1s ease-out", */}
        {/*   }} */}
        {/* > */}
        {/*   <p className="text-xs md:text-sm font-medium mb-3 tracking-wide whitespace-pre-line"> */}
        {/*     {t("teaser.department")} */}
        {/*   </p> */}
        {/*   <h2 className="text-2xl md:text-4xl font-light mb-6 tracking-wider"> */}
        {/*     {t("teaser.exhibitionTitle")} */}
        {/*   </h2> */}
        {/* </div> */}

        {/* Bottom Details Area - フェードイン */}
        <div
          className="space-y-6"
          style={{
            opacity: contentOpacity,
            transition: "opacity 0.1s ease-out",
          }}
        >
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <div className="flex items-start gap-2 md:gap-3 mb-2">
                {/* Start Date */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-light tracking-tighter leading-none mb-2 md:mb-3 -mr-0.5 md:-mr-1">
                      {t("teaser.dates.start").split("/")[0]}
                    </span>
                    <span className="block w-px h-10 md:h-12 bg-current transform rotate-30 mx-2 md:mx-3" />
                    <span className="text-3xl md:text-4xl font-light tracking-tighter leading-none mt-2 md:mt-3 -ml-0.5 md:-ml-1">
                      {t("teaser.dates.start").split("/")[1]}
                    </span>
                  </div>
                  <div className="flex justify-between w-full mt-1 px-0.5">
                    {t("teaser.dates.startDay")
                      .split("")
                      .map((char, i) => (
                        <span
                          key={i}
                          className="text-xl md:text-2xl font-normal leading-none scale-y-80 origin-top"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="h-10 md:h-12 flex items-end">
                  <span className="block w-2 mb-2 md:mb-2.5 md:w-2.5 h-px bg-current" />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-light tracking-tighter leading-none mb-2 md:mb-3 -mr-0.5 md:-mr-1">
                      {t("teaser.dates.end").split("/")[0]}
                    </span>
                    <span className="block w-px h-10 md:h-12 bg-current transform rotate-30 mx-2 md:mx-3" />
                    <span className="text-3xl md:text-4xl font-light tracking-tighter leading-none mt-2 md:mt-3 -ml-0.5 md:-ml-1">
                      {t("teaser.dates.end").split("/")[1]}
                    </span>
                  </div>
                  <div className="flex justify-between w-full mt-1 px-0.5">
                    {t("teaser.dates.endDay")
                      .split("")
                      .map((char, i) => (
                        <span
                          key={i}
                          className="text-xl md:text-2xl font-normal leading-none scale-y-80 origin-top"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              {/* <p className="text-sm font-medium">{t("teaser.department")}</p> */}
            </div>

            {/* Center/Main Title Area - フェードイン */}
            <div
              className="flex flex-col justify-center grow md:max-w-[70%] lg:max-w-[50%]"
              style={{
                opacity: contentOpacity,
                transition: "opacity 0.1s ease-out",
              }}
            >
              <h2 className="text-2xl md:text-4xl font-light mb-3 tracking-wider">
                {t("teaser.exhibitionTitle")}
              </h2>
              <p className="text-xs md:text-sm font-medium mb-3 tracking-wide whitespace-pre-line">
                {t("teaser.department")}
              </p>
            </div>
            {/* <div className="flex flex-col gap-1 text-sm"> */}
            {/*   <p>{t("teaser.hours")}</p> */}
            {/*   <p>{t("teaser.lastDayHours")}</p> */}
            {/*   <p>{t("teaser.closed")}</p> */}
            {/*   <p className="text-lg font-medium mt-2">{t("teaser.location")}</p> */}
            {/* </div> */}
          </div>
        </div >
      </motion.div >
    </>
  );
}
