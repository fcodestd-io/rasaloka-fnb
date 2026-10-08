import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-extrabold text-white">{site.name}</p>
          <p className="mt-2 text-sm">{site.tagline}. Dine-in, takeaway, dan catering event.</p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Jelajahi</h2>
          <ul className="space-y-2 text-sm">
            {[...nav.slice(1), { href: "/kontak", label: "Kontak" }, { href: "/kredit-foto", label: "Kredit foto" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Jam Buka</h2>
          <ul className="space-y-2 text-sm">
            {site.hours.map((h) => (
              <li key={h.days} className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{h.days}<br />{h.open} – {h.close} WIB</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Kontak</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${site.phoneIntl}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © {year} {site.name}. Restoran fiktif untuk keperluan portfolio.
      </div>
    </footer>
  );
}
