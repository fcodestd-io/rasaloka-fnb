// Minimal MRP: demand -> gross -> net -> rekomendasi pembelian
import { sql } from "drizzle-orm";
import {
  check, date, integer, jsonb, pgTable, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import { mrpDemandSource, mrpLineStatus, mrpRunStatus } from "./enums";
import { qty, stdCols } from "./helpers";
import { users } from "./identity";
import { ingredients, products, units } from "./master";
import { eventContracts } from "./sales";

export const mrpRuns = pgTable("mrp_runs", {
  ...stdCols(),
  runNumber: varchar({ length: 40 }).notNull(),
  periodStart: date().notNull(),
  periodEnd: date().notNull(),
  status: mrpRunStatus().notNull().default("DRAFT"),
  parameters: jsonb(), // opsi run (sertakan event, cut-off scheduled receipt)
  createdBy: uuid().notNull().references(() => users.id),
  notes: text(),
}, (t) => [
  uniqueIndex("mrp_runs_number_uq").on(t.runNumber),
  check("mrp_runs_period", sql`${t.periodEnd} >= ${t.periodStart}`),
]);

export const mrpDemands = pgTable("mrp_demands", {
  ...stdCols(),
  mrpRunId: uuid().notNull().references(() => mrpRuns.id, { onDelete: "cascade" }),
  sourceType: mrpDemandSource().notNull(),
  eventContractId: uuid().references(() => eventContracts.id),
  productId: uuid().notNull().references(() => products.id),
  quantity: integer().notNull(),
}, (t) => [check("mrp_demands_qty_pos", sql`${t.quantity} > 0`)]);

export const mrpRunLines = pgTable("mrp_run_lines", {
  ...stdCols(),
  mrpRunId: uuid().notNull().references(() => mrpRuns.id, { onDelete: "cascade" }),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  unitId: uuid().notNull().references(() => units.id),
  grossRequirement: qty().notNull(),
  availableStock: qty().notNull(),
  scheduledReceipt: qty().notNull().default("0"),
  safetyStock: qty().notNull().default("0"),
  netRequirement: qty().notNull(),
  recommendedQuantity: qty().notNull().default("0"),
  adjustedQuantity: qty(),
  status: mrpLineStatus().notNull().default("PENDING_REVIEW"),
  trace: jsonb(), // jejak demand, recipe, stok, PO scheduled (BR-MRP-006)
  decidedBy: uuid().references(() => users.id),
}, (t) => [uniqueIndex("mrp_run_lines_run_ingredient_uq").on(t.mrpRunId, t.ingredientId)]);
