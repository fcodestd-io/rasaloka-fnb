import { Car, Clock, MapPin } from "lucide-react";
import { LinkButton } from "@/components/public/link-button";
import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lokasi & Jam Buka",
  description: "Alamat, jam buka, dan petunjuk menuju RasaLoka Kitchen & Eatery di Bandung. Tersedia area parkir untuk mobil dan motor.",
  path: "/lokasi",
});

export default function LocationPage() {
  const a = site.address;
  return (
    <>
      <PageHero eyebrow="Lokasi" title="Temukan kami" description="Mudah dijangkau, dengan area parkir dan ruang luas untuk rombongan." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-stone-200 p-6">
            <MapPin className="mb-3 size-7 text-orange-700" aria-hidden="true" />
            <h2 className="text-lg font-bold text-stone-900">Alamat</h2>
            <address className="mt-2 not-italic text-stone-600">
              {site.name}<br />{a.street}<br />{a.city}, {a.region} {a.postalCode}
            </address>
            <div className="mt-5">
              <LinkButton href={site.mapsUrl} external>Buka di Google Maps</LinkButton>
            </div>
          </article>

          <article className="rounded-3xl border border-stone-200 p-6">
            <Clock className="mb-3 size-7 text-orange-700" aria-hidden="true" />
            <h2 className="text-lg font-bold text-stone-900">Jam buka</h2>
            <table className="mt-2 w-full text-sm text-stone-600">
              <caption className="sr-only">Jam buka RasaLoka</caption>
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.days} className="border-b border-stone-100 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-stone-800">{h.days}</th>
                    <td className="py-2">{h.open} – {h.close} WIB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="rounded-3xl border border-stone-200 p-6">
            <Car className="mb-3 size-7 text-orange-700" aria-hidden="true" />
            <h2 className="text-lg font-bold text-stone-900">Akses & parkir</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
              <li>Area parkir mobil dan motor</li>
              <li>Area indoor, outdoor, dan lesehan/VIP</li>
              <li>Ramah rombongan dan keluarga</li>
            </ul>
          </article>
        </div>
      </Section>
    </>
  );
}
