import { JsonLd } from "@/components/public/json-ld";
import { CtaBand } from "@/components/public/cta-band";
import { MenuCard } from "@/components/public/menu-card";
import { Photo } from "@/components/public/photo";
import { PageHero } from "@/components/public/page-hero";
import { categoryKey } from "@/content/images";
import { menu } from "@/content/menu";
import { absoluteUrl, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Menu & Katalog",
  description: "Daftar lengkap menu RasaLoka: nasi & mie, ayam & daging, seafood, sayur & sup, camilan, minuman, dan dessert dengan harga terbaru.",
  path: "/menu",
});

const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: `Menu ${site.name}`,
  url: absoluteUrl("/menu"),
  inLanguage: "id",
  hasMenuSection: menu.map((c) => ({
    "@type": "MenuSection",
    name: c.name,
    description: c.description,
    hasMenuItem: c.items.map((i) => ({
      "@type": "MenuItem",
      name: i.name,
      description: i.description,
      offers: { "@type": "Offer", price: i.price, priceCurrency: "IDR" },
    })),
  })),
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Katalog produk"
        title="Menu RasaLoka"
        description="Pilih dari hidangan nusantara favorit kami. Harga dalam Rupiah; ketersediaan dapat berubah sewaktu-waktu."
      />

      <nav aria-label="Kategori menu" className="sticky top-16 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {menu.map((c) => (
            <li key={c.slug} className="shrink-0">
              <a
                href={`#${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3.5 py-1.5 text-sm font-medium text-stone-700 hover:border-orange-700 hover:text-orange-700"
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
        <p className="text-sm text-stone-500">Foto bersifat ilustrasi dan dapat berbeda dengan penyajian sebenarnya.</p>
        {menu.map((c) => (
          <section key={c.slug} id={c.slug} aria-labelledby={`h-${c.slug}`} className="scroll-mt-36">
            <Photo photoKey={categoryKey(c.slug)} alt={`Ilustrasi ${c.name}`} sizes="(min-width: 1152px) 1100px, 100vw" className="mb-5 h-40 w-full rounded-2xl sm:h-52" />
            <header className="mb-5">
              <h2 id={`h-${c.slug}`} className="flex items-center gap-2 text-2xl font-bold text-stone-900">
                {c.name}
                <span className="ml-1 text-sm font-medium text-stone-500">({c.items.length} menu)</span>
              </h2>
              <p className="mt-1 text-stone-600">{c.description}</p>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              {c.items.map((i) => (
                <MenuCard key={i.name} item={i} categorySlug={c.slug} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CtaBand
        title="Butuh pesanan dalam jumlah besar?"
        text="Kami melayani paket catering untuk arisan, meeting, dan acara perusahaan."
        message="Halo RasaLoka, saya ingin memesan menu dalam jumlah besar."
      />
      <JsonLd data={menuJsonLd} />
    </>
  );
}
