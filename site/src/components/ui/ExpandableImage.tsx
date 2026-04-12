"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";

export function ExpandableImage({
  src,
  alt,
  sizes,
  wrapperClassName,
  imageClassName = "object-cover",
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Must include `relative` and dimensions (or aspect) so `fill` works */
  wrapperClassName: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-zoom-in border-0 bg-transparent p-0 text-left ${wrapperClassName}`}
        aria-label={alt ? `View larger: ${alt}` : "View larger image"}
      >
        <Image src={src} alt={alt} fill className={imageClassName} sizes={sizes} priority={priority} />
      </button>
      <ImageLightboxModal open={open} src={src} alt={alt} onClose={() => setOpen(false)} />
    </>
  );
}
