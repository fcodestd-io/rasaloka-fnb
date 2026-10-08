import type { Db } from "../index";
import {
  ingredients, productCategories, products, recipeItems, units,
} from "../schema";

// Ingredient: "Nama|unit dasar|biaya per unit dasar (Rp)"
const INGREDIENTS = `
Beras|g|13
Mie Telur|g|22
Bihun|g|25
Kwetiau|g|24
Tepung Terigu|g|12
Tepung Tapioka|g|14
Tepung Panir|g|30
Kentang|g|18
Singkong|g|8
Roti Tawar|pcs|1500
Ayam Potong|g|38
Dada Ayam Fillet|g|45
Daging Sapi Sirloin|g|140
Daging Sapi Sandung Lamur|g|110
Iga Sapi|g|120
Ikan Gurame|g|55
Ikan Nila|g|38
Udang|g|85
Cumi|g|70
Telur Ayam|pcs|2200
Tahu|pcs|1000
Tempe|g|14
Bakso Sapi|pcs|2500
Sosis Ayam|pcs|3000
Kangkung|g|12
Bayam|g|10
Sawi Hijau|g|11
Kol|g|9
Wortel|g|12
Tomat|g|14
Timun|g|10
Buncis|g|16
Jagung Manis|g|8
Brokoli|g|25
Jamur Tiram|g|22
Daun Bawang|g|20
Seledri|g|30
Selada|g|18
Kecambah|g|9
Labu Siam|g|8
Terong|g|10
Kemangi|g|25
Kembang Kol|g|14
Bawang Merah|g|35
Bawang Putih|g|32
Bawang Bombay|g|22
Cabai Merah|g|45
Cabai Rawit|g|60
Jahe|g|25
Kunyit|g|20
Lengkuas|g|18
Serai|g|12
Kemiri|g|80
Ketumbar|g|70
Merica|g|150
Garam|g|8
Gula Pasir|g|15
Gula Merah|g|18
Kecap Manis|ml|18
Kecap Asin|ml|25
Saus Tiram|ml|40
Saus Tomat|ml|20
Saus Sambal|ml|22
Terasi|g|50
Kaldu Bubuk|g|60
Asam Jawa|g|20
Santan|ml|20
Minyak Goreng|ml|17
Mentega|g|90
Cuka|ml|8
Daun Jeruk|g|60
Bumbu Dasar Putih|g|30
Bumbu Dasar Merah|g|35
Bumbu Dasar Kuning|g|33
Bumbu Rendang|g|70
Bumbu Soto|g|50
Bumbu Kacang|g|55
Kacang Tanah|g|40
Teh Celup|pcs|700
Kopi Bubuk|g|150
Susu Cair|ml|18
Susu Kental Manis|ml|25
Krimer|g|40
Sirup Markisa|ml|30
Jeruk Nipis|g|25
Jeruk Peras|g|22
Lemon|g|35
Alpukat|g|30
Mangga|g|20
Semangka|g|8
Melon|g|12
Nanas|g|10
Pisang|g|10
Es Batu|g|2
Air Mineral|ml|3
Cokelat Bubuk|g|110
Cincau|g|15
Kelapa Muda|pcs|9000
Gula Cair|ml|14
Soda|ml|10
Es Krim Vanila|g|35
Cokelat Batang|g|90
Keju Cheddar|g|120
Keju Mozarella|g|130
Madu|ml|90
`;

