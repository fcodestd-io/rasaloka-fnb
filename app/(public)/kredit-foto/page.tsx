import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { allPhotos } from "@/content/images";

export const metadata: Metadata = {
  title: "Kredit Foto",
  description: "Daftar fotografer dan sumber foto yang digunakan pada website RasaLoka.",
  alternates: { canonical: "/kredit-foto" },
  robots: { index: false, follow: true },
};

export default function PhotoCreditsPage() {
  const photos = allPhotos();
  return (
    <>
      <PageHero eyebrow="Kredit" title="Kredit foto" description="Foto pada website ini berasal dari Pexels (lisensi bebas pakai). Terima kasih kepada para fotografer." />
      <Section>
        {photos.length === 0 ? (
          <p className="text-stone-600">Belum ada foto yang diunduh. Jalankan <code>pnpm images:fetch</code>.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {photos.map(([key, p]) => (
              <li key={key} className="text-stone-600">
                <a className="font-medium text-orange-700 underline" href={p.sourceUrl} target="_blank" rel="noopener noreferrer">{p.alt}</a>
                {" · "}
                <a className="underline" href={p.credit.url} target="_blank" rel="noopener noreferrer">{p.credit.name}</a>
                {" / Pexels"}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
