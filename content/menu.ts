// Katalog menu statis (selaras dengan seed database RasaLoka).
export interface MenuItem {
  name: string;
  price: number; // Rupiah
  description: string;
  bestSeller: boolean;
  spicy: boolean;
}

export interface MenuCategory {
  slug: string;
  name: string;
  description: string;
  items: MenuItem[];
}

// flags: "b" = best seller, "p" = pedas
function item(name: string, price: number, description: string, flags = ""): MenuItem {
  return { name, price, description, bestSeller: flags.includes("b"), spicy: flags.includes("p") };
}

export const menu: readonly MenuCategory[] = [
  {
    slug: "nasi-mie", name: "Nasi & Mie",
    description: "Hidangan utama yang mengenyangkan, dimasak dengan api besar.",
    items: [
      item("Nasi Goreng Kampung", 28000, "Nasi goreng bumbu rempah dengan telur dan kerupuk.", "b"),
      item("Nasi Goreng Seafood", 38000, "Udang dan cumi segar dalam nasi goreng yang wangi."),
      item("Mie Goreng Spesial", 30000, "Mie telur wok dengan bakso, sawi, dan telur."),
      item("Kwetiau Goreng", 32000, "Kwetiau kenyal dengan udang dan tauge."),
      item("Bihun Goreng", 27000, "Bihun goreng sayuran, ringan dan gurih."),
      item("Nasi Putih", 6000, "Nasi putih pulen."),
      item("Nasi Uduk", 12000, "Nasi gurih santan dengan aroma daun jeruk dan serai."),
      item("Mie Kuah Ayam", 26000, "Mie telur dalam kuah kaldu ayam yang hangat."),
    ],
  },
  {
    slug: "ayam-daging", name: "Ayam & Daging",
    description: "Ayam dan daging pilihan: goreng, bakar, hingga rendang.",
    items: [
      item("Ayam Goreng Kremes", 32000, "Ayam bumbu kuning dengan taburan kremes renyah.", "b"),
      item("Ayam Bakar Madu", 34000, "Ayam bakar dengan olesan madu dan kecap."),
      item("Ayam Penyet", 30000, "Ayam goreng dipenyet bersama sambal segar.", "p"),
      item("Ayam Geprek", 28000, "Ayam crispy digeprek dengan sambal bawang.", "bp"),
      item("Rendang Sapi", 45000, "Daging sapi dimasak perlahan dalam santan dan rempah.", "b"),
      item("Sate Ayam (10 tusuk)", 32000, "Sate ayam dengan bumbu kacang dan kecap."),
      item("Sate Sapi (10 tusuk)", 42000, "Sate daging sapi empuk dengan bumbu kacang."),
      item("Iga Bakar", 65000, "Iga sapi empuk dibakar dengan bumbu manis gurih."),
      item("Steak Sirloin", 78000, "Sirloin panggang dengan kentang, brokoli, dan wortel."),
    ],
  },
  {
    slug: "ikan-seafood", name: "Ikan & Seafood",
    description: "Hasil laut dan ikan air tawar yang selalu segar.",
    items: [
      item("Gurame Bakar", 75000, "Gurame utuh bakar dengan bumbu merah dan jeruk nipis.", "b"),
      item("Gurame Asam Manis", 78000, "Gurame goreng berbalut saus asam manis dan nanas."),
      item("Nila Goreng", 38000, "Ikan nila goreng bumbu kuning, gurih dan renyah."),
      item("Udang Goreng Tepung", 48000, "Udang berbalut tepung panir, garing di luar."),
      item("Cumi Goreng Tepung", 42000, "Cumi empuk digoreng dengan tepung renyah."),
    ],
  },
  {
    slug: "sayur-sup", name: "Sayur & Sup",
    description: "Sayuran segar dan sup hangat untuk menyeimbangkan hidangan.",
    items: [
      item("Cap Cay", 28000, "Tumis aneka sayuran dengan udang dan saus tiram."),
      item("Tumis Kangkung", 18000, "Kangkung tumis bawang putih dan cabai."),
      item("Pecel Sayur", 20000, "Sayuran rebus dengan bumbu kacang dan tahu."),
      item("Soto Ayam", 26000, "Soto kuning dengan suwiran ayam, bihun, dan telur.", "b"),
      item("Sop Iga", 58000, "Iga sapi dalam kuah bening dengan sayuran."),
      item("Sayur Asem", 18000, "Sayur asem segar dengan jagung dan labu siam."),
    ],
  },
  {
    slug: "camilan-lauk", name: "Camilan & Lauk",
    description: "Teman makan dan camilan untuk berbagi di meja.",
    items: [
      item("Tahu Goreng", 12000, "Tahu goreng garing dengan bumbu gurih."),
      item("Tempe Mendoan", 12000, "Tempe tipis berbalut tepung berbumbu daun bawang."),
      item("Perkedel Kentang", 14000, "Perkedel kentang lembut dengan daun bawang."),
      item("Kentang Goreng", 18000, "Kentang goreng renyah."),
      item("Chicken Wings", 28000, "Sayap ayam crispy dengan saus sambal.", "p"),
      item("Pisang Goreng", 15000, "Pisang goreng hangat berbalut tepung renyah."),
      item("Singkong Goreng", 14000, "Singkong goreng gurih dan empuk."),
      item("Telur Dadar", 10000, "Telur dadar dengan irisan daun bawang."),
    ],
  },
  {
    slug: "minuman-dingin", name: "Minuman Dingin",
    description: "Pelepas dahaga: teh, jus, dan es-es segar.",
    items: [
      item("Es Teh Manis", 8000, "Teh manis dingin klasik.", "b"),
      item("Es Jeruk", 12000, "Perasan jeruk segar dengan es."),
      item("Es Lemon Tea", 14000, "Teh dengan perasan lemon."),
      item("Es Alpukat", 18000, "Alpukat creamy dengan susu kental manis."),
      item("Es Kelapa Muda", 16000, "Kelapa muda segar dengan sirup gula."),
      item("Es Campur", 18000, "Cincau, melon, semangka, susu, dan sirup markisa."),
      item("Jus Mangga", 17000, "Jus mangga manis tanpa pengawet."),
      item("Jus Semangka", 15000, "Jus semangka dingin menyegarkan."),
      item("Soda Gembira", 16000, "Soda, susu kental manis, dan sirup markisa."),
      item("Air Mineral Botol", 5000, "Air mineral botol."),
    ],
  },
  {
    slug: "minuman-panas", name: "Minuman Panas",
    description: "Hangatkan suasana dengan kopi, teh, dan wedang.",
    items: [
      item("Kopi Hitam", 10000, "Kopi hitam tubruk dengan gula."),
      item("Kopi Susu", 15000, "Kopi dengan susu segar dan gula cair."),
      item("Teh Panas", 7000, "Teh panas manis."),
      item("Wedang Jahe", 12000, "Jahe, gula merah, dan serai yang menghangatkan."),
      item("Cokelat Panas", 17000, "Cokelat susu hangat."),
    ],
  },
  {
    slug: "dessert", name: "Dessert",
    description: "Penutup manis untuk akhir santap.",
    items: [
      item("Es Krim Vanila", 14000, "Es krim vanila lembut."),
      item("Pisang Cokelat Keju", 20000, "Pisang goreng dengan cokelat dan keju."),
      item("Roti Bakar Cokelat", 18000, "Roti bakar mentega dengan cokelat dan susu."),
    ],
  },
];

export function allItems(): MenuItem[] {
  return menu.flatMap((c) => c.items);
}

export function featuredItems(limit = 6): Array<MenuItem & { categorySlug: string; category: string }> {
  return menu
    .flatMap((c) => c.items.filter((i) => i.bestSeller).map((i) => ({ ...i, categorySlug: c.slug, category: c.name })))
    .slice(0, limit);
}
