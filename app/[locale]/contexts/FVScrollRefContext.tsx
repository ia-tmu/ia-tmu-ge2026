"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

const FVScrollRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function FVScrollRefProvider({ children }: { children: React.ReactNode }) {
  const scrollSentinelRef = useRef<HTMLDivElement | null>(null);
  return (
    <FVScrollRefContext.Provider value={scrollSentinelRef}>
      {children}
    </FVScrollRefContext.Provider>
  );
}

export function useFVScrollRef() {
  return useContext(FVScrollRefContext);
}
