/** Subtle graph-paper lines over the hero photo; opacity cycles in/out via `.hero-grid-fade-overlay`. */
export function HeroGridFadeOverlay() {
  return <div className="hero-grid-fade-overlay pointer-events-none absolute inset-0 z-[2]" aria-hidden />;
}
