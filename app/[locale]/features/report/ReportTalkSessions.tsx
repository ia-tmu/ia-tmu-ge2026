import Button from "../../components/Button";
import ReportImagePlaceholder from "./ReportImagePlaceholder";

const SESSIONS = [
  {
    title: "第１回｜私と『もや』の向き合いかた ― もやが形を帯びるまで",
    meta: "2026.03.01 / 武田真衣、髙橋健太郎、鳥生菜々子",
    body: "第1回では、デザインの過程で生まれる言葉にならない迷いや違和感を「もや」というテーマから捉え直し、卒業後の実践のなかでそれとどう向き合ってきたかが語られました。学生時代から現在までの変化や、正解を求める姿勢から離れること、答えの出ない状態と共存することなど、それぞれの経験に根ざした率直な対話が交わされました。展示作品の背後にある思考や葛藤に触れることで、本展をより立体的に捉える機会となりました。",
    url: "https://note.com/tmu_ia/n/nf73eb263d398",
  },
  {
    title: "第2回｜もやを支える：キュレーション、インストール、クリティークの実践",
    meta: "2026.03.01 / 楠見清、島影圭佑、小林空、清水勇希",
    body: "第2回では、キュレーション、インストール、クリティークといった、作品の手前や周囲で展覧会を支える実践を通して、「もや」と向き合う方法が語られました。もやを晴らすのではなく、より深いもやへと進むために、技術や関係性、共同体をどのように築いていくかが、それぞれの経験に基づいて共有されました。さらに、鑑賞者との距離や、作家・批評家・キュレーターといった役割の境界を越える視点にも話題が広がり、本展を支える実践の豊かさに触れる機会となりました。",
    url: "https://note.com/tmu_ia/n/nf73eb263d398",
  },
  {
    title: "第3回｜もやを“伝わる形”に変える：言語化・可視化・編集の技術",
    meta: "2026.03.06 / 井上悠、舟山貴士、嶋村有彩",
    body: "第3回では、「もや」を他者に伝わる形へと変えていくための、言語化・可視化・編集の技術について語られました。クライアントとの対話を通して判断基準を組み立てるプロセスや、書籍デザインにおいて内容を深く読み込みながら設計へと結びつけていく思考が、それぞれの実践に基づいて共有されました。さらに、学生時代から現在に至るまで変わらず持ち続けている問いや、展示を通して見えてきたインダストリアルアートの強みにも話題が広がり、本展を「伝える」という観点から捉え直す機会となりました。",
    url: "https://note.com/tmu_ia/n/nf73eb263d398",
  },
  {
    title: "第4回｜今回の卒展を振り返って・IA20周年について",
    meta: "2026.03.06 / 馬場哲晃、土屋真、南雲琴寧",
    body: "第4回では、今回の卒展を手がかりに、インダストリアルアート学科・学域が積み重ねてきた20年の歩みと、これからの展望について語られました。展示が手探りだった頃のエピソードや、学生主導で運営が成熟していった経緯、プロダクトとメディアの境界が次第に融け合ってきた変化などが、それぞれの経験を通して共有されました。卒展を支えてきた歴史や文化に触れることで、本展を学科の時間の積み重ねのなかで捉え直す機会となりました。",
    url: "https://note.com/tmu_ia/n/nf73eb263d398",
  },
] as const;

export default function ReportTalkSessions() {
  return (
    <section className="flex flex-col gap-5 md:gap-7">
      <div className="flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold text-right">Talk Sessions</h2>
        <p className="text-xs md:text-sm leading-7 md:leading-8 text-justify whitespace-pre-line">
          会期中に実施した4回のトークセッションの記録です。登壇者それぞれの実践や視点を通して、展示テーマ「もや」をめぐる思考や、制作の背景が語られました。
        </p>
      </div>


      {SESSIONS.map((session, index) => (
        <article
          key={session.title}
          className="pt-4 md:pt-5 flex flex-col gap-2"
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-base md:text-lg font-semibold">{session.title}</h3>
            <p className="text-xs md:text-sm text-foreground/80">{session.meta}</p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,480px)_1fr]">
            <div>
              <ReportImagePlaceholder
                aspectClassName="aspect-[8/5]"
                label={`Talk Session Placeholder ${index + 1}`}
                className="bg-foreground/5"
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-xs md:text-sm leading-7 text-justify whitespace-pre-line">
                {session.body}
              </p>
              {session.url && (
                <Button
                  href={session.url}
                  target="_blank"
                  className="w-max!"
                >
                  <span className="font-semibold">noteで読む</span>
                </Button>
              )}
            </div>
          </div>

        </article>
      ))}
    </section>
  );
}
