"use client";

import Section from "../components/Section";
import Guruguru from "./GuruguruVideo";
import { Trans } from "react-i18next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guruguru01Webm = `${basePath}/images/top/guruguru_01.webm`;

export default function WebExhibition() {
  return (
    <Section title={"Web Exhibition"}>
      <div className="grid h-full gap-20 py-50 items-center justify-center">

        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-semibold text-center">Coming Soon</h1>
          <Guruguru
                src={guruguru01Webm}
                className="w-40 md:w-72 aspect-square absolute top-1/2 left-1/2 md:translate-x-1/4 -translate-y-5/8"
                startDelayMs={1000}
          />
        </div>

        <div className="text-center text-xs md:text-sm leading-6 md:leading-8">
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
