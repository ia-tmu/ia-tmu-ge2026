"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import fvBg from "../../../public/images/top/fv/fv-bg.png";
import fvBgSp from "../../../public/images/top/fv/fv-bg-sp.png";
import Guruguru from "./GuruguruVideo";
import { TracingPaper } from "../components/TracingPaper";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guruguru01Webm = `${basePath}/images/top/guruguru_01.webm`;
const guruguru02Webm = `${basePath}/images/top/guruguru_02.webm`;

export default function FixedBackground() {
  const initialBlur = 20;
  const conceptScrollRef = useRef<HTMLDivElement>(null);

  // アニメーションの状態管理
  const [fogBlur, setFogBlur] = useState(initialBlur);
  const [isVisible, setIsVisible] = useState(true);
  const rafIdRef = useRef<number | null>(null);

  // Conceptエリアのスクロール監視
  const { scrollYProgress } = useScroll({
    target: conceptScrollRef,
    offset: ["start start", "end start"],
  });

  // スクロールに応じてブラーと透明度を調整
  const scrollBlur = useTransform(scrollYProgress, [0, 0.2, 1], [0, 30, 30]);
  const scrollOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    [0, 0.15, 0.15]
  );

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
      const newBlur = initialBlur * (1 - eased);

      // 小数点以下の精度を調整（不要な再レンダリングを減らすため）
      const roundedBlur = Math.round(newBlur * 100) / 100;

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
  }, [isVisible]); // 初回マウント時のみ実行

  // スクロール時のブラーと透明度の状態
  const [scrollBlurValue, setScrollBlurValue] = useState(0);
  const [scrollOpacityValue, setScrollOpacityValue] = useState(0);

  useMotionValueEvent(scrollBlur, "change", (latest) => {
    setScrollBlurValue(latest);
  });

  useMotionValueEvent(scrollOpacity, "change", (latest) => {
    setScrollOpacityValue(latest);
  });

  // 初期ロード時のブラーとスクロール時のブラーを合成
  const currentBlur = isVisible ? fogBlur : scrollBlurValue;
  const currentOpacity = isVisible ? 0 : scrollOpacityValue;

  return (
    <div className="">
      {/* Conceptのスクロール監視用の参照要素（非表示） */}
      <div
        ref={conceptScrollRef}
        className="h-[120dvh] absolute top-[80dvh] w-full pointer-events-none"
      />
      <div className="bg-black/30 fixed inset-0 z-0 isolate pointer-events-none">
        <div className="absolute inset-0 z-0 -top-[5%] md:top-0">
          {/* PC: Cover + Right Position */}
          <div className="hidden opacity-85 md:block w-full h-screen relative">
            <Image
              src={fvBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-right"
              priority
            />
          </div>
          {/* SP: Cover + Center */}
          <div className="opacity-90 block md:hidden w-full h-screen relative">
            <Image
              src={fvBgSp}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center scale-175"
              style={{ willChange: "transform" }}
              priority
            />
          </div>
          {/* 賑やかし */}
          <div className="absolute w-full md:w-3/5 h-[40dvh] md:h-[90dvh] top-1/2 -translate-y-1/2 right-10">
            <Guruguru
              src={guruguru01Webm}
              className="object-top-left w-60 md:w-96 aspect-square absolute top-0 left-10 md:left-0"
              startDelayMs={1000}
            />
            <Guruguru
              src={guruguru02Webm}
              className="object-bottom-right w-60 md:w-96 aspect-square absolute bottom-0 -right-20 md:right-0"
              startDelayMs={3000}
            />
          </div>
        </div>
        <TracingPaper
          opacity={currentOpacity}
          blurAmount={currentBlur}
          textureType="rough"
          baseFrequency="0.003 0.003"
          numOctaves={20}
          className="w-full h-full pointer-events-none"
        />
      </div>
    </div>
  );
}
