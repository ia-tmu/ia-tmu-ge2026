"use client";

import Section from "../components/Section";
import Guruguru from "./GuruguruVideo";
import { Trans } from "react-i18next";
import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guruguru01Webm = `${basePath}/images/top/guruguru_01.webm`;
const guruguru02Webm = `${basePath}/images/top/guruguru_02.webm`;
const guruguru03Webm = `${basePath}/images/top/guruguru_03.webm`;
const guruguru04Webm = `${basePath}/images/top/guruguru_04.webm`;
const guruguru05Webm = `${basePath}/images/top/guruguru_05.webm`;
const guruguruWebm = [guruguru01Webm, guruguru02Webm, guruguru03Webm, guruguru04Webm, guruguru05Webm];

export default function WebExhibition() {
  const [currentGuruguru, setCurrentGuruguru] = useState(0);
  return (
    <Section title={"Web Exhibition"}>
      <div className="grid h-full gap-20 py-50 items-center justify-center">

        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-semibold text-center">Coming Soon</h1>
          <button className="w-40 md:w-72 aspect-square cursor-pointer absolute top-1/2 left-1/2 md:translate-x-1/4 -translate-y-5/8" onClick={() => {
            setCurrentGuruguru((currentGuruguru + 1) % guruguruWebm.length);
          }}>
            <Guruguru
                src={guruguruWebm[currentGuruguru]}
                startDelayMs={1000}
            />
          </button>
          
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
