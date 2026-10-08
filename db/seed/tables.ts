import type { Db } from "../index";
import { diningTables } from "../schema";

// 110 meja: Indoor A01-A60, Outdoor B01-B30, Lesehan/VIP C01-C20
export async function seedTables(db: Db): Promise<void> {
  const cap = (i: number, caps: readonly number[]): number => caps[i % caps.length] ?? 4;
  const rows: Array<typeof diningTables.$inferInsert> = [];
  const add = (prefix: string, count: number, zone: string, caps: readonly number[]): void => {
    for (let i = 0; i < count; i++) {
      rows.push({
        tableNumber: `${prefix}${String(i + 1).padStart(2, "0")}`,
        capacity: cap(i, caps),
        zone,
      });
    }
  };
  add("A", 60, "Indoor", [2, 4, 4, 6]);
  add("B", 30, "Outdoor", [2, 4, 4, 6]);
  add("C", 20, "Lesehan / VIP", [6, 8, 8, 10]);
  await db.insert(diningTables).values(rows).onConflictDoNothing();
  console.log(`  ✓ dining tables (${rows.length})`);
}
