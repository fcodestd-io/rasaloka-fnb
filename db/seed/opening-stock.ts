import { and, eq } from "drizzle-orm";
import type { Db } from "../index";
import {
  accounts, documentSequences, ingredients, journalEntries, journalLines,
  stockMovements, units, users,
} from "../schema";

// ID tetap supaya jurnal pembukaan idempotent (unique source_type + source_id + event_code)
const OPENING_SOURCE_ID = "00000000-0000-4000-8000-0000000000a1";

// Saldo awal (unit dasar) — default per unit, dengan pengecualian
const DEFAULT_QTY: Readonly<Record<string, number>> = { g: 15000, ml: 10000, pcs: 100 };
const OVERRIDE_QTY: Readonly<Record<string, number>> = {
  "Telur Ayam": 300, "Teh Celup": 500, "Roti Tawar": 60, "Tahu": 100, "Bakso Sapi": 200,
  "Sosis Ayam": 100, "Kelapa Muda": 40, "Es Batu": 50000, "Air Mineral": 100000,
  "Beras": 50000, "Minyak Goreng": 30000,
};

export async function seedOpeningStock(db: Db): Promise<void> {
  const done = await db.select({ id: journalEntries.id }).from(journalEntries)
    .where(and(eq(journalEntries.sourceType, "OPENING"), eq(journalEntries.sourceId, OPENING_SOURCE_ID)))
    .limit(1);
  if (done.length > 0) { console.log("  • opening stock sudah ada, dilewati"); return; }

  const [manager] = await db.select().from(users).where(eq(users.role, "MANAGER")).limit(1);
  const acc = new Map((await db.select().from(accounts)).map((a) => [a.systemKey, a.id]));
  const inventoryAcc = acc.get("INVENTORY");
  const equityAcc = acc.get("OWNER_EQUITY");
  if (!manager || !inventoryAcc || !equityAcc) throw new Error("Seed users/accounts belum tersedia");

  const ings = await db.select().from(ingredients);
  const unitCode = new Map<string, string>(); // unitId -> code
  for (const u of await db.select().from(units)) unitCode.set(u.id, u.code);

  const today = new Date().toISOString().slice(0, 10);
  const year = today.slice(0, 4);

  await db.transaction(async (tx) => {
    let total = 0;
    const movements: Array<typeof stockMovements.$inferInsert> = [];

    for (const ing of ings) {
      const cost = Number(ing.avgCost);
      if (cost <= 0 || Number(ing.currentQty) > 0) continue; // hanya ingredient baru
      const code = unitCode.get(ing.unitId) ?? "g";
      const q = OVERRIDE_QTY[ing.name] ?? DEFAULT_QTY[code] ?? 0;
      if (q <= 0) continue;
      const value = Math.round(q * cost * 100) / 100;
      total += value;

      movements.push({
        ingredientId: ing.id, movementType: "OPENING_BALANCE",
        quantity: String(q), unitId: ing.unitId, unitCost: String(cost),
        totalCost: value.toFixed(2), balanceAfter: String(q),
        referenceType: "OPENING", referenceId: ing.id, createdBy: manager.id,
        notes: "Saldo awal (seed)",
      });
      await tx.update(ingredients).set({
        currentQty: String(q), safetyStock: String(Math.round(q * 0.2)),
      }).where(eq(ingredients.id, ing.id));
    }
    if (movements.length > 0) await tx.insert(stockMovements).values(movements);

    if (total > 0) {
      const [entry] = await tx.insert(journalEntries).values({
        entryNumber: `JV/${year}/000001`, entryDate: today,
        sourceType: "OPENING", sourceId: OPENING_SOURCE_ID, eventCode: "OPEN",
        description: "Saldo awal persediaan (JE-OPEN)", totalAmount: total.toFixed(2),
        postedBy: manager.id,
      }).returning({ id: journalEntries.id });
      if (!entry) throw new Error("Gagal membuat jurnal pembukaan");
      await tx.insert(journalLines).values([
        { entryId: entry.id, lineNo: 1, accountId: inventoryAcc, debit: total.toFixed(2), credit: "0", memo: "Inventory" },
        { entryId: entry.id, lineNo: 2, accountId: equityAcc, debit: "0", credit: total.toFixed(2), memo: "Owner Equity" },
      ]);
      await tx.insert(documentSequences).values({ docType: "JOURNAL", periodKey: year, lastNumber: 1 })
        .onConflictDoNothing();
    }
    console.log(`  ✓ opening stock: ${movements.length} ingredient, nilai Rp${Math.round(total).toLocaleString("id-ID")}`);
  });
}