// Menu per kategori. Item: "Nama|harga|Ingredient:qty;Ingredient:qty" (qty per 1 porsi/gelas)
interface Group { category: string; unit: "porsi" | "gelas" | "botol"; items: string }
const MENU: readonly Group[] = [
  { category: "Nasi & Mie", unit: "porsi", items: `
Nasi Goreng Kampung|28000|Beras:150;Telur Ayam:1;Minyak Goreng:20;Bumbu Dasar Merah:30
Nasi Goreng Seafood|38000|Beras:150;Udang:50;Cumi:40;Telur Ayam:1;Minyak Goreng:20;Bumbu Dasar Merah:30
Mie Goreng Spesial|30000|Mie Telur:120;Telur Ayam:1;Sawi Hijau:30;Bakso Sapi:2;Minyak Goreng:20;Kecap Manis:15;Bumbu Dasar Putih:20
Kwetiau Goreng|32000|Kwetiau:130;Udang:30;Kecambah:30;Telur Ayam:1;Minyak Goreng:20;Kecap Manis:15
Bihun Goreng|27000|Bihun:100;Wortel:20;Sawi Hijau:30;Telur Ayam:1;Minyak Goreng:20;Bumbu Dasar Putih:20
Nasi Putih|6000|Beras:150
Nasi Uduk|12000|Beras:150;Santan:50;Daun Jeruk:2;Serai:5
Mie Kuah Ayam|26000|Mie Telur:120;Ayam Potong:60;Sawi Hijau:30;Bumbu Dasar Putih:20;Kaldu Bubuk:3
` },
  { category: "Ayam & Daging", unit: "porsi", items: `
Ayam Goreng Kremes|32000|Ayam Potong:200;Bumbu Dasar Kuning:40;Tepung Tapioka:20;Minyak Goreng:80
Ayam Bakar Madu|34000|Ayam Potong:200;Bumbu Dasar Kuning:40;Madu:15;Kecap Manis:20;Mentega:10
Ayam Penyet|30000|Ayam Potong:200;Bumbu Dasar Kuning:40;Cabai Rawit:20;Tomat:20;Minyak Goreng:80
Ayam Geprek|28000|Dada Ayam Fillet:150;Tepung Panir:50;Cabai Rawit:25;Bawang Putih:10;Minyak Goreng:80
Rendang Sapi|45000|Daging Sapi Sandung Lamur:150;Bumbu Rendang:50;Santan:100
Sate Ayam (10 tusuk)|32000|Dada Ayam Fillet:150;Bumbu Kacang:50;Kecap Manis:20;Bawang Merah:10
Sate Sapi (10 tusuk)|42000|Daging Sapi Sirloin:150;Bumbu Kacang:50;Kecap Manis:20;Bawang Merah:10
Iga Bakar|65000|Iga Sapi:300;Kecap Manis:30;Bumbu Dasar Merah:30;Mentega:10
Steak Sirloin|78000|Daging Sapi Sirloin:200;Kentang:100;Brokoli:50;Wortel:30;Mentega:15
` },
  { category: "Ikan & Seafood", unit: "porsi", items: `
Gurame Bakar|75000|Ikan Gurame:600;Bumbu Dasar Merah:50;Kecap Manis:30;Jeruk Nipis:20
Gurame Asam Manis|78000|Ikan Gurame:600;Tepung Tapioka:50;Saus Tomat:60;Nanas:40;Minyak Goreng:150
Nila Goreng|38000|Ikan Nila:350;Bumbu Dasar Kuning:30;Minyak Goreng:100
Udang Goreng Tepung|48000|Udang:200;Tepung Panir:60;Telur Ayam:1;Minyak Goreng:100
Cumi Goreng Tepung|42000|Cumi:200;Tepung Panir:60;Telur Ayam:1;Minyak Goreng:100
` },
  { category: "Sayur & Sup", unit: "porsi", items: `
Cap Cay|28000|Wortel:40;Kembang Kol:50;Sawi Hijau:50;Jamur Tiram:30;Udang:30;Saus Tiram:20;Bawang Putih:10;Minyak Goreng:20
Tumis Kangkung|18000|Kangkung:150;Bawang Putih:10;Cabai Merah:10;Saus Tiram:15;Minyak Goreng:20
Pecel Sayur|20000|Bayam:60;Kecambah:40;Buncis:40;Kol:40;Bumbu Kacang:60;Tahu:1
Soto Ayam|26000|Ayam Potong:100;Bumbu Soto:30;Bihun:30;Kecambah:20;Telur Ayam:1;Seledri:5
Sop Iga|58000|Iga Sapi:250;Wortel:40;Kentang:60;Kol:40;Bawang Putih:10;Daun Bawang:10
Sayur Asem|18000|Jagung Manis:50;Labu Siam:40;Buncis:30;Asam Jawa:15;Gula Merah:10;Bumbu Dasar Merah:20
` },
  { category: "Camilan & Lauk", unit: "porsi", items: `
Tahu Goreng|12000|Tahu:3;Minyak Goreng:40;Bumbu Dasar Putih:10
Tempe Mendoan|12000|Tempe:120;Tepung Terigu:40;Daun Bawang:10;Minyak Goreng:60
Perkedel Kentang|14000|Kentang:150;Telur Ayam:1;Daun Bawang:10;Minyak Goreng:50
Kentang Goreng|18000|Kentang:200;Minyak Goreng:120;Garam:3
Chicken Wings|28000|Ayam Potong:200;Tepung Panir:40;Saus Sambal:20;Minyak Goreng:100
Pisang Goreng|15000|Pisang:200;Tepung Terigu:50;Minyak Goreng:80;Gula Pasir:10
Singkong Goreng|14000|Singkong:200;Minyak Goreng:80;Garam:3
Telur Dadar|10000|Telur Ayam:2;Minyak Goreng:20;Daun Bawang:5
` },
  { category: "Minuman Dingin", unit: "gelas", items: `
Es Teh Manis|8000|Teh Celup:1;Gula Cair:25;Es Batu:150;Air Mineral:250
Es Jeruk|12000|Jeruk Peras:150;Gula Cair:25;Es Batu:150
Es Lemon Tea|14000|Teh Celup:1;Lemon:30;Gula Cair:25;Es Batu:150;Air Mineral:250
Es Alpukat|18000|Alpukat:150;Susu Kental Manis:30;Susu Cair:100;Es Batu:100
Es Kelapa Muda|16000|Kelapa Muda:1;Gula Cair:20;Es Batu:100
Es Campur|18000|Cincau:40;Melon:40;Semangka:40;Susu Kental Manis:30;Sirup Markisa:20;Es Batu:120
Jus Mangga|17000|Mangga:200;Gula Cair:20;Es Batu:100;Air Mineral:100
Jus Semangka|15000|Semangka:250;Gula Cair:15;Es Batu:100
Soda Gembira|16000|Soda:200;Susu Kental Manis:30;Sirup Markisa:20;Es Batu:100
` },
  { category: "Minuman Panas", unit: "gelas", items: `
Kopi Hitam|10000|Kopi Bubuk:12;Gula Pasir:10;Air Mineral:200
Kopi Susu|15000|Kopi Bubuk:12;Susu Cair:100;Gula Cair:20;Air Mineral:100
Teh Panas|7000|Teh Celup:1;Gula Pasir:10;Air Mineral:250
Wedang Jahe|12000|Jahe:20;Gula Merah:15;Air Mineral:250;Serai:5
Cokelat Panas|17000|Cokelat Bubuk:25;Susu Cair:200;Gula Pasir:10
` },
  { category: "Minuman Botol", unit: "botol", items: `
Air Mineral Botol|5000|Air Mineral:600
` },
  { category: "Dessert", unit: "porsi", items: `
Es Krim Vanila|14000|Es Krim Vanila:100
Pisang Cokelat Keju|20000|Pisang:150;Cokelat Batang:30;Keju Cheddar:20;Tepung Terigu:30;Minyak Goreng:60
Roti Bakar Cokelat|18000|Roti Tawar:3;Mentega:10;Cokelat Batang:30;Susu Kental Manis:15
` },
];

