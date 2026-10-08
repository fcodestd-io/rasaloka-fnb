#!/usr/bin/env node
// scripts/fetch-images.mjs
// Mengunduh foto berlisensi bebas (Pexels) untuk setiap bagian website, menyimpannya di
// public/images/ dan mencatat kredit di content/images.generated.json.
//
//   1) Buat API key gratis: https://www.pexels.com/api/
//   2) .env.local:  PEXELS_API_KEY=xxxx
//   3) node --env-file=.env.local scripts/fetch-images.mjs [--only=hero,cat,item-nasi] [--force]
//
// Aman diulang: foto yang sudah ada dilewati (gunakan --force untuk mengganti).
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://api.pexels.com/v1/search";
const OUT_DIR = "public/images";
const JSON_PATH = "content/images.generated.json";
const WIDTH = 1200;
const HEIGHT = 627; // ukuran variant "landscape" Pexels

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = (args.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
const candidates = Number((args.find((a) => a.startsWith("--candidates=")) ?? "").slice(13)) || 8;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- daftar target: key -> kata kunci pencarian (Inggris, hasil lebih relevan) + alt ----------
const generic = [
  ["hero-1", "indonesian food table spread", "Aneka hidangan nusantara di meja"],
  ["hero-2", "nasi goreng fried rice egg", "Nasi goreng dengan telur"],
  ["hero-3", "chicken satay grilled skewers", "Sate ayam bakar"],
  ["hero-4", "cozy restaurant interior", "Interior restoran yang nyaman"],
  ["hero-5", "fried chicken rice plate", "Ayam goreng dengan nasi"],
  ["hero-6", "iced drinks glasses", "Aneka minuman dingin"],
  ["about-1", "chef cooking kitchen wok", "Koki memasak di dapur"],
  ["about-2", "spices herbs ingredients", "Rempah dan bahan segar"],
  ["about-3", "family dining restaurant table", "Keluarga makan bersama di restoran"],
  ["about-4", "wok stir fry flames", "Memasak dengan wajan api besar"],
  ["service-dine-in", "restaurant dining table served food", "Makan di tempat"],
  ["service-takeaway", "takeaway food packaging", "Makanan takeaway"],
  ["service-catering", "catering buffet food", "Catering prasmanan"],
  ["event-arisan", "women gathering lunch table", "Acara arisan"],
  ["event-hajatan", "celebration buffet feast", "Acara hajatan"],
  ["event-meeting", "business lunch meeting food", "Makan siang meeting"],
  ["event-gathering", "friends dinner table sharing food", "Gathering bersama teman"],
  ["event-corporate", "corporate event dinner", "Acara perusahaan"],
  ["cat-nasi-mie", "fried noodles rice dish", "Hidangan nasi dan mie"],
  ["cat-ayam-daging", "grilled chicken meat dish", "Hidangan ayam dan daging"],
  ["cat-ikan-seafood", "seafood platter", "Hidangan ikan dan seafood"],
  ["cat-sayur-sup", "vegetable soup bowl", "Sayur dan sup"],
  ["cat-camilan-lauk", "fried snacks appetizer", "Camilan dan lauk"],
  ["cat-minuman-dingin", "iced drinks refreshing", "Minuman dingin"],
  ["cat-minuman-panas", "hot coffee tea cups", "Minuman panas"],
  ["cat-dessert", "dessert sweet plate", "Dessert"],
];

// nama menu (harus sama dengan content/menu.ts) -> kata kunci
const items = [
  ["Nasi Goreng Kampung", "nasi goreng fried rice"], ["Nasi Goreng Seafood", "seafood fried rice"],
  ["Mie Goreng Spesial", "mie goreng fried noodles"], ["Kwetiau Goreng", "fried flat rice noodles"],
  ["Bihun Goreng", "fried vermicelli noodles"], ["Nasi Putih", "steamed white rice bowl"],
  ["Nasi Uduk", "coconut rice nasi uduk"], ["Mie Kuah Ayam", "chicken noodle soup"],
  ["Ayam Goreng Kremes", "indonesian fried chicken"], ["Ayam Bakar Madu", "grilled chicken honey"],
  ["Ayam Penyet", "fried chicken sambal"], ["Ayam Geprek", "crispy fried chicken chili"],
  ["Rendang Sapi", "beef rendang"], ["Sate Ayam (10 tusuk)", "chicken satay"],
  ["Sate Sapi (10 tusuk)", "beef satay skewers"], ["Iga Bakar", "grilled beef ribs"],
  ["Steak Sirloin", "sirloin steak"], ["Gurame Bakar", "grilled whole fish"],
  ["Gurame Asam Manis", "sweet and sour fish"], ["Nila Goreng", "fried fish"],
  ["Udang Goreng Tepung", "fried shrimp tempura"], ["Cumi Goreng Tepung", "fried calamari"],
  ["Cap Cay", "stir fried mixed vegetables"], ["Tumis Kangkung", "stir fried water spinach"],
  ["Pecel Sayur", "pecel vegetables peanut sauce"], ["Soto Ayam", "soto ayam chicken soup"],
  ["Sop Iga", "beef rib soup"], ["Sayur Asem", "vegetable soup tamarind"],
  ["Tahu Goreng", "fried tofu"], ["Tempe Mendoan", "fried tempeh"],
  ["Perkedel Kentang", "potato fritters"], ["Kentang Goreng", "french fries"],
  ["Chicken Wings", "chicken wings"], ["Pisang Goreng", "fried banana"],
  ["Singkong Goreng", "fried cassava"], ["Telur Dadar", "omelette"],
  ["Es Teh Manis", "iced tea"], ["Es Jeruk", "iced orange juice"],
  ["Es Lemon Tea", "iced lemon tea"], ["Es Alpukat", "avocado juice"],
  ["Es Kelapa Muda", "young coconut drink"], ["Es Campur", "es campur dessert drink"],
  ["Jus Mangga", "mango juice"], ["Jus Semangka", "watermelon juice"],
  ["Soda Gembira", "soda drink syrup"], ["Air Mineral Botol", "bottled water"],
  ["Kopi Hitam", "black coffee cup"], ["Kopi Susu", "iced milk coffee"],
  ["Teh Panas", "hot tea cup"], ["Wedang Jahe", "ginger tea"],
  ["Cokelat Panas", "hot chocolate"], ["Es Krim Vanila", "vanilla ice cream"],
  ["Pisang Cokelat Keju", "banana chocolate cheese"], ["Roti Bakar Cokelat", "chocolate toast"],
].map(([name, q]) => [`item-${slugify(name)}`, q, name]);

const targets = [...generic, ...items].map(([key, query, alt]) => ({ key, query, alt }));

// ---------- pemilihan foto paling relevan ----------
const STOP = new Set(["with", "and", "the", "plate", "dish", "food"]);
function keywords(query) {
  return [...new Set(query.toLowerCase().split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w)))];
}
export function pickBest(photos, query, usedIds) {
  const kws = keywords(query);
  let best = null;
  for (const p of photos) {
    if (usedIds.has(p.id)) continue; // jangan pakai foto yang sama untuk dua tempat
    const alt = (p.alt ?? "").toLowerCase();
    const score = kws.filter((k) => alt.includes(k)).length;
    if (!best || score > best.score) best = { photo: p, score };
  }
  return best;
}

