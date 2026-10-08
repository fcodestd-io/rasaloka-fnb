import { eq } from "drizzle-orm";
import type { Db } from "../index";
import { units } from "../schema";

export async function seedUnits(db: Db): Promise<void> {
  // Unit dasar
  await db.insert(units).values([
    { code: "g", name: "Gram" },
    { code: "ml", name: "Mililiter" },
    { code: "pcs", name: "Pieces" },
    { code: "porsi", name: "Porsi" },
    { code: "gelas", name: "Gelas" },
    { code: "botol", name: "Botol" },
  ]).onConflictDoNothing();

  const [g] = await db.select().from(units).where(eq(units.code, "g"));
  const [ml] = await db.select().from(units).where(eq(units.code, "ml"));
  if (!g || !ml) throw new Error("Unit dasar g/ml tidak ditemukan");

  // Unit turunan (konversi ke unit dasar)
  await db.insert(units).values([
    { code: "kg", name: "Kilogram", baseUnitId: g.id, factorToBase: "1000" },
    { code: "l", name: "Liter", baseUnitId: ml.id, factorToBase: "1000" },
  ]).onConflictDoNothing();
  console.log("  ✓ units");
}