const lines = (s: string): string[] => s.split("\n").map((l) => l.trim()).filter(Boolean);

export async function seedMenu(db: Db): Promise<void> {
  const unitId = new Map((await db.select().from(units)).map((u) => [u.code, u.id]));
  const uid = (code: string): string => {
    const v = unitId.get(code);
    if (!v) throw new Error(`Unit tidak ditemukan: ${code} (jalankan seedUnits dulu)`);
    return v;
  };

  // Ingredient (stok awal 0; saldo diisi oleh opening-stock)
  await db.insert(ingredients).values(
    lines(INGREDIENTS).map((l) => {
      const [name = "", unit = "", cost = "0"] = l.split("|");
      return { name, unitId: uid(unit), avgCost: cost, lastPurchaseCost: cost };
    }),
  ).onConflictDoNothing();
  const ingId = new Map((await db.select().from(ingredients)).map((i) => [i.name, i.id]));

  // Kategori produk
  await db.insert(productCategories).values(
    MENU.map((g, i) => ({ name: g.category, sortOrder: i + 1 })),
  ).onConflictDoNothing();
  const catId = new Map((await db.select().from(productCategories)).map((c) => [c.name, c.id]));

  // Produk
  const parsed = MENU.flatMap((g) =>
    lines(g.items).map((l) => {
      const [name = "", price = "0", recipe = ""] = l.split("|");
      const categoryId = catId.get(g.category);
      if (!categoryId) throw new Error(`Kategori tidak ditemukan: ${g.category}`);
      return { name, price, recipe, categoryId, unit: g.unit };
    }),
  );
  await db.insert(products).values(
    parsed.map((p) => ({ name: p.name, categoryId: p.categoryId, unitId: uid(p.unit), sellingPrice: p.price })),
  ).onConflictDoNothing();
  const prodId = new Map((await db.select().from(products)).map((p) => [p.name, p.id]));

  // Recipe / BOM
  const recipeRows: Array<typeof recipeItems.$inferInsert> = [];
  for (const p of parsed) {
    const productId = prodId.get(p.name);
    if (!productId) throw new Error(`Produk tidak ditemukan: ${p.name}`);
    for (const part of p.recipe.split(";")) {
      const [iname = "", q = "0"] = part.split(":");
      const ingredientId = ingId.get(iname);
      if (!ingredientId) throw new Error(`Ingredient "${iname}" pada recipe "${p.name}" tidak ada`);
      recipeRows.push({ productId, ingredientId, quantity: q });
    }
  }
  await db.insert(recipeItems).values(recipeRows).onConflictDoNothing();

  console.log(`  ✓ menu: ${ingId.size} ingredients, ${catId.size} categories, ${prodId.size} products, ${recipeRows.length} recipe items`);
}
