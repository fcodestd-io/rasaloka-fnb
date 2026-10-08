// Seluruh relations Drizzle (untuk db.query.*). Sisi "one" memakai fields/references
// eksplisit; sisi "many" hanya dibuat bila lawannya tidak ambigu.
import { relations } from "drizzle-orm";
import { accounts, journalEntries, journalLines } from "./accounting";
import { expenseCategories, expenses } from "./expenses";
import { approvals, auditLogs, systemSettings, users } from "./identity";
import { stockAdjustmentItems, stockAdjustments, stockMovements } from "./inventory";
import {
  complaintCategories, customers, diningTables, employees, ingredients,
  positions, productCategories, products, recipeItems, suppliers, units,
} from "./master";
import { mrpDemands, mrpRunLines, mrpRuns } from "./mrp";
import {
  employeeSalaryHistories, payrollItemComponents, payrollItems, payrollPayments,
  payrollPeriods, payslips,
} from "./payroll";
import {
  goodsReceiptItems, goodsReceipts, purchaseOrderItems, purchaseOrders,
  supplierCredits, supplierInvoiceItems, supplierInvoices,
  supplierPaymentAllocations, supplierPayments, supplierReturnItems, supplierReturns,
} from "./purchasing";
import {
  complaints, creditNotes, eventContractItems, eventContracts, invoices,
  orderItems, orders, paymentAllocations, payments, refunds,
} from "./sales";

// ---------- Master ----------
export const unitsRelations = relations(units, ({ one, many }) => ({
  baseUnit: one(units, { fields: [units.baseUnitId], references: [units.id], relationName: "unit_base" }),
  derivedUnits: many(units, { relationName: "unit_base" }),
  products: many(products),
  ingredients: many(ingredients),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
  user: one(users), // sisi balik dari users.employeeId (one-to-one)
  salaryHistories: many(employeeSalaryHistories),
  payrollItems: many(payrollItems),
}));

export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  unit: one(units, { fields: [products.unitId], references: [units.id] }),
  recipeItems: many(recipeItems),
  orderItems: many(orderItems),
  contractItems: many(eventContractItems),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  unit: one(units, { fields: [ingredients.unitId], references: [units.id] }),
  recipeItems: many(recipeItems),
  stockMovements: many(stockMovements),
}));

export const recipeItemsRelations = relations(recipeItems, ({ one }) => ({
  product: one(products, { fields: [recipeItems.productId], references: [products.id] }),
  ingredient: one(ingredients, { fields: [recipeItems.ingredientId], references: [ingredients.id] }),
}));

export const diningTablesRelations = relations(diningTables, ({ many }) => ({
  orders: many(orders),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
  goodsReceipts: many(goodsReceipts),
  invoices: many(supplierInvoices),
  payments: many(supplierPayments),
  returns: many(supplierReturns),
  credits: many(supplierCredits),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  contracts: many(eventContracts),
  orders: many(orders),
  invoices: many(invoices),
  payments: many(payments),
  complaints: many(complaints),
}));

export const complaintCategoriesRelations = relations(complaintCategories, ({ many }) => ({
  complaints: many(complaints),
}));

