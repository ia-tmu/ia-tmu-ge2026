"use client";

import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const mapUrl = `${basePath}/images/map.svg`;

export default function MapSvg({ ids }: { ids: string[] }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(mapUrl);
        if (!res.ok) {
          console.error("Failed to load map SVG:", res.statusText);
          return;
        }
        const text = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");

        const svgEl = doc.querySelector("svg");
        if (svgEl) {
          svgEl.removeAttribute("width");
          svgEl.removeAttribute("height");

          svgEl.setAttribute("width", "100%");
          svgEl.style.height = "auto";
          svgEl.style.display = "block";
        }

        ids.forEach((id) => {
          const el = doc.getElementById(id);
          if (el) {
            el.style.fill = "#112FA9";
            el.style.opacity = "1";
          }
        });

        setSvg(new XMLSerializer().serializeToString(doc));
      } catch (error) {
        console.error("Error loading map SVG:", error);
      }
    };

    load();
  }, [JSON.stringify(ids)]);

  return (
    <div className="w-full min-w-2xl">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
