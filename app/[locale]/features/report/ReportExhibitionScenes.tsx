import ReportImagePlaceholder from "./ReportImagePlaceholder";

type AutoScrollRowProps = {
  labels: string[];
  direction: "left" | "right";
};

const fullBleedAutoScrollWrapClass =
  "w-screen max-w-screen shrink-0 self-start overflow-x-hidden ml-[calc(50%_-_50vw)]";

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

export default function ReportExhibitionScenes() {
  const galleryALabels = Array.from(
    { length: 30 },
    (_, i) => `Gallery A Placeholder ${i + 1}`
  );
  const galleryBLabels = Array.from(
    { length: 30 },
    (_, i) => `Gallery B Placeholder ${i + 1}`
  );

  return (
    <section className="flex flex-col gap-4 md:gap-6">

      <div className="flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold">Exhibition Scenes</h2>
        <p className="text-xs md:text-sm leading-7 md:leading-8 whitespace-pre-line">
          会場風景や作品写真を通して、展覧会の様子をご紹介します。展示空間の広がりや、作品と鑑賞者の関わりをご覧ください。
        </p>
      </div>


      <div className="grid gap-4 md:gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-xs md:text-sm font-semibold">Gallery A</p>
          <div className={fullBleedAutoScrollWrapClass}>
            <AutoScrollRow labels={galleryALabels} direction="right" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs md:text-sm font-semibold">Gallery B</p>
          <div className={fullBleedAutoScrollWrapClass}>
            <AutoScrollRow labels={galleryBLabels} direction="left" />
          </div>
        </div>
      </div>
    </section>
  );
}
