import { Check } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { LinkButton } from "@/components/public/link-button";
import { PageHero } from "@/components/public/page-hero";
import { Photo } from "@/components/public/photo";
import { Section } from "@/components/public/section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Layanan",
  description: "Layanan RasaLoka: dine-in dengan 100+ meja, takeaway praktis, dan catering event untuk arisan, hajatan, meeting, dan gathering.",
  path: "/layanan",
});

const services = [
  {
    id: "dine-in", title: "Dine-in",
    text: "Nikmati hidangan di tempat kami dengan area indoor ber-AC, outdoor, dan lesehan/VIP.",
    points: ["Lebih dari 100 meja", "Pesanan dicatat digital dan langsung ke dapur", "Pembayaran tunai, transfer, QRIS, dan kartu debit", "Cocok untuk keluarga dan rombongan"],
  },
  {
    id: "takeaway", title: "Takeaway",
    text: "Pesan dan bawa pulang tanpa menunggu lama.",
    points: ["Pesan langsung di kasir atau lewat WhatsApp", "Kemasan rapi dan aman", "Waktu persiapan diinformasikan di awal"],
  },
  {
    id: "catering", title: "Event & Catering",
    text: "Paket lengkap untuk acara pribadi maupun perusahaan, dari 15 hingga ratusan tamu.",
    points: ["Arisan, hajatan, meeting, gathering, corporate", "Penawaran dan kontrak yang jelas", "DP untuk mengunci tanggal", "Tim penyaji dan penataan hidangan"],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Layanan" title="Satu dapur, tiga cara menikmati" description="Pilih layanan yang paling sesuai dengan kebutuhan Anda hari ini." />
      <Section tone="plain">
        <div className="space-y-6">
          {services.map((s) => (
            <article key={s.id} id={s.id} className="grid gap-6 rounded-3xl border border-stone-200 p-6 sm:p-8 md:grid-cols-[auto_1fr]">
              <Photo photoKey={`service-${s.id}`} alt={s.title} sizes="(min-width: 768px) 224px, 100vw" className="aspect-[4/3] w-full rounded-2xl md:w-56" />
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{s.title}</h2>
                <p className="mt-1 text-stone-600">{s.text}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-stone-700">
                      <Check className="mt-0.5 size-4 shrink-0 text-orange-700" aria-hidden="true" /> {p}
                    </li>
                  ))}
                </ul>
                {s.id === "catering" && (
                  <div className="mt-5"><LinkButton href="/event">Lihat paket event</LinkButton></div>
                )}
                {s.id !== "catering" && (
                  <div className="mt-5"><LinkButton href="/menu" variant="outline">Lihat menu</LinkButton></div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