// ---------- Identity & control ----------
export const usersRelations = relations(users, ({ one }) => ({
  employee: one(employees, { fields: [users.employeeId], references: [employees.id] }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  requester: one(users, { fields: [approvals.requestedBy], references: [users.id] }),
  approver: one(users, { fields: [approvals.approverId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updater: one(users, { fields: [systemSettings.updatedBy], references: [users.id] }),
}));

// ---------- Accounting ----------
export const accountsRelations = relations(accounts, ({ many }) => ({
  lines: many(journalLines),
  expenseCategories: many(expenseCategories),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  lines: many(journalLines),
  reversalOf: one(journalEntries, { fields: [journalEntries.reversalOfId], references: [journalEntries.id], relationName: "journal_reversal" }),
  reversals: many(journalEntries, { relationName: "journal_reversal" }),
  correctionApproval: one(approvals, { fields: [journalEntries.correctionApprovalId], references: [approvals.id] }),
  poster: one(users, { fields: [journalEntries.postedBy], references: [users.id] }),
}));

export const journalLinesRelations = relations(journalLines, ({ one }) => ({
  entry: one(journalEntries, { fields: [journalLines.entryId], references: [journalEntries.id] }),
  account: one(accounts, { fields: [journalLines.accountId], references: [accounts.id] }),
}));

// ---------- Inventory ----------
export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  ingredient: one(ingredients, { fields: [stockMovements.ingredientId], references: [ingredients.id] }),
  unit: one(units, { fields: [stockMovements.unitId], references: [units.id] }),
  creator: one(users, { fields: [stockMovements.createdBy], references: [users.id] }),
}));

export const stockAdjustmentsRelations = relations(stockAdjustments, ({ one, many }) => ({
  items: many(stockAdjustmentItems),
  approval: one(approvals, { fields: [stockAdjustments.approvalId], references: [approvals.id] }),
  creator: one(users, { fields: [stockAdjustments.createdBy], references: [users.id] }),
  poster: one(users, { fields: [stockAdjustments.postedBy], references: [users.id] }),
}));

export const stockAdjustmentItemsRelations = relations(stockAdjustmentItems, ({ one }) => ({
  adjustment: one(stockAdjustments, { fields: [stockAdjustmentItems.adjustmentId], references: [stockAdjustments.id] }),
  ingredient: one(ingredients, { fields: [stockAdjustmentItems.ingredientId], references: [ingredients.id] }),
}));

// ---------- Sales / Event / AR ----------
export const eventContractsRelations = relations(eventContracts, ({ one, many }) => ({
  customer: one(customers, { fields: [eventContracts.customerId], references: [customers.id] }),
  cancellationApproval: one(approvals, { fields: [eventContracts.cancellationApprovalId], references: [approvals.id] }),
  items: many(eventContractItems),
  orders: many(orders),
  invoices: many(invoices),
  payments: many(payments),
  refunds: many(refunds),
  complaints: many(complaints),
}));

export const eventContractItemsRelations = relations(eventContractItems, ({ one }) => ({
  contract: one(eventContracts, { fields: [eventContractItems.contractId], references: [eventContracts.id] }),
  product: one(products, { fields: [eventContractItems.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(diningTables, { fields: [orders.tableId], references: [diningTables.id] }),
  eventContract: one(eventContracts, { fields: [orders.eventContractId], references: [eventContracts.id] }),
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  settlementApproval: one(approvals, { fields: [orders.settlementApprovalId], references: [approvals.id] }),
  creator: one(users, { fields: [orders.createdBy], references: [users.id] }),
  items: many(orderItems),
  payments: many(payments),
  refunds: many(refunds),
  complaints: many(complaints),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  preparer: one(users, { fields: [orderItems.preparingBy], references: [users.id] }),
  readyUser: one(users, { fields: [orderItems.readyBy], references: [users.id] }),
  server: one(users, { fields: [orderItems.servedBy], references: [users.id] }),
  voider: one(users, { fields: [orderItems.voidedBy], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
  eventContract: one(eventContracts, { fields: [payments.eventContractId], references: [eventContracts.id] }),
  customer: one(customers, { fields: [payments.customerId], references: [customers.id] }),
  receiver: one(users, { fields: [payments.receivedBy], references: [users.id] }),
  allocations: many(paymentAllocations),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  eventContract: one(eventContracts, { fields: [invoices.eventContractId], references: [eventContracts.id] }),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
  settlementApproval: one(approvals, { fields: [invoices.settlementApprovalId], references: [approvals.id] }),
  issuer: one(users, { fields: [invoices.issuedBy], references: [users.id] }),
  allocations: many(paymentAllocations),
  creditNotes: many(creditNotes),
}));

export const paymentAllocationsRelations = relations(paymentAllocations, ({ one }) => ({
  payment: one(payments, { fields: [paymentAllocations.paymentId], references: [payments.id] }),
  invoice: one(invoices, { fields: [paymentAllocations.invoiceId], references: [invoices.id] }),
  allocator: one(users, { fields: [paymentAllocations.allocatedBy], references: [users.id] }),
}));

export const complaintsRelations = relations(complaints, ({ one }) => ({
  customer: one(customers, { fields: [complaints.customerId], references: [customers.id] }),
  order: one(orders, { fields: [complaints.orderId], references: [orders.id] }),
  eventContract: one(eventContracts, { fields: [complaints.eventContractId], references: [eventContracts.id] }),
  category: one(complaintCategories, { fields: [complaints.categoryId], references: [complaintCategories.id] }),
  reviewer: one(users, { fields: [complaints.reviewedBy], references: [users.id] }),
  creator: one(users, { fields: [complaints.createdBy], references: [users.id] }),
}));

export const creditNotesRelations = relations(creditNotes, ({ one }) => ({
  invoice: one(invoices, { fields: [creditNotes.invoiceId], references: [invoices.id] }),
  complaint: one(complaints, { fields: [creditNotes.complaintId], references: [complaints.id] }),
  approval: one(approvals, { fields: [creditNotes.approvalId], references: [approvals.id] }),
  issuer: one(users, { fields: [creditNotes.issuedBy], references: [users.id] }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  eventContract: one(eventContracts, { fields: [refunds.eventContractId], references: [eventContracts.id] }),
  order: one(orders, { fields: [refunds.orderId], references: [orders.id] }),
  invoice: one(invoices, { fields: [refunds.invoiceId], references: [invoices.id] }),
  customer: one(customers, { fields: [refunds.customerId], references: [customers.id] }),
  approval: one(approvals, { fields: [refunds.approvalId], references: [approvals.id] }),
  requester: one(users, { fields: [refunds.requestedBy], references: [users.id] }),
  payer: one(users, { fields: [refunds.paidBy], references: [users.id] }),
}));

// ---------- MRP ----------
export const mrpRunsRelations = relations(mrpRuns, ({ one, many }) => ({
  creator: one(users, { fields: [mrpRuns.createdBy], references: [users.id] }),
  demands: many(mrpDemands),
  lines: many(mrpRunLines),
}));

export const mrpDemandsRelations = relations(mrpDemands, ({ one }) => ({
  run: one(mrpRuns, { fields: [mrpDemands.mrpRunId], references: [mrpRuns.id] }),
  product: one(products, { fields: [mrpDemands.productId], references: [products.id] }),
  eventContract: one(eventContracts, { fields: [mrpDemands.eventContractId], references: [eventContracts.id] }),
}));

export const mrpRunLinesRelations = relations(mrpRunLines, ({ one, many }) => ({
  run: one(mrpRuns, { fields: [mrpRunLines.mrpRunId], references: [mrpRuns.id] }),
  ingredient: one(ingredients, { fields: [mrpRunLines.ingredientId], references: [ingredients.id] }),
  unit: one(units, { fields: [mrpRunLines.unitId], references: [units.id] }),
  decider: one(users, { fields: [mrpRunLines.decidedBy], references: [users.id] }),
  poItems: many(purchaseOrderItems),
}));

// ---------- Purchasing / AP ----------
export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [purchaseOrders.supplierId], references: [suppliers.id] }),
  creator: one(users, { fields: [purchaseOrders.createdBy], references: [users.id] }),
  items: many(purchaseOrderItems),
  receipts: many(goodsReceipts),
  invoices: many(supplierInvoices),
  payments: many(supplierPayments),
}));

export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({ one, many }) => ({
  po: one(purchaseOrders, { fields: [purchaseOrderItems.poId], references: [purchaseOrders.id] }),
  ingredient: one(ingredients, { fields: [purchaseOrderItems.ingredientId], references: [ingredients.id] }),
  unit: one(units, { fields: [purchaseOrderItems.unitId], references: [units.id] }),
  mrpRunLine: one(mrpRunLines, { fields: [purchaseOrderItems.mrpRunLineId], references: [mrpRunLines.id] }),
  receiptItems: many(goodsReceiptItems),
}));

export const goodsReceiptsRelations = relations(goodsReceipts, ({ one, many }) => ({
  po: one(purchaseOrders, { fields: [goodsReceipts.poId], references: [purchaseOrders.id] }),
  supplier: one(suppliers, { fields: [goodsReceipts.supplierId], references: [suppliers.id] }),
  receiver: one(users, { fields: [goodsReceipts.receivedBy], references: [users.id] }),
  items: many(goodsReceiptItems),
  returns: many(supplierReturns),
  credits: many(supplierCredits),
}));

export const goodsReceiptItemsRelations = relations(goodsReceiptItems, ({ one, many }) => ({
  goodsReceipt: one(goodsReceipts, { fields: [goodsReceiptItems.goodsReceiptId], references: [goodsReceipts.id] }),
  poItem: one(purchaseOrderItems, { fields: [goodsReceiptItems.poItemId], references: [purchaseOrderItems.id] }),
  unit: one(units, { fields: [goodsReceiptItems.unitId], references: [units.id] }),
  invoiceItems: many(supplierInvoiceItems),
}));

export const supplierInvoicesRelations = relations(supplierInvoices, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [supplierInvoices.supplierId], references: [suppliers.id] }),
  po: one(purchaseOrders, { fields: [supplierInvoices.poId], references: [purchaseOrders.id] }),
  poster: one(users, { fields: [supplierInvoices.postedBy], references: [users.id] }),
  items: many(supplierInvoiceItems),
  allocations: many(supplierPaymentAllocations),
  credits: many(supplierCredits),
}));

