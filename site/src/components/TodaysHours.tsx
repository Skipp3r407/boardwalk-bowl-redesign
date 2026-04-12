"use client";

import { useEffect, useState } from "react";
import { HOURS_VENUE } from "@/lib/site-data";

const dayIndexMap: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

/** Resolves "today" after mount so server and client HTML stay aligned. */
export function TodaysHours() {
  const [today, setToday] = useState<{ day: string; hours: string } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const jsDay = new Date().getDay();
      const idx = dayIndexMap[jsDay] ?? 0;
      setToday(HOURS_VENUE[idx]);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-cyan-300/90">Today</span>
      {today ? (
        <>
          {" "}
          ({today.day}): {today.hours}
        </>
      ) : (
        <span className="text-slate-500"> — …</span>
      )}
    </p>
  );
}
