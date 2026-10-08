// Expense / OPEX
import { sql } from "drizzle-orm";
import {
  boolean, check, date, index, pgTable, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import { expenseStatus, paymentMethod } from "./enums";
import { money, stdCols, tz } from "./helpers";
import { users } from "./identity";
import { accounts } from "./accounting";

export const expenseCategories = pgTable("expense_categories", {
  ...stdCols(),
  name: varchar({ length: 80 }).notNull(),
  accountId: uuid().notNull().references(() => accounts.id), // akun beban tujuan
  isSystem: boolean().notNull().default(false), // Salary: berasal dari payroll
  isActive: boolean().notNull().default(true),
}, (t) => [uniqueIndex("expense_categories_name_uq").on(t.name)]);

export const expenses = pgTable("expenses", {
  ...stdCols(),
  expenseNumber: varchar({ length: 40 }).notNull(),
  categoryId: uuid().notNull().references(() => expenseCategories.id),
  expenseDate: date().notNull(),
  description: text().notNull(),
  vendorName: varchar({ length: 150 }),
  amount: money().notNull(),
  status: expenseStatus().notNull().default("RECORDED"),
  paymentMethod: paymentMethod(),
  paidAt: tz(),
  paidBy: uuid().references(() => users.id),
  reference: varchar({ length: 100 }),
  attachmentUrl: text(), // Cloudinary
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("expenses_number_uq").on(t.expenseNumber),
  check("expenses_amount_pos", sql`${t.amount} > 0`),
  check("expenses_paid_at", sql`${t.status} <> 'PAID' OR ${t.paidAt} IS NOT NULL`),
  index("expenses_date_idx").on(t.expenseDate),
  index("expenses_status_idx").on(t.status),
]);
