import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["OWNER", "MANAGER", "CASHIER", "WAITER", "KITCHEN"]);
export const employeeStatus = pgEnum("employee_status", ["ACTIVE", "INACTIVE"]);
export const customerType = pgEnum("customer_type", ["INDIVIDUAL", "CORPORATE"]);

export const orderType = pgEnum("order_type", ["DINE_IN", "TAKEAWAY", "EVENT"]);
export const orderStatus = pgEnum("order_status", ["OPEN", "COMPLETED", "VOIDED"]);
export const kitchenStatus = pgEnum("kitchen_status", ["PENDING", "PREPARING", "READY", "SERVED"]);
export const paymentStatus = pgEnum("payment_status", ["UNPAID", "PARTIALLY_PAID", "PAID"]);
export const paymentMethod = pgEnum("payment_method", ["CASH", "BANK_TRANSFER", "QRIS_MANUAL", "DEBIT_CARD", "OTHER"]);
export const paymentPurpose = pgEnum("payment_purpose", ["ORDER", "EVENT_DEPOSIT", "INVOICE"]);
export const settlementStatus = pgEnum("settlement_status", ["NORMAL", "WAIVED", "BAD_DEBT", "COMPENSATED"]);

export const eventType = pgEnum("event_type", ["ARISAN", "HAJATAN", "MEETING", "GATHERING", "CORPORATE"]);
export const contractStatus = pgEnum("contract_status", ["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"]);
export const invoiceType = pgEnum("invoice_type", ["EVENT", "CANCELLATION_FEE"]);
export const invoiceStatus = pgEnum("invoice_status", ["ISSUED", "PARTIALLY_PAID", "PAID", "CANCELLED"]);
export const creditNoteStatus = pgEnum("credit_note_status", ["POSTED", "CANCELLED"]);
export const refundType = pgEnum("refund_type", ["EVENT_DEPOSIT", "ORDER_PAYMENT", "INVOICE_CREDIT"]);
export const refundStatus = pgEnum("refund_status", ["PENDING_APPROVAL", "APPROVED", "PAID", "REJECTED", "CANCELLED"]);
export const complaintStatus = pgEnum("complaint_status", ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]);
export const resolutionType = pgEnum("resolution_type", ["NONE", "COMPENSATION", "REFUND", "CREDIT_NOTE", "WAIVER"]);

export const movementType = pgEnum("movement_type", [
  "OPENING_BALANCE", "PURCHASE_RECEIPT", "SALES_CONSUMPTION", "WASTE", "DAMAGED",
  "SPOILAGE", "SUPPLIER_RETURN", "ADJUSTMENT_IN", "ADJUSTMENT_OUT",
]);
export const adjustmentType = pgEnum("adjustment_type", ["OPENING_BALANCE", "WASTE", "DAMAGED", "SPOILAGE", "COUNT_CORRECTION", "OTHER"]);
export const adjustmentStatus = pgEnum("adjustment_status", ["DRAFT", "PENDING_APPROVAL", "POSTED", "CANCELLED"]);

export const poStatus = pgEnum("po_status", ["DRAFT", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED", "CLOSED", "CANCELLED"]);
export const matchStatus = pgEnum("match_status", ["PENDING", "MATCHED", "DISCREPANCY", "RESOLVED"]);
export const supplierInvoiceStatus = pgEnum("supplier_invoice_status", ["DRAFT", "DISPUTED", "POSTED", "PARTIALLY_PAID", "PAID"]);
export const supplierPaymentPurpose = pgEnum("supplier_payment_purpose", ["ADVANCE", "INVOICE"]);
export const returnStatus = pgEnum("return_status", ["PENDING_APPROVAL", "APPROVED", "POSTED", "REJECTED", "CANCELLED"]);
export const creditStatus = pgEnum("credit_status", ["OPEN", "APPLIED", "CANCELLED"]);

export const expenseStatus = pgEnum("expense_status", ["RECORDED", "PAID", "CANCELLED"]);

export const payrollPeriodStatus = pgEnum("payroll_period_status", ["OPEN", "FINALIZED", "CLOSED"]);
export const payrollPaymentStatus = pgEnum("payroll_payment_status", ["BELUM_DIGAJI", "SUDAH_DIGAJI"]);
export const componentType = pgEnum("component_type", ["ALLOWANCE", "BONUS", "OTHER_INCOME", "DEDUCTION", "OTHER_DEDUCTION"]);
export const payrollDirection = pgEnum("payroll_direction", ["INCOME", "DEDUCTION"]);

export const accountType = pgEnum("account_type", ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]);
export const normalBalance = pgEnum("normal_balance", ["DEBIT", "CREDIT"]);
export const journalStatus = pgEnum("journal_status", ["POSTED", "REVERSED"]);

export const approvalType = pgEnum("approval_type", [
  "REFUND", "CUSTOMER_CANCELLATION", "SUPPLIER_RETURN", "STOCK_ADJUSTMENT", "BAD_DEBT",
  "SETTLEMENT", "VOID_ORDER", "PAYROLL_FINALIZATION", "PAYROLL_CORRECTION", "JOURNAL_CORRECTION",
]);
export const approvalStatus = pgEnum("approval_status", ["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const mrpRunStatus = pgEnum("mrp_run_status", ["DRAFT", "REVIEWED", "CLOSED"]);
export const mrpDemandSource = pgEnum("mrp_demand_source", ["MANUAL_FORECAST", "EVENT_CONTRACT", "PLANNED"]);
export const mrpLineStatus = pgEnum("mrp_line_status", ["PENDING_REVIEW", "ACCEPTED", "DISMISSED", "ORDERED"]);

export const settingDataType = pgEnum("setting_data_type", ["STRING", "INTEGER", "DECIMAL", "BOOLEAN", "DATE", "JSON"]);
export const settingAccess = pgEnum("setting_access", ["STANDARD", "CRITICAL"]);
