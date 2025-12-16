"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "../components/Button";

export default function Concept() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // テキストのフェードイン（ブラーが十分に強くなった時）
  // スクロール進捗に応じて段階的に表示
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.1], [20, 0]);

  // Conceptエリア全体のフェードイン（Teaserのフェードアウトと同期）
  // スクロール最下部で完全に表示されるように範囲を拡張
  const conceptAreaOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full h-[120dvh] z-20">
      {/* コンセプトテキスト（スクロールに応じてフェードイン） */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-3 md:px-12 lg:px-16 z-30">
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
          }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wider text-foreground">
            {t("concept.title")}
          </h2>
          <p className="text-base md:text-lg font-light leading-12 whitespace-pre-line text-foreground">
            {t("concept.description")}
          </p>
        </motion.div>
      </div>

      {/* SNSリンク */}
      <div className="fixed bottom-8 w-full pointer-events-none z-30">
        <div className="w-full max-w-4xl px-2 md:px-12 lg:px-16 mx-auto pointer-events-auto">
          <motion.div
            style={{
              opacity: conceptAreaOpacity,
            }}
            className="flex flex-col gap-8 items-center text-xs md:text-sm font-medium"
          >
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Button
                href="https://www.instagram.com/tmu_ia_sotsuten/"
                target="_blank"
              >
                Instagram
              </Button>
              <Button href="https://x.com/tmu_ia_sotsuten" target="_blank">
                X (Twitter)
              </Button>
              <Button
                href="https://industrial-art.sd.tmu.ac.jp/"
                target="_blank"
              >
                Department Website
              </Button>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <div>
                © 2024 Department of Industrial Art, Tokyo Metropolitan
                University
              </div>

              <Button
                href="https://industrial-art.sd.tmu.ac.jp/privacy-policy.html"
                target="_blank"
              >
                Privacy policy
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
