"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { shuffle } from "@/lib/shuffle";
import Link from "next/link";
import Section from "../components/Section";
import { ScrollingThumbnailsRow, type WorkThumbnailItem } from "../components/ScrollingThumbnailsRow";
import { Trans, useTranslation } from "react-i18next";
import { localePath } from "../lib/localePath";

type Props = {
  works: WorkThumbnailItem[];
};

type RowsState = {
  row1: WorkThumbnailItem[];
  row2: WorkThumbnailItem[];
  row3: WorkThumbnailItem[];
};

const emptyRows: RowsState = { row1: [], row2: [], row3: [] };

export default function WebExhibition({ works }: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ja";
  const [rows, setRows] = useState<RowsState>(emptyRows);

  useEffect(() => {
    queueMicrotask(() => {
      if (works.length === 0) {
        setRows(emptyRows);
        return;
      }
      setRows({
        row1: shuffle(works),
        row2: shuffle(works),
        row3: shuffle(works),
      });
    });
  }, [works]);

  const hasRows = rows.row1.length > 0;

  return (
    <Section id="web-exhibition" title={"Web Exhibition"}>

      <div>
        <div className="text-center text-xs md:text-sm leading-6 md:leading-8 font-semibold">
          <Trans
            i18nKey="webExhibition.description"
            components={{
              br: <br className="md:hidden" />,
              br2: <br />,
            }}
          />
        </div>


        <div className="flex justify-center mt-6">
          <Link
            href={localePath(locale, "/works")}
            className="text-sm md:text-base font-semibold border border-foreground hover:border-dark-blue-primary px-4 py-2 rounded hover:bg-dark-blue-primary hover:text-foreground transition-colors flex items-center justify-center gap-1 duration-300"
          >
            {t("webExhibition.list")}
          </Link>
        </div>

        <div className="grid h-full gap-4 py-8 items-center justify-center md:w-[calc(100vw+40px)]  w-[calc(100vw+24px)] max-w-none -ml-6 md:-ml-8 lg:-ml-10">
          {hasRows ? (
            <>
              <ScrollingThumbnailsRow items={rows.row1} direction="left" />
              <ScrollingThumbnailsRow items={rows.row2} direction="right" />
              <ScrollingThumbnailsRow items={rows.row3} direction="left" />
            </>
          ) : null}


        </div>

      </div>


    </Section>
  );
}
