// Payroll sederhana: salary history, periode bulanan, item (snapshot), komponen, payment, payslip
import { sql } from "drizzle-orm";
import {
  check, date, index, jsonb, pgTable, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import {
  componentType, paymentMethod, payrollDirection, payrollPaymentStatus,
  payrollPeriodStatus,
} from "./enums";
import { money, stdCols, tz } from "./helpers";
import { approvals, users } from "./identity";
import { employees } from "./master";

// Non-overlap per employee dijaga EXCLUDE constraint (db/sql/extras.sql)
export const employeeSalaryHistories = pgTable("employee_salary_histories", {
  ...stdCols(),
  employeeId: uuid().notNull().references(() => employees.id),
  monthlySalary: money().notNull(),
  effectiveFrom: date().notNull(),
  effectiveTo: date(), // NULL = berlaku seterusnya
  reason: text(),
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [
  check("salary_histories_nonneg", sql`${t.monthlySalary} >= 0`),
  check("salary_histories_range", sql`${t.effectiveTo} IS NULL OR ${t.effectiveTo} >= ${t.effectiveFrom}`),
  index("salary_histories_employee_idx").on(t.employeeId, t.effectiveFrom),
]);

export const payrollPeriods = pgTable("payroll_periods", {
  ...stdCols(),
  periodStart: date().notNull(),
  periodEnd: date().notNull(),
  label: varchar({ length: 40 }).notNull(), // mis. "Oktober 2026"
  status: payrollPeriodStatus().notNull().default("OPEN"),
  finalizedAt: tz(),
  finalizedBy: uuid().references(() => users.id),
  closedAt: tz(),
  closedBy: uuid().references(() => users.id),
  approvalId: uuid().references(() => approvals.id),
  totalNetSalary: money(), // diisi saat FINALIZED
}, (t) => [
  uniqueIndex("payroll_periods_start_uq").on(t.periodStart),
  check("payroll_periods_range", sql`${t.periodEnd} >= ${t.periodStart}`),
]);

export const payrollItems = pgTable("payroll_items", {
  ...stdCols(),
  periodId: uuid().notNull().references(() => payrollPeriods.id),
  employeeId: uuid().notNull().references(() => employees.id),
  // snapshot identitas saat generate
  employeeCode: varchar({ length: 30 }).notNull(),
  employeeName: varchar({ length: 150 }).notNull(),
  positionName: varchar({ length: 100 }).notNull(),
  salaryHistoryId: uuid().notNull().references(() => employeeSalaryHistories.id),
  baseSalary: money().notNull(),
  totalIncome: money().notNull().default("0"), // SUM komponen income (tanpa base)
  totalDeduction: money().notNull().default("0"),
  grossSalary: money().notNull(), // base + totalIncome
  netSalary: money().notNull(), // gross - totalDeduction
  paymentStatus: payrollPaymentStatus().notNull().default("BELUM_DIGAJI"),
  paidAt: tz(),
  paidBy: uuid().references(() => users.id),
  notes: text(),
}, (t) => [
  // BR-011 / BR-PAY-001
  uniqueIndex("payroll_items_period_employee_uq").on(t.periodId, t.employeeId),
  check("payroll_items_net_nonneg", sql`${t.netSalary} >= 0`),
  // BR-PAY-006
  check("payroll_items_paid_meta", sql`${t.paymentStatus} <> 'SUDAH_DIGAJI' OR (${t.paidAt} IS NOT NULL AND ${t.paidBy} IS NOT NULL)`),
  index("payroll_items_status_idx").on(t.periodId, t.paymentStatus),
]);

export const payrollItemComponents = pgTable("payroll_item_components", {
  ...stdCols(),
  payrollItemId: uuid().notNull().references(() => payrollItems.id),
  componentType: componentType().notNull(),
  direction: payrollDirection().notNull(),
  label: varchar({ length: 100 }).notNull(),
  amount: money().notNull(),
  notes: text(),
}, (t) => [
  check("payroll_components_amount_pos", sql`${t.amount} > 0`),
  check("payroll_components_direction", sql`(${t.direction} = 'INCOME' AND ${t.componentType} IN ('ALLOWANCE', 'BONUS', 'OTHER_INCOME')) OR (${t.direction} = 'DEDUCTION' AND ${t.componentType} IN ('DEDUCTION', 'OTHER_DEDUCTION'))`),
  index("payroll_components_item_idx").on(t.payrollItemId),
]);

export const payrollPayments = pgTable("payroll_payments", {
  ...stdCols(),
  payrollItemId: uuid().notNull().references(() => payrollItems.id),
  amount: money().notNull(),
  paymentMethod: paymentMethod().notNull(),
  reference: varchar({ length: 100 }),
  paidAt: tz().notNull().defaultNow(),
  paidBy: uuid().notNull().references(() => users.id),
  notes: text(),
}, (t) => [
  // BR-013 / BR-PAY-004: satu pembayaran per item
  uniqueIndex("payroll_payments_item_uq").on(t.payrollItemId),
  check("payroll_payments_amount_pos", sql`${t.amount} > 0`),
]);

export const payslips = pgTable("payslips", {
  ...stdCols(),
  payslipNumber: varchar({ length: 40 }).notNull(),
  payrollItemId: uuid().notNull().references(() => payrollItems.id),
  snapshot: jsonb().notNull(), // header, employee, income, deduction, summary, payment, footer
  generatedAt: tz().notNull().defaultNow(),
  generatedBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("payslips_number_uq").on(t.payslipNumber), // BR-PAY-009
  uniqueIndex("payslips_item_uq").on(t.payrollItemId),
]);
