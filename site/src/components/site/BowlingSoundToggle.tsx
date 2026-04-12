"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  playPinScatter,
  resumeBowlingAudio,
  startAlleyAmbience,
  stopAlleyAmbience,
} from "@/lib/bowling-synth";

const STORAGE_KEY = "boardwalk-bowl-sounds";

const prefListeners = new Set<() => void>();

function readPref(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePref(on: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  prefListeners.forEach((l) => l());
}

function subscribePref(onStoreChange: () => void) {
  prefListeners.add(onStoreChange);
  return () => prefListeners.delete(onStoreChange);
}

function useBowlingSoundPref() {
  return useSyncExternalStore(subscribePref, readPref, () => false);
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

export function BowlingSoundToggle() {
  const isClient = useIsClient();
  const wantsSound = useBowlingSoundPref();
  const reduceMotion = usePrefersReducedMotion();
  const [running, setRunning] = useState(false);
  const scatterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startingRef = useRef(false);

  const clearScatterLoop = useCallback(() => {
    if (scatterTimer.current) {
      clearTimeout(scatterTimer.current);
      scatterTimer.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    if (startingRef.current) return;
    startingRef.current = true;
    resumeBowlingAudio()
      .then(() => {
        playPinScatter();
        startAlleyAmbience();
        setRunning(true);
        clearScatterLoop();
        const scheduleScatter = () => {
          const ms = 35_000 + Math.random() * 45_000;
          scatterTimer.current = setTimeout(() => {
            playPinScatter();
            scheduleScatter();
          }, ms);
        };
        scheduleScatter();
      })
      .finally(() => {
        startingRef.current = false;
      });
  }, [clearScatterLoop]);

  const stopPlayback = useCallback(() => {
    startingRef.current = false;
    clearScatterLoop();
    stopAlleyAmbience();
    setRunning(false);
  }, [clearScatterLoop]);

  /** Revisit: saved “on” — first pointer *outside* this button resumes audio (avoids double-firing with the toggle). */
  useEffect(() => {
    if (!isClient || !wantsSound || running || reduceMotion) return;
    const onFirstPointer = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.("[data-bowling-sound-toggle]")) return;
      startPlayback();
    };
    document.addEventListener("pointerdown", onFirstPointer, { passive: true });
    return () => document.removeEventListener("pointerdown", onFirstPointer);
  }, [isClient, wantsSound, running, reduceMotion, startPlayback]);

  useEffect(() => {
    return () => {
      clearScatterLoop();
      stopAlleyAmbience();
    };
  }, [clearScatterLoop]);

  const toggle = useCallback(() => {
    if (reduceMotion) return;
    if (wantsSound && running) {
      writePref(false);
      stopPlayback();
      return;
    }
    writePref(true);
    startPlayback();
  }, [reduceMotion, wantsSound, running, startPlayback, stopPlayback]);

  if (!isClient || reduceMotion) {
    return null;
  }

  const label =
    wantsSound && running
      ? "Alley sounds on — click to mute"
      : wantsSound && !running
        ? "Alley sounds loading — click anywhere or tap here"
        : "Turn on subtle bowling alley sounds";

  return (
    <button
      type="button"
      data-bowling-sound-toggle=""
      onClick={toggle}
      aria-pressed={wantsSound && running}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-lg transition duration-200 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:shadow-[0_0_16px_-4px_rgba(34,211,238,0.35)] aria-pressed:bg-cyan-500/15 aria-pressed:border-cyan-400/30"
    >
      {wantsSound && running ? "🔊" : "🔈"}
    </button>
  );
}
