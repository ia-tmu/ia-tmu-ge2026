"use client";

import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    // ブラウザのスクロール復元機能を無効化
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 強制的にトップへスクロール
    window.scrollTo(0, 0);
  }, []);

  return null;
}
