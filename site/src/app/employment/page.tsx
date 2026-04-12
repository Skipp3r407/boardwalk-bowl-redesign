import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { scrapedHero } from "@/lib/boardwalk-page-images";
import { ScrapedOnPageGallery } from "@/components/scraped/ScrapedOnPageGallery";

export const metadata: Metadata = {
  title: "Employment",
  description:
    "Careers at Boardwalk Bowl — flexible schedules, upbeat environment, growth opportunities, and employee perks including bowling and arcade discounts.",
};

export default function EmploymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Hospitality · ops · fun on the job"
        title="Work where people celebrate"
        subtitle="Fast-paced shifts, friendly regulars, and room to grow—Boardwalk Bowl is more than a job if you like energy and teamwork."
        align="center"
        imageSrc={scrapedHero(
          "employment",
          "/images/boardwalk/Boardwalk-Bowling-Bowling-Lanes-3-Jennifer-Halpern.jpg",
        )}
        imageAlt="Boardwalk Bowl team and venue"
      />

      <SectionReveal className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Why people stay</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Flexible schedules — part-time and seasonal paths</li>
              <li>High-energy floors without corporate stiffness</li>
              <li>Paths into leadership for hospitality-minded talent</li>
              <li>Perks on bowling and arcade (per live site)</li>
            </ul>
          </div>
          <DemoForm variant="employment" />
        </div>
      </SectionReveal>

      <ScrapedOnPageGallery pageKey="employment" />
    </>
  );
}
