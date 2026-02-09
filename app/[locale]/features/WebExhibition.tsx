"use client";

import Section from "../components/Section";
import Guruguru from "./GuruguruVideo";
import { Trans } from "react-i18next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guruguru03Webm = `${basePath}/images/top/guruguru_03.webm`;
const guruguru03Static = `${basePath}/images/top/guruguru_03.png`;

export default function WebExhibition() {
  return (
    <Section title={"Web Exhibition"}>
      <div className="grid h-full gap-20 py-50 items-center justify-center">

        <div className="relative">
          <h3 className="text-4xl md:text-6xl font-semibold text-center">Coming Soon</h3>
          <Guruguru
            className="w-40 md:w-72 aspect-square absolute top-1/2 right-3/4 md:-left-5/12 -translate-y-6/8"
            src={guruguru03Webm}
            staticSrc={guruguru03Static}
            staticImageClassName="justify-center"
            startDelayMs={1000}
          />
        </div>

        <div className="text-center text-xs md:text-sm leading-6 md:leading-8 font-semibold">
          <Trans
            i18nKey="webExhibition.description"
            components={{
              br: <br className="md:hidden" />,
              br2: <br />,
            }}
          />
        </div>
      </div>
    </Section>
  );
}
