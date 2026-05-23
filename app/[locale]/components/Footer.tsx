"use client";

import Button from "./Button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative mb-8 w-full pointer-events-none z-10">
      <div className="w-full max-w-4xl px-2 md:px-12 lg:px-16 mx-auto pointer-events-auto">
        <div className="flex flex-col gap-8 items-center text-xs md:text-sm font-medium">
          <div className="flex flex-wrap justify-end gap-6 text-sm">
            <Button
              href="https://www.instagram.com/tmu_ia_sotsuten/"
              target="_blank"
            >
              Instagram
            </Button>
            <Button href="https://x.com/tmu_ia_sotsuten" target="_blank">
              X (Twitter)
            </Button>
            <Button href="https://note.com/tmu_ia" target="_blank" className="no-underline" >
              <div className="text-base -mt-[3px]  underline decoration-[0.05rem]">
                note
              </div>
            </Button>
            <Button href="https://industrial-art.sd.tmu.ac.jp/" target="_blank">
              Department Website
            </Button>
          </div>
          <div className="flex flex-col gap-3 items-center pb-10">
            <div>
              © {currentYear} Department of Industrial Art, Tokyo Metropolitan
              University
            </div>

            {/* <Button
              href="https://industrial-art.sd.tmu.ac.jp/privacy-policy.html"
              target="_blank"
            >
              Privacy policy
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}