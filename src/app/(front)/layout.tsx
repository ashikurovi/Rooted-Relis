import { Navbar } from "@/components/landing/navber";
import { Footer } from "@/components/landing/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white relative font-sans pb-16 lg:pb-0">

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
}
