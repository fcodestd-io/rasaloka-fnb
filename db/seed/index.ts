// db/seed/index.ts — menjalankan SELURUH seed berurutan (idempotent)
//   pnpm db:seed   ->  tsx db/seed/index.ts
import { db, pool } from "../index";
import { seedAccounts } from "./accounts";
import { seedMenu } from "./menu";
import { seedOpeningStock } from "./opening-stock";
import { seedParties } from "./parties";
import { seedPeople } from "./people";
import { seedSettings } from "./settings";
import { seedTables } from "./tables";
import { seedUnits } from "./units";

export async function runSeed(): Promise<void> {
  console.log("Seeding RasaLoka …");
  await seedUnits(db); //          1. unit & konversi
  await seedAccounts(db); //       2. chart of accounts
  await seedSettings(db); //       3. system settings & document numbering
  await seedPeople(db); //         4. posisi, karyawan, user, salary history
  await seedParties(db); //        5. complaint/expense category, supplier, customer, template
  await seedMenu(db); //           6. ingredient, kategori, produk, recipe
  await seedTables(db); //         7. 110 meja
  await seedOpeningStock(db); //   8. saldo awal stok + jurnal JE-OPEN
  console.log("Selesai.");
}

runSeed()
  .then(() => pool.end())
  .catch(async (err: unknown) => {
    console.error("Seed gagal:", err);
    await pool.end();
    process.exit(1);
  });
