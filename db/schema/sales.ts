// Penjualan: event contract, order, payment, invoice (AR), credit note, refund, complaint
import { sql } from "drizzle-orm";
import {
  boolean, check, date, index, integer, jsonb, pgTable, text, uniqueIndex,
  uuid, varchar,
} from "drizzle-orm/pg-core";
import {
  complaintStatus, contractStatus, creditNoteStatus, eventType, invoiceStatus,
  invoiceType, kitchenStatus, orderStatus, orderType, paymentMethod,
  paymentPurpose, paymentStatus, refundStatus, refundType, resolutionType,
  settlementStatus,
} from "./enums";
import { money, pct, stdCols, tz } from "./helpers";
import { approvals, users } from "./identity";
import { complaintCategories, customers, diningTables, products } from "./master";

export const eventContracts = pgTable("event_contracts", {
  ...stdCols(),
  contractNumber: varchar({ length: 40 }).notNull(),
  customerId: uuid().notNull().references(() => customers.id),
  eventType: eventType().notNull(),
  eventName: varchar({ length: 150 }).notNull(),
  eventDate: date().notNull(),
  guestCount: integer().notNull(),
  totalAmount: money().notNull(),
  status: contractStatus().notNull().default("DRAFT"),
  cancellationFee: money().notNull().default("0"),
  cancelledAt: tz(),
  cancelReason: text(),
  cancellationApprovalId: uuid().references(() => approvals.id),
  notes: text(),
}, (t) => [
  uniqueIndex("event_contracts_number_uq").on(t.contractNumber),
  check("event_contracts_guest_pos", sql`${t.guestCount} > 0`),
  check("event_contracts_total_nonneg", sql`${t.totalAmount} >= 0`),
  index("event_contracts_customer_idx").on(t.customerId),
  index("event_contracts_date_idx").on(t.eventDate),
]);

export const eventContractItems = pgTable("event_contract_items", {
  ...stdCols(),
  contractId: uuid().notNull().references(() => eventContracts.id, { onDelete: "cascade" }),
  productId: uuid().notNull().references(() => products.id),
  description: varchar({ length: 150 }),
  quantity: integer().notNull(),
  unitPrice: money().notNull(),
  lineTotal: money().notNull(),
}, (t) => [
  check("event_contract_items_qty_pos", sql`${t.quantity} > 0`),
  index("event_contract_items_contract_idx").on(t.contractId),
]);

export const orders = pgTable("orders", {
  ...stdCols(),
  orderNumber: varchar({ length: 40 }).notNull(),
  orderType: orderType().notNull(),
  tableId: uuid().references(() => diningTables.id),
  eventContractId: uuid().references(() => eventContracts.id),
  customerId: uuid().references(() => customers.id),
  status: orderStatus().notNull().default("OPEN"),
  paymentStatus: paymentStatus().notNull().default("UNPAID"),
  settlementStatus: settlementStatus().notNull().default("NORMAL"),
  settlementApprovalId: uuid().references(() => approvals.id),
  subtotal: money().notNull().default("0"),
  taxPercent: pct().notNull().default("0"), // snapshot setting sales.tax_percent
  taxAmount: money().notNull().default("0"),
  totalAmount: money().notNull().default("0"),
  paidAmount: money().notNull().default("0"), // cache SUM(payments)
  writtenOffAmount: money().notNull().default("0"),
  billedAt: tz(), // bill dibuat: item terkunci, AR terbentuk
  completedAt: tz(),
  voidedAt: tz(),
  voidReason: text(),
  notes: text(),
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("orders_number_uq").on(t.orderNumber),
  check("orders_dine_in_table", sql`${t.orderType} <> 'DINE_IN' OR ${t.tableId} IS NOT NULL`),
  check("orders_event_contract", sql`${t.orderType} <> 'EVENT' OR ${t.eventContractId} IS NOT NULL`),
  check("orders_completed_at", sql`${t.status} <> 'COMPLETED' OR ${t.completedAt} IS NOT NULL`),
  check("orders_void_reason", sql`${t.status} <> 'VOIDED' OR ${t.voidReason} IS NOT NULL`),
  // status meja diturunkan dari order OPEN
  index("orders_open_table_idx").on(t.tableId).where(sql`${t.status} = 'OPEN'`),
  index("orders_status_created_idx").on(t.status, t.createdAt),
  index("orders_billed_idx").on(t.billedAt),
  index("orders_contract_idx").on(t.eventContractId),
]);

