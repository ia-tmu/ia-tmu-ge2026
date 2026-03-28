const VOICES = [
  {
    title: "展示全体について",
    body: ` -「作品のクオリティが高いように感じました。展示の統一感が感じられて大変洗練されたように思いました。」
  -「どの作品にも、制作者の思いが伝わってきて素晴らしかったです。」
  -「スペースに余裕があって見やすい。」`,
  },
  {
    title: "作品と研究について",
    body: `-「学生がそれぞれの関心を、他者に伝わる言葉と形で表現していることがとても印象的だった。」
      -「文化を繋ぎながら未来もある、このまま社会に出てきてほしい作品ばかりの興味深い楽しい作品展でした。」`,
  },
  {
    title: "展示方法について",
    body: `-「ボードだけに留まらず、映像や冊子、ウェブサイトを活用していて、理解しやすかったです。」
 -「紹介や展示方法まで個性的で、とても見やすく研究内容について知ることができて良かったです。」`,
  },
] as const;

export default function ReportVisitorsVoices() {
  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <h2 className="text-3xl md:text-4xl font-semibold">Visitors’ Voices</h2>

      <p className="text-xs md:text-sm leading-7 md:leading-8 text-justify whitespace-pre-line">
        来場者アンケートでは、多くの方から展示全体に対する前向きな感想が寄せられました。作品の完成度や多様性に加え、展示の見やすさや研究内容の伝わりやすさに関する声も多く見られました。作品そのものだけでなく、その背景にある視点や制作の過程まで受け取られていたことが印象的でした。一方で、QRコード表示や展示分類など、今後の運営に活かせる改善提案も寄せられました。
      </p>

      <div className="flex flex-col gap-4 md:gap-5">
        {VOICES.map((voice) => (
          <article key={voice.title} className="pt-3 md:pt-4">
            <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">{voice.title}</h3>
            <p className="text-xs md:text-sm leading-7 whitespace-pre-line">{voice.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
