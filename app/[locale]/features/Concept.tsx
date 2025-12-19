"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import moyaWhite from "../../../public/images/concept/moya_white.png";

export default function Concept() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start start", "end start"],
  // });

  // テキストのフェードイン（ブラーが十分に強くなった時）
  // スクロール進捗に応じて段階的に表示
  // const textOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  // const textY = useTransform(scrollYProgress, [0, 0.1], [20, 0]);

  // Conceptエリア全体のフェードイン（Teaserのフェードアウトと同期）
  // スクロール最下部で完全に表示されるように範囲を拡張
  // const conceptAreaOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  //
  //
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFullyVisible(entry.isIntersecting);
      },
      {
        threshold: 0.75,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] z-20">
      {/* コンセプトテキスト（スクロールに応じてフェードイン） */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-3 md:px-12 lg:px-16 z-30">
        {/* <motion.div */}
        {/*   style={{ opacity: textOpacity, y: textY }} */}
        {/*   className="text-center" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isFullyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 3.0,
            ease: "easeOut",
          }}
          className="flex flex-col text-center items-center"
        >
          {/* <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wider text-foreground"> */}
          {/*   {t("concept.title")} */}
          {/* </h2> */}
          <h2 className="w-fit">
            <Image
              src={moyaWhite}
              alt={t("moya")}
              className="block relative w-32 md:w-44 h-auto object-contain"
            />
          </h2>
          <p className="text-sm  md:text-base font-light leading-10 whitespace-pre-line text-foreground">
            {t("concept.description")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
