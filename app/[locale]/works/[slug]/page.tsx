import { fetchRowBySlug, fetchAllIds, fetchSheetValues } from "@/lib/get-works";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import MoyaBG from "../../features/MoyaBG";
import { SimilarWorksList } from "../../features/works/SimilarWorksList";
import ImageSlider from "../../features/works/ImageSlider";
import { MovieOrder } from "../../types/work";
import type { Work } from "../../types/work";
import { getSimilarWorks } from "@/lib/similarity";

export const dynamicParams = false;

import MapSvg from "../../features/works/Map"
import { div } from "framer-motion/client";

// ID列だけを読み込んでURLリストを作る
export async function generateStaticParams() {
  const ids = await fetchAllIds();
  return ids.map((id) => ({ slug: id }));
}

export default async function Work({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const work = await fetchRowBySlug(slug);

  if (!work) {
    notFound();
  }

  const result = getSimilarWorks(slug, 10);

  if (!result) return <div>作品が見つかりません</div>;

  const sheetData = await fetchSheetValues();
  const similarItems = result.similarWorks
    .map((sw) => {
      const fullWork = sheetData.works.find((w) => w.id === sw.work.id);
      return fullWork
        ? { work: fullWork as Work, rank: sw.rank, similarity: sw.similarity }
        : null;
    })
    .filter((x): x is { work: Work; rank: number; similarity: number } => x != null);

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px] text-foreground">
      <MoyaBG />
      <div className="max-w-[355px] md:max-w-[960px] mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-start gap-3.75 md:gap-7.5">
          {/* 左側：テキスト・キーワード・リンク */}
          <div className="flex-1 self-stretch flex flex-col gap-3.75 md:gap-7.5 min-h-full">
            <h1 className="text-xs md:text-sm font-medium">{work.degree}</h1>
            <h2 className="text-sm md:text-xl font-bold leading-[1.5]">
              {work.workTitle}
            </h2>
            <h3 className="text-xs md:text-sm font-medium">
              {work.studioName}
            </h3>
            <div className="flex flex-col text-sm gap-2.5">
              {work.keywords.map((kw, i) => (
                <span key={i}>#{kw}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 text-sm mt-auto">
              {[
                { url: work.link1, title: work.link1Title },
                { url: work.link2, title: work.link2Title },
                { url: work.link3, title: work.link3Title },
              ]
                .filter((item) => item.url?.trim())
                .map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap hover:text-white/60 transition-colors cursor-pointer duration-300 underline underline-offset-2 decoration-current hover:decoration-transparent transition-all duration-300"
                  >
                    {item.title || item.url}
                  </a>
                ))}
            </div>
          </div>
          {/* 右側：画像 */}
          <ImageSlider
            thumbnail={work.thumbnail}
            images={work.images}
            movie={work.movie}
            movieOrder={work.order as MovieOrder}
            name={work.workTitle}
          />
        </div>
        <div className="flex flex-col mt-7.5 gap-7.5 md:mt-12.5 md:gap-12.5">
          {/* 説明文（データがあれば表示） */}
          {work.workDescriptionJP && (
            <div className="whitespace-pre-wrap text-sm md:text-base leading-[1.7]">
              {work.workDescriptionJP}
            </div>
          )}
          {work.workDescriptionEN && (
            <div className="whitespace-pre-wrap text-sm md:text-base leading-[1.7]">
              {work.workDescriptionEN}
            </div>
          )}
          <hr className="border-t border-white-300" />
          {!slug.includes("W") &&
            <div
              className={`w-full flex flex-col gap-6 items-end overflow-x-hidden ${slug.includes("A") ? "items-start" : "items-end"}`}
            >
              <div className="text-md w-full">Map</div>
              <MapSvg ids={[slug]} />
            </div>
          }
          <hr className="border-t border-white-300" />

          <div className="flex flex-col gap-4 mb-12 md:mb-16">
            <div className="text-md">この作品に関連した作品・研究</div>
            <SimilarWorksList items={similarItems} />
          </div>

        </div>
      </div>
      <Footer />
    </main >
  );
}
