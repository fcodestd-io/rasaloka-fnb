import { Check } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { LinkButton } from "@/components/public/link-button";
import { PageHero } from "@/components/public/page-hero";
import { Photo } from "@/components/public/photo";
import { Section } from "@/components/public/section";
import { eventTypes, packages, steps } from "@/content/event";
import { waLink } from "@/content/site";
import { formatRupiah } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Event & Catering",
  description: "Paket catering RasaLoka untuk arisan, hajatan, meeting, gathering, dan acara perusahaan. Harga per orang transparan, DP untuk mengunci tanggal.",
  path: "/event",
});

export default function EventPage() {
  return (
    <>
      <PageHero
        eyebrow="Event & Catering"
        title="Acara lancar, tamu kenyang"
        description="Serahkan urusan hidangan kepada kami. Pilih paket, sesuaikan menu, dan fokuslah pada tamu Anda."
      />

      <Section eyebrow="Jenis acara" title="Kami melayani">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {eventTypes.map((e) => (
            <li key={e.name} className="rounded-2xl border border-stone-200 p-5 text-center">
              <Photo photoKey={`event-${e.slug}`} alt={e.name} sizes="(min-width: 1024px) 18vw, 45vw" className="mb-3 aspect-[4/3] w-full rounded-xl" />
              <h3 className="font-semibold text-stone-900">{e.name}</h3>
              <p className="mt-1 text-sm text-stone-600">{e.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Paket" title="Pilihan paket" subtitle="Harga per orang (pax). Menu dapat disesuaikan; harga final dituangkan dalam penawaran dan kontrak." tone="soft">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
              <p className="text-sm text-stone-500">{p.forWho}</p>
              <p className="mt-4 text-3xl font-extrabold text-orange-700">
                {formatRupiah(p.pricePerPax)}<span className="text-sm font-medium text-stone-500"> /pax</span>
              </p>
              <p className="text-sm text-stone-500">Minimal {p.minPax} pax</p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-orange-700" aria-hidden="true" /> {i}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkButton
                  href={waLink(`Halo RasaLoka, saya tertarik dengan ${p.name}. Mohon penawarannya.`)}
                  external
                  className="w-full"
                >
                  Tanya paket ini
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Alur pemesanan" title="Dari konsultasi sampai hari acara">
        <ol className="grid gap-5 md:grid-cols-5">
          {steps.map((s, idx) => (
            <li key={s.title} className="relative rounded-2xl border border-stone-200 p-5">
              <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-orange-700 text-sm font-bold text-white">{idx + 1}</span>
              <h3 className="font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Sudah punya tanggal dan jumlah tamu?"
        text="Kirimkan detailnya, kami balas dengan penawaran dalam satu hari kerja."
        message="Halo RasaLoka, saya ingin pesan event. Jenis acara: …, tanggal: …, jumlah tamu: …"
      />
    </>
  );
}