export const orderItems = pgTable("order_items", {
  ...stdCols(),
  orderId: uuid().notNull().references(() => orders.id),
  productId: uuid().notNull().references(() => products.id),
  productName: varchar({ length: 120 }).notNull(), // snapshot nama
  quantity: integer().notNull(),
  unitPrice: money().notNull(), // snapshot harga (BR-ORD-003)
  lineTotal: money().notNull(),
  notes: varchar({ length: 255 }),
  kitchenStatus: kitchenStatus().notNull().default("PENDING"),
  preparingAt: tz(),
  preparingBy: uuid().references(() => users.id),
  readyAt: tz(),
  readyBy: uuid().references(() => users.id),
  servedAt: tz(),
  servedBy: uuid().references(() => users.id),
  // VOIDED adalah penanda, bukan nilai kitchen_status
  voidedAt: tz(),
  voidedBy: uuid().references(() => users.id),
  voidReason: text(),
  isWasted: boolean().notNull().default(false),
  costAmount: money().notNull().default("0"), // SUM biaya konsumsi (untuk COGS)
}, (t) => [
  check("order_items_qty_pos", sql`${t.quantity} > 0`),
  index("order_items_order_idx").on(t.orderId),
  index("order_items_kitchen_idx").on(t.kitchenStatus, t.createdAt).where(sql`${t.voidedAt} IS NULL`),
]);

// Pembayaran customer (immutable)
export const payments = pgTable("payments", {
  ...stdCols(),
  paymentNumber: varchar({ length: 40 }).notNull(),
  purpose: paymentPurpose().notNull(),
  orderId: uuid().references(() => orders.id),
  eventContractId: uuid().references(() => eventContracts.id),
  customerId: uuid().references(() => customers.id),
  method: paymentMethod().notNull(),
  amount: money().notNull(),
  tenderedAmount: money(),
  changeAmount: money(),
  reference: varchar({ length: 100 }),
  idempotencyKey: varchar({ length: 100 }).notNull(), // BR-AR-011
  receivedBy: uuid().notNull().references(() => users.id),
  receivedAt: tz().notNull().defaultNow(),
  notes: text(),
}, (t) => [
  uniqueIndex("payments_number_uq").on(t.paymentNumber),
  uniqueIndex("payments_idempotency_uq").on(t.idempotencyKey),
  check("payments_amount_pos", sql`${t.amount} > 0`),
  check("payments_order_ref", sql`${t.purpose} <> 'ORDER' OR ${t.orderId} IS NOT NULL`),
  check("payments_deposit_ref", sql`${t.purpose} <> 'EVENT_DEPOSIT' OR (${t.eventContractId} IS NOT NULL AND ${t.customerId} IS NOT NULL)`),
  check("payments_invoice_ref", sql`${t.purpose} <> 'INVOICE' OR ${t.customerId} IS NOT NULL`),
  index("payments_order_idx").on(t.orderId),
  index("payments_contract_idx").on(t.eventContractId),
  index("payments_received_idx").on(t.receivedAt),
]);

