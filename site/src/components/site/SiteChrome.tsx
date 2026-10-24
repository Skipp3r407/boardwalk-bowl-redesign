import { TopCtaBar } from "@/components/site/TopCtaBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileFloatingActions } from "@/components/site/MobileFloatingActions";
import { ChromeGate } from "@/components/site/ChromeGate";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ChromeGate top={<TopCtaBar />} header={<Header />} footer={<Footer />} floating={<MobileFloatingActions />}>
      {children}
    </ChromeGate>
  );
}
