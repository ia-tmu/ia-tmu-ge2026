"use client";

import { useState } from "react";
import { ShareQRModal } from "./ShareQRModal";
import type { Work } from "../../types/work";

export function ShareQRButton({ allWorks }: { allWorks: Work[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm border border-foreground px-3 py-2 cursor-pointer hover:bg-foreground/10 transition"
      >
        Share (QR)
      </button>

      <ShareQRModal open={open} onClose={() => setOpen(false)} allWorks={allWorks} />
    </>
  );
}
