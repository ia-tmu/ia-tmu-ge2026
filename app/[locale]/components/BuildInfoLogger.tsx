"use client";

import { useEffect } from "react";

export default function BuildInfoLogger() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
      const branch = process.env.NEXT_PUBLIC_GIT_BRANCH;
      const sha = process.env.NEXT_PUBLIC_GIT_SHA;

      console.log(
        `%c Build Info %c ${buildTime} %c ${branch} (${sha}) `,
        "background: #333; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 5px;",
        "background: #0070f3; color: #fff; padding: 2px 5px;",
        "background: #e00; color: #fff; border-radius: 0 3px 3px 0; padding: 2px 5px;"
      );
    }
  }, []);

  return null;
}
