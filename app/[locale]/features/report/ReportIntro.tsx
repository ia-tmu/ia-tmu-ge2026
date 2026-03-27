export default function ReportIntro() {
  return (
    <section className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Graduation Exhibition 2026 Archive</h1>
        <h2 className="text-xl md:text-2xl leading-tight">卒業・修了制作研究展2026 実施報告</h2>
      </div>

      {/* <p className="text-xs md:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
        会期：2026年3月1日 - 3月7日{"\n"}
        会場：東京都美術館 ギャラリーA・B
      </p> */}

      <p className="text-xs md:text-sm leading-7 md:leading-8 whitespace-pre-line">
        東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026は、2026年3月1日から3月7日まで、東京都美術館 ギャラリーA・Bにて開催されました（3月2日は休館日）。 {"\n"}
        会期中は1,972名の方にご来場いただきました。ご来場くださった皆さまに、心より御礼申し上げます。
      </p>
    </section>
  );
}
