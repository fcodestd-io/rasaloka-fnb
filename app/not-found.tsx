import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      <UtensilsCrossed className="size-14 text-orange-700" aria-hidden="true" />
      <h1 className="text-3xl font-extrabold text-stone-900">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-stone-600">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">
        Kembali ke beranda
      </Link>
    </main>
  );
}
