import type { Db } from "../index";
import { accounts } from "../schema";

type Row = typeof accounts.$inferInsert;
type T = Row["accountType"];
type N = Row["normalBalance"];

// [kode, nama, tipe, saldo normal, system_key]
const COA: ReadonlyArray<readonly [string, string, T, N, string | null]> = [
  ["1000", "Cash", "ASSET", "DEBIT", "CASH"],
  ["1010", "Bank", "ASSET", "DEBIT", "BANK"],
  ["1100", "Inventory", "ASSET", "DEBIT", "INVENTORY"],
  ["1200", "Accounts Receivable", "ASSET", "DEBIT", "AR"],
  ["1210", "Supplier Advance", "ASSET", "DEBIT", "SUPPLIER_ADVANCE"],
  ["2000", "Accounts Payable", "LIABILITY", "CREDIT", "AP"],
  ["2010", "Goods Received Not Invoiced (GRNI)", "LIABILITY", "CREDIT", "GRNI"],
  ["2100", "Customer Advance", "LIABILITY", "CREDIT", "CUSTOMER_ADVANCE"],
  ["2200", "Salary Payable", "LIABILITY", "CREDIT", "SALARY_PAYABLE"],
  ["2210", "Accrued Expenses Payable", "LIABILITY", "CREDIT", "ACCRUED_EXPENSE"],
  ["2300", "Tax Payable (PB1)", "LIABILITY", "CREDIT", "TAX_PAYABLE"],
  ["3000", "Owner Equity", "EQUITY", "CREDIT", "OWNER_EQUITY"],
  ["3100", "Retained Earnings", "EQUITY", "CREDIT", "RETAINED_EARNINGS"],
  ["4000", "Sales Revenue", "REVENUE", "CREDIT", "SALES_REVENUE"],
  ["4100", "Sales Adjustments (Credit Notes)", "REVENUE", "DEBIT", "SALES_ADJUSTMENT"],
  ["4200", "Other Income (Cancellation Fee, Recovery)", "REVENUE", "CREDIT", "OTHER_INCOME"],
  ["5000", "Cost of Goods Sold", "EXPENSE", "DEBIT", "COGS"],
  ["5100", "Inventory Loss (Waste, Damage, Adjustment)", "EXPENSE", "DEBIT", "INVENTORY_LOSS"],
  ["5200", "Purchase Price Variance", "EXPENSE", "DEBIT", "PPV"],
  ["6000", "Salary Expense", "EXPENSE", "DEBIT", "SALARY_EXPENSE"],
  ["6010", "Electricity Expense", "EXPENSE", "DEBIT", null],
  ["6020", "Rent Expense", "EXPENSE", "DEBIT", null],
  ["6030", "Internet Expense", "EXPENSE", "DEBIT", null],
  ["6040", "Maintenance Expense", "EXPENSE", "DEBIT", null],
  ["6050", "Transport Expense", "EXPENSE", "DEBIT", null],
  ["6060", "Office Supplies Expense", "EXPENSE", "DEBIT", null],
  ["6070", "Administration Expense", "EXPENSE", "DEBIT", null],
  ["6090", "Other OPEX", "EXPENSE", "DEBIT", null],
  ["6100", "Bad Debt Expense", "EXPENSE", "DEBIT", "BAD_DEBT"],
  ["6110", "Waiver & Compensation Expense", "EXPENSE", "DEBIT", "WAIVER_EXPENSE"],
];

export async function seedAccounts(db: Db): Promise<void> {
  await db.insert(accounts).values(
    COA.map(([code, name, accountType, normalBalance, systemKey]) => ({
      code, name, accountType, normalBalance, systemKey, isSystem: systemKey !== null,
    })),
  ).onConflictDoNothing();
  console.log(`  ✓ accounts (${COA.length})`);
}
