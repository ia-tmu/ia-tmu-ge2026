"use client";
import { useEffect, useRef, useState } from "react";

type GuruguruProps = {
  src: string;
  className?: string;
  pauseMs?: number;
  fadeMs?: number;
  startDelayMs?: number;
};

export default function Guruguru({
  src,
  className,
  pauseMs = 5000,
  fadeMs = 1000,
  startDelayMs = 0,
}: GuruguruProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"playing" | "holding" | "fading">("playing");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let holdTimer: number;
    let fadeTimer: number;
    let resetTimer: number;
    let startTimer: number;

    const start = () => {
      setPhase("playing");
      video.currentTime = 0;
      video.play().catch(() => { });
    };

    const onEnded = () => {
      video.pause();
      setPhase("holding");

      holdTimer = window.setTimeout(() => {
        setPhase("fading");

        fadeTimer = window.setTimeout(() => {
          // フェードアウト完了後、まず動画をリセット
          video.currentTime = 0;

          // 少し待ってから次の再生を開始
          resetTimer = window.setTimeout(() => {
            setPhase("playing");
            startTimer = window.setTimeout(start, startDelayMs);
          }, 50); // 短い遅延で確実にリセット
        }, fadeMs);
      }, pauseMs);
    };

    video.addEventListener("ended", onEnded);
    startTimer = window.setTimeout(start, startDelayMs);

    return () => {
      video.removeEventListener("ended", onEnded);
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
      clearTimeout(resetTimer);
      clearTimeout(startTimer);
    };
  }, [src, pauseMs, fadeMs, startDelayMs]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      className={className}
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${fadeMs}ms ease-out`,
      }}
    />
  );
}
