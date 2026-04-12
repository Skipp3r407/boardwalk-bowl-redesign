import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  align?: "left" | "center";
}) {
  return (
    <section
      className={`group/hero relative min-h-[280px] overflow-hidden border-b border-white/10 transition-colors duration-300 hover:border-cyan-500/25 md:min-h-[320px] ${
        !imageSrc ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : ""
      }`}
    >
      {imageSrc && (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            priority
            className="object-cover opacity-40 transition duration-700 ease-out group-hover/hero:scale-105 group-hover/hero:opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/65 transition duration-500 group-hover/hero:from-slate-950/95 group-hover/hero:via-slate-950/88 group-hover/hero:to-cyan-950/40" />
        </div>
      )}
      <div
        className={`relative mx-auto max-w-7xl px-4 py-16 sm:py-20 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-[0.95] tracking-[0.04em] text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-slate-300 sm:text-xl">{subtitle}</p>}
      </div>
    </section>
  );
}
