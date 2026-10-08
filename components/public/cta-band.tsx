import { MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/public/link-button";
import { waLink } from "@/content/site";

export function CtaBand({
  title = "Rencanakan acara Anda bersama RasaLoka",
  text = "Ceritakan kebutuhan Anda, kami siapkan penawaran menu dan harga yang sesuai.",
  message = "Halo RasaLoka, saya ingin bertanya tentang pesanan event/catering.",
}: { title?: string; text?: string; message?: string }) {
  return (
    <section className="bg-orange-700 py-14 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-orange-100">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={waLink(message)} external variant="light">
            <MessageCircle className="size-4" aria-hidden="true" /> Chat WhatsApp
          </LinkButton>
          <LinkButton href="/event" variant="outline" className="!border-white/60 !bg-transparent !text-white hover:!bg-white/10">
            Lihat paket event
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
