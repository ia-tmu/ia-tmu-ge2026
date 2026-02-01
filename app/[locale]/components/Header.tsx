"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import geLogoWhite from "../../../public/images/logo/ge-logo-white.png";
import LangSwitcher from "../features/LangSwitcher";
import { useFVScrollRef } from "../contexts/FVScrollRefContext";

const SECTION_IDS = [
    { id: "concept", key: "header.nav.concept" },
    { id: "info", key: "header.nav.info" },
    { id: "web-exhibition", key: "header.nav.webExhibition" },
    { id: "events", key: "header.nav.events" },
    { id: "sns", key: "header.nav.sns" },
] as const;

const CENTER_NAV_IDS = [
    { id: "concept", key: "header.nav.concept" },
    { id: "info", key: "header.nav.info" },
    { id: "web-exhibition", key: "header.nav.webExhibition" },
    { id: "events", key: "header.nav.events" },
] as const;

function NavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="text-foreground hover:opacity-80 transition-opacity duration-300 underline underline-offset-4 hover:no-underline"
        >
            {children}
        </a>
    );
}

export default function Header() {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const fvScrollRef = useFVScrollRef();

    // FV→Concept のスクロールに合わせてロゴを透明→表示（Teaserのフェードアウトと同期）
    const { scrollYProgress } = useScroll({
        target: fvScrollRef ?? undefined,
        offset: ["start start", "end start"],
    });
    const logoOpacity = useTransform(scrollYProgress, [0, 0.08, 0.2], [0, 0, 1]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <>
            <div
                className={`fixed inset-0 z-30 backdrop-blur-md transition-opacity duration-300 pointer-events-none ${menuOpen ? "opacity-100" : "opacity-0"}`}
                aria-hidden={!menuOpen}
            />

            <header
                className={`w-full h-20 md:h-24 px-4 md:px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
            >
                {/* 左: ロゴ（FV→Concept スクロールでフェードイン） */}
                <motion.a
                    href="#"
                    className="shrink-0 w-10 h-10 md:w-14 md:h-14 relative overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue-primary block"
                    aria-label={t("teaser.logo")}
                    style={{ opacity: logoOpacity }}
                >
                    <Image
                        src={geLogoWhite}
                        alt={t("teaser.logo")}
                        fill
                        className="object-contain"
                        sizes="56px"
                        priority
                    />
                </motion.a>

                {/* 中央: セクションリンク（md以上のみ表示） */}
                <nav
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8"
                    aria-label="Main navigation"
                >
                    {CENTER_NAV_IDS.map(({ id, key }) => (
                        <NavLink key={id} href={`#${id}`}>
                            {t(key)}
                        </NavLink>
                    ))}
                </nav>

                {/* 右: ハンバーガーボタン */}
                <div className="shrink-0 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="p-2 w-10 h-10 md:w-12 md:h-12 flex flex-col justify-center items-center gap-1.5 text-foreground hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue-primary rounded"
                        aria-expanded={menuOpen}
                        aria-controls="header-menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>
            </header>

            <div
                id="header-menu"
                className={`fixed left-0 right-0 top-20 bottom-0 md:top-[120px] z-40 flex flex-col items-center justify-center transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden={!menuOpen}
            >
                <nav
                    className="flex flex-col items-center gap-6 p-6 md:flex-row md:flex-wrap md:justify-center md:gap-8 md:p-8"
                    aria-label="Menu navigation"
                >
                    {SECTION_IDS.map(({ id, key }) => (
                        <NavLink key={id} href={`#${id}`} onClick={closeMenu}>
                            {t(key)}
                        </NavLink>
                    ))}
                    <div className="pt-4 w-full md:w-max md:pt-0 md:pl-4 border-t border-foreground/20 md:border-t-0 md:border-l md:border-foreground/20 flex justify-center">
                        <LangSwitcher />
                    </div>
                </nav>
            </div>
        </>
    );
}
