"use client";

import Image, { StaticImageData } from "next/image";
import Section from "../components/Section";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ExternalLinkIcon, PersonIcon } from "../components/Icons";
import funayamaImage from "../../../public/images/events/funayama_takashi.jpg";
import inoueImage from "../../../public/images/events/inoue_yu.jpg";
import takahashiImage from "../../../public/images/events/kentaro_takahashi.jpg";
import takedaImage from "../../../public/images/events/mai_takeda.jpg";

interface Speaker {
  name: string;
  profile?: string;
  gradYear?: string;
  url?: string;
  imageUrl?: string | StaticImageData;
}

interface EventSession {
  date: string;
  time: string;
  title: string;
  subtitle?: string;
  speakers: Speaker[];
  startDateTime?: string;
  endDateTime?: string;
}

export default function Events() {
  const { t } = useTranslation();

  const sessions: EventSession[] = [
    {
      date: "3/1 sun",
      time: "13:00-14:30",
      title: t("events.sessions.0.title"),
      subtitle: t("events.sessions.0.subtitle"),
      startDateTime: "20260301T130000",
      endDateTime: "20260301T143000",
      speakers: [
        {
          name: t("events.sessions.0.speakers.0.name"),
          profile: t("events.sessions.0.speakers.0.profile"),
          gradYear: t("events.sessions.0.speakers.0.gradYear"),
          imageUrl: takedaImage,
        },
        {
          name: t("events.sessions.0.speakers.1.name"),
          profile: t("events.sessions.0.speakers.1.profile"),
          gradYear: t("events.sessions.0.speakers.1.gradYear"),
          url: "https://www.instagram.com/kentaro.t97",
          imageUrl: takahashiImage,
        },
        {
          name: t("events.sessions.0.speakers.2.name"),
          profile: t("events.sessions.0.speakers.2.profile"),
          imageUrl: "",
        },
      ],
    },
    {
      date: "3/1 sun",
      time: "15:00-16:00",
      title: t("events.sessions.1.title"),
      subtitle: t("events.sessions.1.subtitle"),
      startDateTime: "20260301T150000",
      endDateTime: "20260301T160000",
      speakers: [
        {
          name: t("events.sessions.1.speakers.0.name"),
          profile: t("events.sessions.1.speakers.0.profile"),
          gradYear: t("events.sessions.1.speakers.0.gradYear"),
          url: t("events.sessions.1.speakers.0.url"),
          imageUrl: "",
        },
        { name: t("events.sessions.1.speakers.1.name"), imageUrl: "" },
        {
          name: t("events.sessions.1.speakers.2.name"),
          profile: t("events.sessions.1.speakers.2.profile"),
          imageUrl: "",
        },
      ],
    },
    {
      date: "3/6 fri",
      time: "13:00-14:00",
      title: t("events.sessions.2.title"),
      subtitle: t("events.sessions.2.subtitle"),
      startDateTime: "20260306T130000",
      endDateTime: "20260306T140000",
      speakers: [
        {
          name: t("events.sessions.2.speakers.0.name"),
          profile: t("events.sessions.2.speakers.0.profile"),
          gradYear: t("events.sessions.2.speakers.0.gradYear"),
          url: "https://yuinoue.jp/",
          imageUrl: inoueImage,
        },
        {
          name: t("events.sessions.2.speakers.1.name"),
          profile: t("events.sessions.2.speakers.1.profile"),
          gradYear: t("events.sessions.2.speakers.1.gradYear"),
          url: "http://mt-funa.com/",
          imageUrl: funayamaImage,
        },
        {
          name: t("events.sessions.2.speakers.2.name"),
          profile: t("events.sessions.2.speakers.2.profile"),
          imageUrl: "",
        },
      ],
    },
    {
      date: "3/6 fri",
      time: "15:00-16:00",
      title: t("events.sessions.3.title"),
      subtitle: t("events.sessions.3.subtitle"),
      startDateTime: "20260306T150000",
      endDateTime: "20260306T160000",
      speakers: [
        { name: t("events.sessions.3.speakers.0.name"), imageUrl: "" },
        {
          name: t("events.sessions.3.speakers.1.name"),
          profile: t("events.sessions.3.speakers.1.profile"),
          imageUrl: "",
        },
      ],
    },
  ];

  const createGoogleCalendarUrl = (session: EventSession) => {
    if (!session.startDateTime || !session.endDateTime) return "";

    const text = encodeURIComponent(
      `【IA卒展トークセッション】${session.title}`
    );
    const details = encodeURIComponent(
      `日時：${session.date} ${session.time}\n` +
        `登壇者：${session.speakers.map((s) => s.name).join("、")}\n\n` +
        `東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026\n` +
        `会場：東京都美術館`
    );
    const location = encodeURIComponent("東京都美術館");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${session.startDateTime}/${session.endDateTime}&details=${details}&location=${location}&sprop=&sprop=name:`;
  };

  return (
    <Section title={t("events.title")}>
      <div className="space-y-12">
        {/* 概要 */}
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-bold">
            {t("events.sectionTitle")}
          </h3>
          <p className="leading-relaxed max-w-3xl">{t("events.description")}</p>
        </div>

        {/* セッション一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
          {sessions.map((session, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* 日時 */}
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-xl font-en font-medium">
                    {session.date}
                  </span>
                  <span className="text-lg font-en">{session.time}</span>
                </div>
                {session.startDateTime && (
                  <Link
                    href={createGoogleCalendarUrl(session)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs border border-black/10 px-2 py-1 rounded hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                    title="Googleカレンダーに追加"
                  >
                    <span>＋ Calendar</span>
                  </Link>
                )}
              </div>

              {/* タイトル */}
              <div className="min-h-[3rem] flex flex-col justify-center">
                <h4 className="text-lg font-bold leading-tight">
                  {session.title}
                </h4>
                {session.subtitle && (
                  <span className="text-sm font-medium mt-1">
                    {session.subtitle}
                  </span>
                )}
              </div>

              {/* 登壇者リスト */}
              <ul className="flex flex-col gap-3 mt-2">
                {session.speakers.map((speaker, sIndex) => (
                  <li key={sIndex} className="flex items-center gap-3 text-sm">
                    {/* 顔写真 */}
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-black/10">
                      {speaker.imageUrl ? (
                        <Image
                          src={speaker.imageUrl}
                          alt={speaker.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <PersonIcon
                            width={24}
                            height={24}
                            color="white"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-wrap flex-col md:flex-row md:items-center gap-x-2 gap-y-1">
                      {speaker.url ? (
                        <Link
                          href={speaker.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="group flex items-center gap-1 hover:text-white/60 transition-colors cursor-pointer duration-300">
                            <span className="font-bold whitespace-nowrap underline underline-offset-2 decoration-current group-hover:decoration-transparent transition-all duration-300">
                              {speaker.name}
                            </span>

                            <div className="h-4 w-4">
                              <ExternalLinkIcon
                                width={16}
                                height={16}
                                className=""
                              />
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <span className="font-bold whitespace-nowrap">
                          {speaker.name}
                        </span>
                      )}

                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-black/60">
                        {speaker.profile && (
                          <span className="whitespace-nowrap">
                            {speaker.profile}
                          </span>
                        )}
                        {speaker.gradYear && (
                          <span className="whitespace-nowrap">
                            {speaker.gradYear}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
