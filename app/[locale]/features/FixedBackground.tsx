"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import fvBg from "../../../public/images/top/fv/fv-bg.png";
import fvBgSp from "../../../public/images/top/fv/fv-bg-sp.png";
import { TracingPaper } from "../components/TracingPaper";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
  const scrollBlur = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
    <>
      {/* Conceptのスクロール監視用の参照要素（非表示） */}
      <div
        ref={conceptScrollRef}
        className="h-[120dvh] absolute top-[80dvh] w-full pointer-events-none"
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* PC: Cover + Right Position */}
          <div className="hidden md:block w-full h-screen relative">
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
          <div className="block md:hidden w-full h-screen relative">
            <Image
              src={fvBgSp}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              style={{ willChange: "transform" }}
              priority
            />
          </div>
        </div>

        <TracingPaper
          opacity={currentOpacity}
          blurAmount={currentBlur}
          textureType="rough"
          baseFrequency="0.006 0.006"
          numOctaves={20}
          className="w-full h-full pointer-events-none"
        />
      </div>
    </>
  );
}