// Invoice AR (event / cancellation fee)
export const invoices = pgTable("invoices", {
  ...stdCols(),
  invoiceNumber: varchar({ length: 40 }).notNull(),
  invoiceType: invoiceType().notNull().default("EVENT"),
  eventContractId: uuid().notNull().references(() => eventContracts.id),
  customerId: uuid().notNull().references(() => customers.id),
  issueDate: date().notNull(),
  dueDate: date().notNull(),
  totalAmount: money().notNull(),
  creditNoteTotal: money().notNull().default("0"),
  allocatedAmount: money().notNull().default("0"), // DP + pembayaran
  writtenOffAmount: money().notNull().default("0"),
  outstandingAmount: money().notNull().default("0"),
  status: invoiceStatus().notNull().default("ISSUED"),
  settlementStatus: settlementStatus().notNull().default("NORMAL"),
  settlementApprovalId: uuid().references(() => approvals.id),
  headerSnapshot: jsonb().notNull(), // restoran + customer saat terbit
  linesSnapshot: jsonb().notNull(), // salinan item kontrak
  issuedBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("invoices_number_uq").on(t.invoiceNumber),
  check("invoices_total_pos", sql`${t.totalAmount} > 0`),
  check("invoices_due_after_issue", sql`${t.dueDate} >= ${t.issueDate}`),
  check("invoices_outstanding_nonneg", sql`${t.outstandingAmount} >= 0`),
  index("invoices_contract_idx").on(t.eventContractId),
  index("invoices_customer_idx").on(t.customerId),
  index("invoices_status_due_idx").on(t.status, t.dueDate),
]);

// Alokasi payment/DP ke invoice (many-to-many)
export const paymentAllocations = pgTable("payment_allocations", {
  ...stdCols(),
  paymentId: uuid().notNull().references(() => payments.id),
  invoiceId: uuid().notNull().references(() => invoices.id),
  amount: money().notNull(),
  allocatedBy: uuid().notNull().references(() => users.id),
  allocatedAt: tz().notNull().defaultNow(),
}, (t) => [
  uniqueIndex("payment_allocations_pair_uq").on(t.paymentId, t.invoiceId),
  check("payment_allocations_amount_pos", sql`${t.amount} > 0`),
  index("payment_allocations_invoice_idx").on(t.invoiceId),
]);

export const complaints = pgTable("complaints", {
  ...stdCols(),
  customerId: uuid().references(() => customers.id),
  orderId: uuid().references(() => orders.id),
  eventContractId: uuid().references(() => eventContracts.id),
  categoryId: uuid().notNull().references(() => complaintCategories.id),
  description: text().notNull(),
  status: complaintStatus().notNull().default("OPEN"),
  reviewedBy: uuid().references(() => users.id),
  resolutionType: resolutionType(),
  resolutionNotes: text(),
  resolvedAt: tz(),
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [
  check("complaints_has_ref", sql`${t.customerId} IS NOT NULL OR ${t.orderId} IS NOT NULL OR ${t.eventContractId} IS NOT NULL`),
  index("complaints_status_idx").on(t.status),
  index("complaints_order_idx").on(t.orderId),
]);

export const creditNotes = pgTable("credit_notes", {
  ...stdCols(),
  creditNoteNumber: varchar({ length: 40 }).notNull(),
  invoiceId: uuid().notNull().references(() => invoices.id),
  amount: money().notNull(),
  reason: text().notNull(),
  complaintId: uuid().references(() => complaints.id),
  approvalId: uuid().references(() => approvals.id),
  issueDate: date().notNull(),
  status: creditNoteStatus().notNull().default("POSTED"),
  headerSnapshot: jsonb().notNull(),
  issuedBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("credit_notes_number_uq").on(t.creditNoteNumber),
  check("credit_notes_amount_pos", sql`${t.amount} > 0`),
  index("credit_notes_invoice_idx").on(t.invoiceId),
]);

export const refunds = pgTable("refunds", {
  ...stdCols(),
  refundNumber: varchar({ length: 40 }).notNull(),
  refundType: refundType().notNull(),
  eventContractId: uuid().references(() => eventContracts.id),
  orderId: uuid().references(() => orders.id),
  invoiceId: uuid().references(() => invoices.id),
  customerId: uuid().references(() => customers.id),
  amount: money().notNull(),
  method: paymentMethod().notNull(),
  status: refundStatus().notNull().default("PENDING_APPROVAL"),
  approvalId: uuid().references(() => approvals.id),
  reason: text().notNull(),
  reference: varchar({ length: 100 }),
  paidAt: tz(),
  paidBy: uuid().references(() => users.id),
  requestedBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("refunds_number_uq").on(t.refundNumber),
  check("refunds_amount_pos", sql`${t.amount} > 0`),
  index("refunds_status_idx").on(t.status),
]);