export const supplierInvoiceItemsRelations = relations(supplierInvoiceItems, ({ one }) => ({
  invoice: one(supplierInvoices, { fields: [supplierInvoiceItems.supplierInvoiceId], references: [supplierInvoices.id] }),
  grItem: one(goodsReceiptItems, { fields: [supplierInvoiceItems.grItemId], references: [goodsReceiptItems.id] }),
  ingredient: one(ingredients, { fields: [supplierInvoiceItems.ingredientId], references: [ingredients.id] }),
  unit: one(units, { fields: [supplierInvoiceItems.unitId], references: [units.id] }),
}));

export const supplierPaymentsRelations = relations(supplierPayments, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [supplierPayments.supplierId], references: [suppliers.id] }),
  po: one(purchaseOrders, { fields: [supplierPayments.poId], references: [purchaseOrders.id] }),
  payer: one(users, { fields: [supplierPayments.paidBy], references: [users.id] }),
  allocations: many(supplierPaymentAllocations),
}));

export const supplierPaymentAllocationsRelations = relations(supplierPaymentAllocations, ({ one }) => ({
  payment: one(supplierPayments, { fields: [supplierPaymentAllocations.supplierPaymentId], references: [supplierPayments.id] }),
  invoice: one(supplierInvoices, { fields: [supplierPaymentAllocations.supplierInvoiceId], references: [supplierInvoices.id] }),
}));