async function main() {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("PEXELS_API_KEY belum diset. Buat key gratis di https://www.pexels.com/api/ lalu isi .env.local");
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const db = existsSync(JSON_PATH) ? JSON.parse(await readFile(JSON_PATH, "utf8")) : {};
  const used = new Set(Object.values(db).map((v) => v.pexelsId).filter(Boolean));
  const review = [];
  let done = 0, skipped = 0, failed = 0;

  const list = targets.filter((t) => only.length === 0 || only.some((o) => t.key.startsWith(o)));
  console.log(`Target: ${list.length} foto${force ? " (--force)" : ""}`);

  for (const t of list) {
    const file = path.join(OUT_DIR, `${t.key}.jpg`);
    if (!force && db[t.key] && existsSync(file)) { skipped++; continue; }

    const url = `${API}?query=${encodeURIComponent(t.query)}&per_page=${candidates}&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (res.status === 401 || res.status === 403) { console.error("API key ditolak. Periksa PEXELS_API_KEY."); break; }
    if (res.status === 429) { console.error("Batas permintaan Pexels tercapai. Jalankan ulang nanti (progres tersimpan)."); break; }
    if (!res.ok) { console.warn(`  ! ${t.key}: HTTP ${res.status}`); failed++; continue; }

    const data = await res.json();
    const best = pickBest(data.photos ?? [], t.query, used);
    if (!best) { console.warn(`  ! ${t.key}: tidak ada hasil untuk "${t.query}"`); failed++; continue; }

    const img = await fetch(best.photo.src.landscape);
    if (!img.ok) { console.warn(`  ! ${t.key}: gagal mengunduh gambar (${img.status})`); failed++; continue; }
    await writeFile(file, Buffer.from(await img.arrayBuffer()));

    db[t.key] = {
      src: `/images/${t.key}.jpg`, width: WIDTH, height: HEIGHT, alt: t.alt,
      credit: { name: best.photo.photographer, url: best.photo.photographer_url },
      sourceUrl: best.photo.url, pexelsId: best.photo.id,
    };
    used.add(best.photo.id);
    await writeFile(JSON_PATH, JSON.stringify(db, null, 2) + "\n"); // simpan tiap sukses (resumable)
    done++;
    if (best.score === 0) review.push(`${t.key} (“${t.query}”) -> ${best.photo.url}`);
    console.log(`  ✓ ${t.key}`);
    await sleep(250);
  }

  console.log(`\nSelesai: ${done} diunduh, ${skipped} dilewati, ${failed} gagal.`);
  if (review.length) {
    console.log("\nPeriksa manual (teks foto tidak cocok dengan kata kunci). Ganti file di public/images/ bila kurang pas:");
    review.forEach((r) => console.log("  - " + r));
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) main().catch((e) => { console.error(e); process.exit(1); });
