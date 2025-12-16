"use client";

import Button from "./Button";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 md:px-12 lg:px-16">
      <div className="flex flex-wrap gap-6 text-xs md:text-sm font-medium opacity-60">
        <Button
          href="https://www.instagram.com/tmu_ia_sotsuten/"
          target="_blank"
        >
          Instagram
        </Button>
        <Button href="https://x.com/tmu_ia_sotsuten" target="_blank">
          X (Twitter)
        </Button>
        <Button href="https://industrial-art.sd.tmu.ac.jp/" target="_blank">
          Department Website
        </Button>
      </div>
    </footer>
  );
}