export const supplierReturnsRelations = relations(supplierReturns, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [supplierReturns.supplierId], references: [suppliers.id] }),
  goodsReceipt: one(goodsReceipts, { fields: [supplierReturns.goodsReceiptId], references: [goodsReceipts.id] }),
  approval: one(approvals, { fields: [supplierReturns.approvalId], references: [approvals.id] }),
  creator: one(users, { fields: [supplierReturns.createdBy], references: [users.id] }),
  items: many(supplierReturnItems),
  credits: many(supplierCredits),
}));

export const supplierReturnItemsRelations = relations(supplierReturnItems, ({ one }) => ({
  return: one(supplierReturns, { fields: [supplierReturnItems.returnId], references: [supplierReturns.id] }),
  ingredient: one(ingredients, { fields: [supplierReturnItems.ingredientId], references: [ingredients.id] }),
}));

export const supplierCreditsRelations = relations(supplierCredits, ({ one }) => ({
  supplier: one(suppliers, { fields: [supplierCredits.supplierId], references: [suppliers.id] }),
  invoice: one(supplierInvoices, { fields: [supplierCredits.supplierInvoiceId], references: [supplierInvoices.id] }),
  return: one(supplierReturns, { fields: [supplierCredits.supplierReturnId], references: [supplierReturns.id] }),
  goodsReceipt: one(goodsReceipts, { fields: [supplierCredits.goodsReceiptId], references: [goodsReceipts.id] }),
}));

// ---------- Payroll ----------
export const employeeSalaryHistoriesRelations = relations(employeeSalaryHistories, ({ one }) => ({
  employee: one(employees, { fields: [employeeSalaryHistories.employeeId], references: [employees.id] }),
  creator: one(users, { fields: [employeeSalaryHistories.createdBy], references: [users.id] }),
}));

export const payrollPeriodsRelations = relations(payrollPeriods, ({ one, many }) => ({
  items: many(payrollItems),
  approval: one(approvals, { fields: [payrollPeriods.approvalId], references: [approvals.id] }),
  finalizer: one(users, { fields: [payrollPeriods.finalizedBy], references: [users.id] }),
  closer: one(users, { fields: [payrollPeriods.closedBy], references: [users.id] }),
}));

export const payrollItemsRelations = relations(payrollItems, ({ one, many }) => ({
  period: one(payrollPeriods, { fields: [payrollItems.periodId], references: [payrollPeriods.id] }),
  employee: one(employees, { fields: [payrollItems.employeeId], references: [employees.id] }),
  salaryHistory: one(employeeSalaryHistories, { fields: [payrollItems.salaryHistoryId], references: [employeeSalaryHistories.id] }),
  payer: one(users, { fields: [payrollItems.paidBy], references: [users.id] }),
  components: many(payrollItemComponents),
  payment: one(payrollPayments), // one-to-one (sisi balik)
  payslip: one(payslips), // one-to-one (sisi balik)
}));

export const payrollItemComponentsRelations = relations(payrollItemComponents, ({ one }) => ({
  item: one(payrollItems, { fields: [payrollItemComponents.payrollItemId], references: [payrollItems.id] }),
}));

export const payrollPaymentsRelations = relations(payrollPayments, ({ one }) => ({
  item: one(payrollItems, { fields: [payrollPayments.payrollItemId], references: [payrollItems.id] }),
  payer: one(users, { fields: [payrollPayments.paidBy], references: [users.id] }),
}));

export const payslipsRelations = relations(payslips, ({ one }) => ({
  item: one(payrollItems, { fields: [payslips.payrollItemId], references: [payrollItems.id] }),
  generator: one(users, { fields: [payslips.generatedBy], references: [users.id] }),
}));

// ---------- Expense ----------
export const expenseCategoriesRelations = relations(expenseCategories, ({ one, many }) => ({
  account: one(accounts, { fields: [expenseCategories.accountId], references: [accounts.id] }),
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(expenseCategories, { fields: [expenses.categoryId], references: [expenseCategories.id] }),
  creator: one(users, { fields: [expenses.createdBy], references: [users.id] }),
  payer: one(users, { fields: [expenses.paidBy], references: [users.id] }),
}));
