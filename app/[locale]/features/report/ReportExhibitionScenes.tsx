import ReportImagePlaceholder from "./ReportImagePlaceholder";

/** 本文カラムと同一の余白（report/page.tsx の内側ラッパーと揃える） */
const reportContentGutterClass =
  "w-full max-w-5xl mx-auto px-6 md:px-10 lg:px-14";

type AutoScrollRowProps = {
  labels: string[];
  direction: "left" | "right";
};

function AutoScrollRow({ labels, direction }: AutoScrollRowProps) {
  const trackClass =
    direction === "left"
      ? "scroll-row-track scroll-row-track-left"
      : "scroll-row-track scroll-row-track-right";

  return (
    <div className="w-full overflow-hidden py-2">
      <div className={`flex gap-3 md:gap-4 ${trackClass}`} style={{ width: "max-content" }}>
        {[labels, labels].flat().map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="shrink-0 w-[200px] md:w-[240px] lg:w-[260px]"
          >
            <ReportImagePlaceholder
              aspectClassName="aspect-[4/3]"
              label={label}
              className="bg-foreground/5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** px 付きラッパー内に置く（見出し・リード文） */
export function ReportExhibitionScenesIntro() {
  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Exhibition Scenes</h2>
        <p className="text-xs md:text-sm leading-7 md:leading-8 whitespace-pre-line">
          会場風景や作品写真を通して、展覧会の様子をご紹介します。展示空間の広がりや、作品と鑑賞者の関わりをご覧ください。
        </p>
      </div>
    </section>
  );
}

/**
 * main 直下（水平 padding の外）に置く。ビューポート全幅の帯になる。
 * ラベルだけ本文カラムの余白に合わせる。
 */
export function ReportExhibitionScenesGalleries() {
  const galleryALabels = Array.from(
    { length: 30 },
    (_, i) => `Gallery A Placeholder ${i + 1}`
  );
  const galleryBLabels = Array.from(
    { length: 30 },
    (_, i) => `Gallery B Placeholder ${i + 1}`
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className={`${reportContentGutterClass} shrink-0`}>
        <p className="text-xs md:text-sm font-semibold">Gallery A</p>
      </div>
      <div className="w-full min-w-0 overflow-x-hidden shrink-0">
        <AutoScrollRow labels={galleryALabels} direction="right" />
      </div>

      <div className={`${reportContentGutterClass} shrink-0`}>
        <p className="text-xs md:text-sm font-semibold">Gallery B</p>
      </div>
      <div className="w-full min-w-0 overflow-x-hidden shrink-0">
        <AutoScrollRow labels={galleryBLabels} direction="left" />
      </div>
    </div>
  );
}
