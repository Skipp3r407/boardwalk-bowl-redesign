"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function ImageLightboxModal({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === "undefined" || !open || !src) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-[2px]"
      role="dialog"
      aria-modal
      aria-label="Enlarged image"
    >
      <div className="flex shrink-0 items-center justify-end gap-2 px-3 pt-3 sm:px-4 sm:pt-4">
        <button
          type="button"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/20"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div
        className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center p-4 pb-10"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        role="presentation"
      >
        <div className="max-h-[min(88vh,920px)] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
          <Image
            src={src}
            alt={alt}
            width={2400}
            height={1600}
            className="h-auto max-h-[min(88vh,920px)] w-full cursor-default rounded-lg border border-cyan-500/20 object-contain shadow-[0_0_60px_-12px_rgba(34,211,238,0.35)]"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
