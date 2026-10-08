// Inventory: stock movement (append-only), stock adjustment (waste, damaged, opname, opening)
import { sql } from "drizzle-orm";
import {
  check, date, index, pgTable, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import { adjustmentStatus, adjustmentType, movementType } from "./enums";
import { money, pk, qty, stdCols, tz, unitCost } from "./helpers";
import { approvals, users } from "./identity";
import { ingredients, units } from "./master";

// Append-only: koreksi = movement baru (BR-INV-002)
export const stockMovements = pgTable("stock_movements", {
  id: pk(),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  movementType: movementType().notNull(),
  quantity: qty().notNull(), // bertanda: + masuk, - keluar (unit dasar)
  unitId: uuid().notNull().references(() => units.id),
  unitCost: unitCost().notNull(),
  totalCost: money().notNull(),
  balanceAfter: qty().notNull(),
  referenceType: varchar({ length: 40 }).notNull(), // ORDER_ITEM | GOODS_RECEIPT_ITEM | ...
  referenceId: uuid().notNull(),
  occurredAt: tz().notNull().defaultNow(),
  createdBy: uuid().notNull().references(() => users.id),
  notes: text(),
}, (t) => [
  check("stock_movements_qty_nonzero", sql`${t.quantity} <> 0`),
  index("stock_movements_ingredient_idx").on(t.ingredientId, t.occurredAt),
  index("stock_movements_reference_idx").on(t.referenceType, t.referenceId),
  // cegah konsumsi/penerimaan ganda untuk referensi yang sama
  uniqueIndex("stock_movements_ref_uq").on(t.referenceType, t.referenceId, t.ingredientId, t.movementType),
]);

export const stockAdjustments = pgTable("stock_adjustments", {
  ...stdCols(),
  adjustmentNumber: varchar({ length: 40 }).notNull(),
  adjustmentType: adjustmentType().notNull(),
  status: adjustmentStatus().notNull().default("DRAFT"),
  adjustmentDate: date().notNull(),
  reason: text().notNull(),
  totalValueAbs: money().notNull().default("0"),
  approvalId: uuid().references(() => approvals.id),
  createdBy: uuid().notNull().references(() => users.id),
  postedBy: uuid().references(() => users.id),
  postedAt: tz(),
}, (t) => [
  uniqueIndex("stock_adjustments_number_uq").on(t.adjustmentNumber),
  index("stock_adjustments_status_idx").on(t.status),
]);

export const stockAdjustmentItems = pgTable("stock_adjustment_items", {
  ...stdCols(),
  adjustmentId: uuid().notNull().references(() => stockAdjustments.id, { onDelete: "cascade" }),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  quantityDelta: qty().notNull(), // bertanda
  unitCost: unitCost().notNull(),
  value: money().notNull(),
  notes: text(),
}, (t) => [
  check("stock_adjustment_items_nonzero", sql`${t.quantityDelta} <> 0`),
  index("stock_adjustment_items_adj_idx").on(t.adjustmentId),
]);
