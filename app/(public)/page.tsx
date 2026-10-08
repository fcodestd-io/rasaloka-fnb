import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CalendarHeart, ChefHat, Clock, Leaf, MapPin, ShoppingBag, Users, UtensilsCrossed,
} from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { LinkButton } from "@/components/public/link-button";
import { MenuCard } from "@/components/public/menu-card";
import { Photo } from "@/components/public/photo";
import { Section } from "@/components/public/section";
import { allItems, featuredItems } from "@/content/menu";
import { eventTypes } from "@/content/event";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: `${site.name} — ${site.tagline}`, description: site.description },
};

const highlights = [
  { icon: ChefHat, title: "Dimasak segar", text: "Setiap pesanan dimasak saat dipesan dengan bahan pilihan." },
  { icon: Leaf, title: "Bahan berkualitas", text: "Bumbu dan bahan baku dari pemasok tepercaya, dicek setiap penerimaan." },
  { icon: Users, title: "100+ meja", text: "Area indoor, outdoor, dan lesehan/VIP untuk keluarga maupun rombongan." },
  { icon: CalendarHeart, title: "Siap untuk event", text: "Paket arisan, hajatan, meeting, dan gathering dengan harga transparan." },
] as const;

const services = [
  { icon: UtensilsCrossed, title: "Dine-in", text: "Makan di tempat dengan suasana hangat dan pelayanan cepat.", href: "/layanan" },
  { icon: ShoppingBag, title: "Takeaway", text: "Pesan dan bawa pulang, siap saat Anda tiba.", href: "/layanan" },
  { icon: CalendarHeart, title: "Event & Catering", text: "Paket lengkap untuk acara dari 15 hingga ratusan tamu.", href: "/event" },
] as const;

const testimonials = [
  { name: "Sinta, ibu rumah tangga", text: "Arisan kami diurus rapi dari awal. Makanan datang tepat waktu dan semua tamu puas." },
  { name: "Bayu, staf HR", text: "Paket meeting-nya praktis. Harga jelas, rasa konsisten setiap kali pesan." },
  { name: "Maya, pengunjung", text: "Ayam gepreknya juara, tempatnya luas dan nyaman untuk makan bersama keluarga." },
] as const;

export default function HomePage() {
  const featured = featuredItems(6);
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800">
              Restoran casual dining · Bandung
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
              Cita rasa lokal, <span className="text-orange-700">suasana hangat</span> untuk setiap momen.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              Dari nasi goreng kampung hingga rendang sapi, nikmati {allItems().length}+ pilihan menu nusantara.
              Makan di tempat, bawa pulang, atau percayakan acara Anda pada kami.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/menu">Lihat Menu <ArrowRight className="size-4" aria-hidden="true" /></LinkButton>
              <LinkButton href="/event" variant="outline">Pesan Event & Catering</LinkButton>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              {[
                { k: "100+", v: "Meja tersedia" },
                { k: `${allItems().length}+`, v: "Pilihan menu" },
                { k: "5", v: "Jenis event" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl bg-white/70 p-3 shadow-sm ring-1 ring-orange-100">
                  <dt className="sr-only">{s.v}</dt>
                  <dd className="text-2xl font-extrabold text-orange-700">{s.k}</dd>
                  <dd className="text-xs text-stone-600">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-3 gap-3 pb-4">
            {["hero-1", "hero-2", "hero-3", "hero-4", "hero-5", "hero-6"].map((k, i) => (
              <Photo
                key={k}
                photoKey={k}
                sizes="(min-width: 1024px) 18vw, 30vw"
                priority={i < 3}
                className={`aspect-[3/4] rounded-3xl shadow-sm ${i % 2 === 1 ? "translate-y-4" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Mengapa RasaLoka" title="Dibuat dengan sepenuh rasa" tone="plain">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-stone-200 p-5">
              <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold text-stone-900">{title}</h3>
              <p className="mt-1 text-sm text-stone-600">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Menu favorit" title="Yang paling sering dipesan" subtitle="Pilihan andalan pelanggan kami." tone="soft">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((i) => (
            <MenuCard key={i.name} item={i} categorySlug={i.categorySlug} />
          ))}
        </div>
        <div className="mt-8">
          <LinkButton href="/menu" variant="outline">Lihat seluruh menu <ArrowRight className="size-4" aria-hidden="true" /></LinkButton>
        </div>
      </Section>

      <Section eyebrow="Layanan" title="Cara menikmati RasaLoka">
        <div className="grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl border border-stone-200 p-6 transition-shadow hover:shadow-md"
            >
              <Icon className="mb-4 size-8 text-orange-700" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
              <p className="mt-1 text-sm text-stone-600">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-700">
                Selengkapnya <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Event & Catering" title="Untuk setiap jenis acara" tone="soft">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {eventTypes.map((e) => (
            <li key={e.name} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-stone-200">
              <Photo photoKey={`event-${e.slug}`} alt={e.name} sizes="(min-width: 1024px) 18vw, 45vw" className="mb-3 aspect-[4/3] w-full rounded-xl" />
              <h3 className="font-semibold text-stone-900">{e.name}</h3>
              <p className="mt-1 text-sm text-stone-600">{e.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Kata mereka" title="Pengalaman pelanggan" subtitle="Contoh testimoni (fiktif untuk keperluan demo).">
        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="h-full rounded-2xl border border-stone-200 p-6">
                <blockquote className="text-stone-700">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-stone-900">{t.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Kunjungi kami hari ini</h2>
            <ul className="mt-5 space-y-3 text-stone-300">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-orange-400" aria-hidden="true" />
                {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
              </li>
              {site.hours.map((h) => (
                <li key={h.days} className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-orange-400" aria-hidden="true" />
                  {h.days}: {h.open} – {h.close} WIB
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <LinkButton href="/lokasi" variant="light">Lihat lokasi</LinkButton>
            <LinkButton href="/kontak" variant="outline" className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10">
              Hubungi kami
            </LinkButton>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
