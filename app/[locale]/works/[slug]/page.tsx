import { fetchRowBySlug, fetchAllIds } from "@/lib/get-works";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import MoyaBG from "../../features/MoyaBG";
import { WorkCard } from "../../features/works/WorkCard";
import ImageSlider from "../../features/works/ImageSlider";

export const dynamicParams = false;

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

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px] text-foreground">
      <MoyaBG />
      <div className="max-w-[960px] mx-auto">
        <div className="flex flex-col md:flex-row items-start">
          {/* 左側：テキスト・キーワード・リンク */}
          <div className="flex-1 self-stretch flex flex-col gap-7.5 mr-7.5 min-h-full">
            <h1 className="text-sm font-medium">{work.degree}</h1>
            <h2 className="text-xl font-bold">{work.workTitle}</h2>
            <div className="text-sm font-medium">{work.studioName}</div>
            <div className="flex flex-col text-sm gap-2.5">
              {[work.keyword1, work.keyword2, work.keyword3]
                .filter(Boolean)
                .map((kw, i) => (
                  <span key={i}>#{kw}</span>
                ))}
            </div>
            <div className="flex flex-col text-sm gap-2.5 mt-auto">
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
            images={work.image}
            name={work.name}
          />
        </div>
        <div className="flex flex-col mt-12.5 gap-12.5">
          {/* 説明文（データがあれば表示） */}
          {work.workDescriptionJP && (
            <div className="whitespace-pre-wrap text-md leading-8">
              {work.workDescriptionJP}
            </div>
          )}
          {work.workDescriptionEN && (
            <div className="whitespace-pre-wrap text-md leading-8">
              {work.workDescriptionEN}
            </div>
          )}
          <hr className="border-t border-white-300" />
          <div className="text-md">この作品に関連した作品・研究</div>
          <WorkCard work={work} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
