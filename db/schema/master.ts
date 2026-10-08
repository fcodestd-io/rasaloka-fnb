// Master data: unit, posisi, karyawan, menu, ingredient, recipe, meja, supplier, customer
import { sql } from "drizzle-orm";
import {
  type AnyPgColumn, boolean, check, date, integer, jsonb, numeric, pgTable,
  text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import { employeeStatus, customerType } from "./enums";
import { money, qty, stdCols, unitCost } from "./helpers";

export const units = pgTable("units", {
  ...stdCols(),
  code: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 40 }).notNull(),
  // NULL = unit dasar; kg -> g dengan factor 1000
  baseUnitId: uuid().references((): AnyPgColumn => units.id),
  factorToBase: numeric({ precision: 18, scale: 6 }).notNull().default("1"),
}, (t) => [
  uniqueIndex("units_code_uq").on(t.code),
  check("units_factor_pos", sql`${t.factorToBase} > 0`),
]);

export const positions = pgTable("positions", {
  ...stdCols(),
  name: varchar({ length: 80 }).notNull(),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("positions_name_uq").on(t.name)]);

export const employees = pgTable("employees", {
  ...stdCols(),
  employeeCode: varchar({ length: 30 }).notNull(),
  fullName: varchar({ length: 150 }).notNull(),
  positionId: uuid().notNull().references(() => positions.id),
  hireDate: date().notNull(),
  terminationDate: date(),
  status: employeeStatus().notNull().default("ACTIVE"),
  phone: varchar({ length: 30 }),
}, (t) => [
  uniqueIndex("employees_code_uq").on(t.employeeCode),
  check("employees_term_after_hire", sql`${t.terminationDate} IS NULL OR ${t.terminationDate} >= ${t.hireDate}`),
]);

export const productCategories = pgTable("product_categories", {
  ...stdCols(),
  name: varchar({ length: 80 }).notNull(),
  sortOrder: integer().notNull().default(0),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("product_categories_name_uq").on(t.name)]);

export const products = pgTable("products", {
  ...stdCols(),
  name: varchar({ length: 120 }).notNull(),
  categoryId: uuid().notNull().references(() => productCategories.id),
  unitId: uuid().notNull().references(() => units.id),
  sellingPrice: money().notNull(),
  imageUrl: text(), // URL Cloudinary
  imagePublicId: varchar({ length: 200 }),
  imageMeta: jsonb().$type<{ width?: number; height?: number; format?: string; bytes?: number }>(),
  isActive: boolean().notNull().default(true),
}, (t) => [
  uniqueIndex("products_name_uq").on(t.name),
  check("products_price_nonneg", sql`${t.sellingPrice} >= 0`),
]);

export const ingredients = pgTable("ingredients", {
  ...stdCols(),
  name: varchar({ length: 120 }).notNull(),
  unitId: uuid().notNull().references(() => units.id), // unit dasar stok
  // cache dari SUM(stock_movements.quantity); non-negatif ditegakkan aplikasi
  // sesuai setting inventory.allow_negative_stock
  currentQty: qty().notNull().default("0"),
  avgCost: unitCost().notNull().default("0"), // weighted moving average
  lastPurchaseCost: unitCost(),
  safetyStock: qty().notNull().default("0"), // minimum stock + safety stock MRP
  imageUrl: text(),
  imagePublicId: varchar({ length: 200 }),
  imageMeta: jsonb().$type<{ width?: number; height?: number; format?: string; bytes?: number }>(),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("ingredients_name_uq").on(t.name)]);

export const recipeItems = pgTable("recipe_items", {
  ...stdCols(),
  productId: uuid().notNull().references(() => products.id, { onDelete: "cascade" }),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  quantity: qty().notNull(), // per 1 unit produk, dalam unit dasar ingredient
}, (t) => [
  uniqueIndex("recipe_items_product_ingredient_uq").on(t.productId, t.ingredientId),
  check("recipe_items_qty_pos", sql`${t.quantity} > 0`),
]);

export const diningTables = pgTable("dining_tables", {
  ...stdCols(),
  tableNumber: varchar({ length: 20 }).notNull(),
  capacity: integer().notNull(),
  zone: varchar({ length: 40 }),
  isActive: boolean().notNull().default(true),
}, (t) => [
  uniqueIndex("dining_tables_number_uq").on(t.tableNumber),
  check("dining_tables_capacity_pos", sql`${t.capacity} > 0`),
]);

export const suppliers = pgTable("suppliers", {
  ...stdCols(),
  supplierCode: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 150 }).notNull(),
  contactName: varchar({ length: 100 }),
  phone: varchar({ length: 30 }),
  email: varchar({ length: 150 }),
  address: text(),
  paymentTermsDays: integer().notNull().default(0),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("suppliers_code_uq").on(t.supplierCode)]);

export const customers = pgTable("customers", {
  ...stdCols(),
  customerCode: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 150 }).notNull(),
  customerType: customerType().notNull().default("INDIVIDUAL"),
  phone: varchar({ length: 30 }),
  email: varchar({ length: 150 }),
  address: text(),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("customers_code_uq").on(t.customerCode)]);

// Kategori complaint terpisah dari kategori produk.
export const complaintCategories = pgTable("complaint_categories", {
  ...stdCols(),
  name: varchar({ length: 80 }).notNull(),
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("complaint_categories_name_uq").on(t.name)]);
