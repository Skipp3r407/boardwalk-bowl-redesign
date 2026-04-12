import { TopCtaBar } from "@/components/site/TopCtaBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileFloatingActions } from "@/components/site/MobileFloatingActions";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopCtaBar />
      <Header />
      <main className="relative flex-1 overflow-x-hidden pb-24 lg:pb-0">{children}</main>
      <Footer />
      <MobileFloatingActions />
    </>
  );
}
