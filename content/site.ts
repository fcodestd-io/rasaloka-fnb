// Data situs statis. Ganti dengan data restoran asli bila dipakai sungguhan.
export const site = {
  name: "RasaLoka Kitchen & Eatery",
  shortName: "RasaLoka",
  tagline: "Cita rasa lokal, suasana hangat",
  description:
    "RasaLoka Kitchen & Eatery: restoran casual dining di Bandung dengan menu nusantara, layanan dine-in, takeaway, dan catering event untuk arisan, hajatan, meeting, serta gathering.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  phone: "022-0000000",
  phoneIntl: "+62220000000",
  whatsapp: "6281200000000", // format internasional tanpa +
  email: "halo@rasaloka.test",
  address: {
    street: "Jl. Contoh No. 1",
    city: "Bandung",
    region: "Jawa Barat",
    postalCode: "40111",
    country: "ID",
  },
  hours: [
    { days: "Senin – Jumat", open: "10:00", close: "22:00" },
    { days: "Sabtu – Minggu", open: "09:00", close: "23:00" },
  ],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bandung",
  instagram: "https://instagram.com/rasaloka",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/layanan", label: "Layanan" },
  { href: "/event", label: "Event & Catering" },
  { href: "/tentang", label: "Tentang" },
  { href: "/lokasi", label: "Lokasi" },
  { href: "/faq", label: "FAQ" },
] as const;
