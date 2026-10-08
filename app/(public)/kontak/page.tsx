import { Mail, MessageCircle, Phone } from "lucide-react";
import { LinkButton } from "@/components/public/link-button";
import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { site, waLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontak",
  description: "Hubungi RasaLoka lewat WhatsApp, telepon, atau email untuk reservasi, pesanan takeaway, dan penawaran catering event.",
  path: "/kontak",
});

export default function ContactPage() {
  const cards = [
    {
      icon: MessageCircle, title: "WhatsApp", text: "Respons tercepat untuk reservasi dan penawaran event.",
      action: <LinkButton href={waLink("Halo RasaLoka, saya ingin bertanya.")} external>Chat sekarang</LinkButton>,
    },
    {
      icon: Phone, title: "Telepon", text: `${site.phone} (jam operasional)`,
      action: <LinkButton href={`tel:${site.phoneIntl}`} variant="outline">Hubungi</LinkButton>,
    },
    {
      icon: Mail, title: "Email", text: site.email,
      action: <LinkButton href={`mailto:${site.email}`} variant="outline">Kirim email</LinkButton>,
    },
  ];
  return (
    <>
      <PageHero eyebrow="Kontak" title="Kami siap membantu" description="Pilih saluran yang paling nyaman. Untuk pesanan event, sertakan jenis acara, tanggal, dan jumlah tamu." />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, text, action }) => (
            <article key={title} className="flex flex-col rounded-3xl border border-stone-200 p-6">
              <Icon className="mb-3 size-7 text-orange-700" aria-hidden="true" />
              <h2 className="text-lg font-bold text-stone-900">{title}</h2>
              <p className="mt-1 flex-1 text-sm text-stone-600">{text}</p>
              <div className="mt-5">{action}</div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-orange-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-stone-900">Template pesan untuk event</h2>
          <p className="mt-1 text-sm text-stone-600">Salin dan lengkapi, lalu kirim melalui WhatsApp:</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-sm text-stone-700 ring-1 ring-orange-100">
{`Halo RasaLoka, saya ingin pesan event.
Nama: …
Jenis acara: (arisan / hajatan / meeting / gathering / corporate)
Tanggal & jam: …
Jumlah tamu: …
Catatan menu: …`}
          </pre>
        </div>
      </Section>
    </>
  );
}
