import { CtaBand } from "@/components/public/cta-band";
import { PageHero } from "@/components/public/page-hero";
import { Photo } from "@/components/public/photo";
import { Section } from "@/components/public/section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tentang Kami",
  description: "Kenali RasaLoka Kitchen & Eatery: kisah, nilai, dan komitmen kami menyajikan masakan nusantara yang jujur, segar, dan konsisten.",
  path: "/tentang",
});

const values = [
  { title: "Jujur pada rasa", text: "Resep dijaga konsisten; kami tidak mengorbankan rasa demi kecepatan." },
  { title: "Bahan segar", text: "Bahan diperiksa saat diterima dan hanya yang layak masuk dapur." },
  { title: "Pelayanan tulus", text: "Tim kami melayani dengan ramah, tepat, dan tanpa membuat Anda menunggu tanpa kabar." },
  { title: "Transparan", text: "Harga dan syarat, termasuk untuk event, dijelaskan di awal." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Tentang kami" title="Tempat berkumpul dengan rasa yang akrab" description="RasaLoka lahir dari keinginan sederhana: menghadirkan masakan nusantara yang enak, harga wajar, dan tempat yang nyaman untuk berbagi cerita." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-stone-700">
            <h2 className="text-2xl font-bold text-stone-900">Cerita kami</h2>
            <p>
              RasaLoka Kitchen &amp; Eatery adalah restoran casual dining satu cabang dengan lebih dari 100 meja.
              Kami melayani makan di tempat, takeaway, dan catering untuk berbagai acara.
            </p>
            <p>
              Dapur kami memadukan resep keluarga dengan teknik memasak modern. Setiap pesanan dicatat secara digital,
              diteruskan langsung ke dapur, dan disajikan selagi hangat.
            </p>
            <p className="text-sm text-stone-500">
              Catatan: RasaLoka adalah restoran fiktif yang dibuat untuk keperluan portfolio; seluruh data bersifat contoh.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["about-1", "about-2", "about-3", "about-4"].map((k, i) => (
              <Photo
                key={k}
                photoKey={k}
                sizes="(min-width: 1024px) 25vw, 45vw"
                className={`aspect-[4/3] rounded-3xl ${i % 3 === 0 ? "col-span-2 aspect-[16/9]" : ""}`}
              />
            ))}
          </div>
        </div>
      </Section>
      <Section eyebrow="Nilai kami" title="Yang kami pegang" tone="soft">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h3 className="font-semibold text-stone-900">{v.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Mampir dan rasakan sendiri" text="Kami tunggu kedatangan Anda atau bantu rencanakan acara berikutnya." />
    </>
  );
}
