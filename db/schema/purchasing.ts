// Purchasing & AP: PO, goods receipt, supplier invoice (3-way matching), payment, return, credit
import { sql } from "drizzle-orm";
import {
  check, date, index, jsonb, pgTable, text, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import {
  creditStatus, matchStatus, paymentMethod, poStatus, returnStatus,
  supplierInvoiceStatus, supplierPaymentPurpose,
} from "./enums";
import { money, qty, stdCols, tz, unitCost } from "./helpers";
import { approvals, users } from "./identity";
import { ingredients, suppliers, units } from "./master";
import { mrpRunLines } from "./mrp";

export const purchaseOrders = pgTable("purchase_orders", {
  ...stdCols(),
  poNumber: varchar({ length: 40 }).notNull(),
  supplierId: uuid().notNull().references(() => suppliers.id),
  orderDate: date().notNull(),
  expectedDate: date(),
  status: poStatus().notNull().default("DRAFT"),
  totalAmount: money().notNull().default("0"),
  advancePaidAmount: money().notNull().default("0"),
  notes: text(),
  orderedAt: tz(),
  cancelledAt: tz(),
  cancelReason: text(),
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("purchase_orders_number_uq").on(t.poNumber),
  index("purchase_orders_supplier_idx").on(t.supplierId),
  index("purchase_orders_status_idx").on(t.status, t.expectedDate),
]);

export const purchaseOrderItems = pgTable("purchase_order_items", {
  ...stdCols(),
  poId: uuid().notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  quantity: qty().notNull(), // dalam unit pembelian (unitId)
  unitId: uuid().notNull().references(() => units.id),
  unitPrice: money().notNull(), // per unit pembelian
  lineTotal: money().notNull(),
  receivedQuantity: qty().notNull().default("0"), // cache SUM accepted
  mrpRunLineId: uuid().references(() => mrpRunLines.id),
}, (t) => [
  check("purchase_order_items_qty_pos", sql`${t.quantity} > 0`),
  index("purchase_order_items_po_idx").on(t.poId),
]);

export const goodsReceipts = pgTable("goods_receipts", {
  ...stdCols(),
  grNumber: varchar({ length: 40 }).notNull(),
  poId: uuid().notNull().references(() => purchaseOrders.id),
  supplierId: uuid().notNull().references(() => suppliers.id),
  receiptDate: date().notNull(),
  deliveryNoteNumber: varchar({ length: 60 }),
  receivedBy: uuid().notNull().references(() => users.id),
  totalValue: money().notNull().default("0"),
  notes: text(),
}, (t) => [
  uniqueIndex("goods_receipts_number_uq").on(t.grNumber),
  index("goods_receipts_po_idx").on(t.poId),
]);

export const goodsReceiptItems = pgTable("goods_receipt_items", {
  ...stdCols(),
  goodsReceiptId: uuid().notNull().references(() => goodsReceipts.id, { onDelete: "cascade" }),
  poItemId: uuid().notNull().references(() => purchaseOrderItems.id),
  receivedQuantity: qty().notNull(),
  rejectedQuantity: qty().notNull().default("0"),
  acceptedQuantity: qty().notNull(),
  unitId: uuid().notNull().references(() => units.id),
  unitPrice: money().notNull(), // harga PO per unit pembelian
  baseUnitCost: unitCost().notNull(), // biaya per unit dasar (hasil konversi)
  rejectionReason: text(),
  invoicedQuantity: qty().notNull().default("0"), // cache
}, (t) => [
  // BR-006 / BR-PUR-002
  check("goods_receipt_items_accepted", sql`${t.acceptedQuantity} = ${t.receivedQuantity} - ${t.rejectedQuantity}`),
  check("goods_receipt_items_nonneg", sql`${t.receivedQuantity} >= 0 AND ${t.rejectedQuantity} >= 0 AND ${t.acceptedQuantity} >= 0`),
  check("goods_receipt_items_invoiced", sql`${t.invoicedQuantity} <= ${t.acceptedQuantity}`),
  check("goods_receipt_items_reason", sql`${t.rejectedQuantity} = 0 OR ${t.rejectionReason} IS NOT NULL`),
  index("goods_receipt_items_gr_idx").on(t.goodsReceiptId),
  index("goods_receipt_items_po_item_idx").on(t.poItemId),
]);

export const supplierInvoices = pgTable("supplier_invoices", {
  ...stdCols(),
  recordNumber: varchar({ length: 40 }).notNull(), // nomor internal AP
  supplierInvoiceNumber: varchar({ length: 60 }).notNull(), // nomor dari supplier
  supplierId: uuid().notNull().references(() => suppliers.id),
  poId: uuid().notNull().references(() => purchaseOrders.id),
  invoiceDate: date().notNull(),
  dueDate: date().notNull(),
  totalAmount: money().notNull(),
  creditTotal: money().notNull().default("0"),
  allocatedAmount: money().notNull().default("0"), // advance + pembayaran
  outstandingAmount: money().notNull().default("0"),
  matchStatus: matchStatus().notNull().default("PENDING"),
  status: supplierInvoiceStatus().notNull().default("DRAFT"),
  headerSnapshot: jsonb(), // diisi saat POSTED (untuk PDF)
  postedAt: tz(),
  postedBy: uuid().references(() => users.id),
}, (t) => [
  uniqueIndex("supplier_invoices_record_uq").on(t.recordNumber),
  uniqueIndex("supplier_invoices_supplier_number_uq").on(t.supplierId, t.supplierInvoiceNumber),
  check("supplier_invoices_outstanding_nonneg", sql`${t.outstandingAmount} >= 0`),
  // BR-PUR-004: AP hanya dari invoice MATCHED / RESOLVED
  check("supplier_invoices_posted_matched", sql`${t.status} NOT IN ('POSTED', 'PARTIALLY_PAID', 'PAID') OR ${t.matchStatus} IN ('MATCHED', 'RESOLVED')`),
  index("supplier_invoices_status_due_idx").on(t.status, t.dueDate),
  index("supplier_invoices_po_idx").on(t.poId),
]);

export const supplierInvoiceItems = pgTable("supplier_invoice_items", {
  ...stdCols(),
  supplierInvoiceId: uuid().notNull().references(() => supplierInvoices.id, { onDelete: "cascade" }),
  grItemId: uuid().notNull().references(() => goodsReceiptItems.id),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  quantity: qty().notNull(),
  unitId: uuid().notNull().references(() => units.id),
  unitPrice: money().notNull(),
  lineTotal: money().notNull(),
  qtyVariance: qty().notNull().default("0"), // invoice - accepted belum diinvoice
  priceVariance: money().notNull().default("0"), // invoice - harga PO
  matchStatus: matchStatus().notNull().default("PENDING"),
}, (t) => [index("supplier_invoice_items_invoice_idx").on(t.supplierInvoiceId)]);

export const supplierPayments = pgTable("supplier_payments", {
  ...stdCols(),
  paymentNumber: varchar({ length: 40 }).notNull(), // nomor voucher
  supplierId: uuid().notNull().references(() => suppliers.id),
  purpose: supplierPaymentPurpose().notNull(),
  poId: uuid().references(() => purchaseOrders.id), // wajib untuk ADVANCE
  method: paymentMethod().notNull(),
  amount: money().notNull(),
  reference: varchar({ length: 100 }),
  idempotencyKey: varchar({ length: 100 }).notNull(),
  paidAt: tz().notNull().defaultNow(),
  paidBy: uuid().notNull().references(() => users.id),
}, (t) => [
  uniqueIndex("supplier_payments_number_uq").on(t.paymentNumber),
  uniqueIndex("supplier_payments_idempotency_uq").on(t.idempotencyKey),
  check("supplier_payments_amount_pos", sql`${t.amount} > 0`),
  check("supplier_payments_advance_po", sql`${t.purpose} <> 'ADVANCE' OR ${t.poId} IS NOT NULL`),
  index("supplier_payments_supplier_idx").on(t.supplierId, t.paidAt),
]);

export const supplierPaymentAllocations = pgTable("supplier_payment_allocations", {
  ...stdCols(),
  supplierPaymentId: uuid().notNull().references(() => supplierPayments.id),
  supplierInvoiceId: uuid().notNull().references(() => supplierInvoices.id),
  amount: money().notNull(),
}, (t) => [
  uniqueIndex("supplier_payment_allocations_pair_uq").on(t.supplierPaymentId, t.supplierInvoiceId),
  check("supplier_payment_allocations_amount_pos", sql`${t.amount} > 0`),
]);

export const supplierReturns = pgTable("supplier_returns", {
  ...stdCols(),
  returnNumber: varchar({ length: 40 }).notNull(),
  supplierId: uuid().notNull().references(() => suppliers.id),
  goodsReceiptId: uuid().references(() => goodsReceipts.id),
  status: returnStatus().notNull().default("PENDING_APPROVAL"),
  returnDate: date().notNull(),
  reason: text().notNull(),
  totalValue: money().notNull().default("0"),
  approvalId: uuid().references(() => approvals.id),
  createdBy: uuid().notNull().references(() => users.id),
}, (t) => [uniqueIndex("supplier_returns_number_uq").on(t.returnNumber)]);

export const supplierReturnItems = pgTable("supplier_return_items", {
  ...stdCols(),
  returnId: uuid().notNull().references(() => supplierReturns.id, { onDelete: "cascade" }),
  ingredientId: uuid().notNull().references(() => ingredients.id),
  quantity: qty().notNull(),
  unitCost: unitCost().notNull(),
  value: money().notNull(),
  reason: text(),
}, (t) => [check("supplier_return_items_qty_pos", sql`${t.quantity} > 0`)]);

export const supplierCredits = pgTable("supplier_credits", {
  ...stdCols(),
  creditNumber: varchar({ length: 40 }).notNull(),
  supplierId: uuid().notNull().references(() => suppliers.id),
  supplierInvoiceId: uuid().references(() => supplierInvoices.id),
  supplierReturnId: uuid().references(() => supplierReturns.id),
  goodsReceiptId: uuid().references(() => goodsReceipts.id),
  amount: money().notNull(),
  appliedAmount: money().notNull().default("0"),
  status: creditStatus().notNull().default("OPEN"),
  reason: text().notNull(),
  creditDate: date().notNull(),
}, (t) => [
  uniqueIndex("supplier_credits_number_uq").on(t.creditNumber),
  check("supplier_credits_amount_pos", sql`${t.amount} > 0`),
  check("supplier_credits_applied", sql`${t.appliedAmount} >= 0 AND ${t.appliedAmount} <= ${t.amount}`),
]);
