// Konten statis halaman Event & Catering.
export interface EventPackage {
  name: string;
  forWho: string;
  pricePerPax: number;
  minPax: number;
  includes: string[];
}

export const eventTypes = [
  { name: "Arisan", slug: "arisan", text: "Kumpul rutin yang nyaman dengan hidangan prasmanan." },
  { name: "Hajatan", slug: "hajatan", text: "Syukuran, aqiqah, khitanan, dan perayaan keluarga." },
  { name: "Meeting", slug: "meeting", text: "Makan siang dan coffee break untuk rapat dan seminar." },
  { name: "Gathering", slug: "gathering", text: "Reuni, komunitas, dan acara santai bersama teman." },
  { name: "Corporate", slug: "corporate", text: "Acara perusahaan, townhall, dan jamuan klien." },
] as const;

export const packages: readonly EventPackage[] = [
  {
    name: "Paket Arisan", forWho: "Arisan dan kumpul keluarga", pricePerPax: 65000, minPax: 20,
    includes: ["Nasi putih dan 2 lauk utama", "Sayur dan camilan", "Es teh manis / teh panas", "Penataan prasmanan"],
  },
  {
    name: "Paket Meeting", forWho: "Rapat dan seminar", pricePerPax: 55000, minPax: 15,
    includes: ["Makan siang 1 lauk utama", "Coffee break (kopi/teh dan camilan)", "Air mineral", "Pengantaran tepat waktu"],
  },
  {
    name: "Paket Hajatan", forWho: "Syukuran dan perayaan keluarga", pricePerPax: 95000, minPax: 50,
    includes: ["Nasi dan 3 lauk utama", "Sayur, camilan, dan dessert", "Aneka minuman dingin", "Tim penyaji dan penataan"],
  },
  {
    name: "Paket Corporate", forWho: "Acara perusahaan dan jamuan klien", pricePerPax: 120000, minPax: 40,
    includes: ["Menu pembuka, utama, dan dessert", "Pilihan steak / iga / seafood", "Minuman dingin dan panas", "Koordinator acara"],
  },
];

export const steps = [
  { title: "Konsultasi", text: "Ceritakan jenis acara, tanggal, dan jumlah tamu melalui WhatsApp atau telepon." },
  { title: "Penawaran & menu", text: "Kami menyusun paket dan rincian harga sesuai kebutuhan dan anggaran Anda." },
  { title: "Kontrak & DP", text: "Tanggal dikunci dengan kontrak dan uang muka (DP) sesuai kesepakatan." },
  { title: "Persiapan", text: "Tim dapur menyiapkan bahan dan menu segar mendekati hari acara." },
  { title: "Hari acara", text: "Hidangan disajikan tepat waktu; pelunasan mengikuti jadwal pada kontrak." },
] as const;
