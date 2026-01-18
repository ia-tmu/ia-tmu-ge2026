"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";
import { motion } from "framer-motion";
import moyaWhite from "../../../public/images/concept/moya_white.png";

export default function Concept() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFullyVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] z-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-3 md:px-12 lg:px-16 z-30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            isFullyVisible ? { opacity: 1 } : { opacity: 0 }
          }
          transition={{
            duration: 3.0,
            ease: "easeOut",
          }}
          className="flex flex-col text-center items-center"
        >
          <h2 className="w-fit">
            <Image
              src={moyaWhite}
              alt={t("moya")}
              className="block relative w-32 md:w-44 h-auto object-contain"
            />
          </h2>
          <p className="text-sm  md:text-base font-light leading-10 whitespace-pre-line text-foreground">
            <Trans
              i18nKey="concept.description"
              components={{
                br: <br className="md:hidden" />,
                br2: <br className="hidden md:block" />,
              }}
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
