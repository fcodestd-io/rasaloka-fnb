// Identity & control: users, approvals, audit log, settings, numbering, template
import { sql } from "drizzle-orm";
import {
  boolean, check, index, inet, integer, jsonb, pgTable, primaryKey, text,
  uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import {
  approvalStatus, approvalType, settingAccess, settingDataType, userRole,
} from "./enums";
import { createdAt, pk, stdCols, tz, updatedAt } from "./helpers";
import { employees } from "./master";

export const users = pgTable("users", {
  ...stdCols(),
  username: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 150 }),
  passwordHash: text().notNull(), // Argon2id; jangan pernah dikirim ke klien
  role: userRole().notNull(),
  employeeId: uuid().references(() => employees.id),
  isActive: boolean().notNull().default(true),
  failedLoginCount: integer().notNull().default(0),
  lockedUntil: tz(),
  lastLoginAt: tz(),
  mustChangePassword: boolean().notNull().default(true),
}, (t) => [
  uniqueIndex("users_username_uq").on(sql`lower(${t.username})`),
  uniqueIndex("users_email_uq").on(t.email),
  uniqueIndex("users_employee_uq").on(t.employeeId),
]);

export const approvals = pgTable("approvals", {
  ...stdCols(),
  approvalType: approvalType().notNull(),
  entityType: varchar({ length: 50 }).notNull(),
  entityId: uuid().notNull(), // referensi polimorfik, divalidasi di aplikasi
  requestedBy: uuid().notNull().references(() => users.id),
  approverId: uuid().references(() => users.id),
  status: approvalStatus().notNull().default("PENDING"),
  reason: text().notNull(),
  decisionNote: text(),
  payload: jsonb(),
  requestedAt: tz().notNull().defaultNow(),
  decidedAt: tz(),
}, (t) => [
  // BR-APR-001: requester != approver
  check("approvals_not_self", sql`${t.approverId} IS NULL OR ${t.approverId} <> ${t.requestedBy}`),
  check("approvals_decided_at", sql`${t.status} = 'PENDING' OR ${t.status} = 'CANCELLED' OR ${t.decidedAt} IS NOT NULL`),
  // BR-APR-002: satu approval PENDING per (tipe, entitas)
  uniqueIndex("approvals_pending_uq")
    .on(t.approvalType, t.entityType, t.entityId)
    .where(sql`${t.status} = 'PENDING'`),
  index("approvals_status_type_idx").on(t.status, t.approvalType),
]);

// Append-only (dilindungi trigger di db/sql/extras.sql)
export const auditLogs = pgTable("audit_logs", {
  id: pk(),
  userId: uuid().references(() => users.id), // NULL = aksi sistem / login gagal
  action: varchar({ length: 80 }).notNull(),
  entityType: varchar({ length: 50 }).notNull(),
  entityId: uuid(),
  oldData: jsonb(),
  newData: jsonb(),
  reason: text(),
  ipAddress: inet(),
  createdAt: createdAt(),
}, (t) => [
  index("audit_logs_entity_idx").on(t.entityType, t.entityId),
  index("audit_logs_user_idx").on(t.userId, t.createdAt),
  index("audit_logs_action_idx").on(t.action, t.createdAt),
]);

export const systemSettings = pgTable("system_settings", {
  ...stdCols(),
  key: varchar({ length: 100 }).notNull(),
  value: text().notNull(),
  dataType: settingDataType().notNull(),
  accessLevel: settingAccess().notNull().default("STANDARD"),
  groupName: varchar({ length: 50 }).notNull(),
  description: text(),
  updatedBy: uuid().references(() => users.id),
}, (t) => [uniqueIndex("system_settings_key_uq").on(t.key)]); // BR-015

export const documentSequences = pgTable("document_sequences", {
  docType: varchar({ length: 40 }).notNull(),
  periodKey: varchar({ length: 20 }).notNull(), // 2026-10 | 2026 | ALL | 2026-10-07
  lastNumber: integer().notNull().default(0),
  updatedAt: updatedAt(),
}, (t) => [primaryKey({ columns: [t.docType, t.periodKey] })]);

export const documentTemplates = pgTable("document_templates", {
  ...stdCols(),
  documentType: varchar({ length: 40 }).notNull(),
  templateName: varchar({ length: 80 }).notNull(),
  paperSize: varchar({ length: 15 }).notNull(), // A4 | A5 | THERMAL_58 | THERMAL_80
  orientation: varchar({ length: 10 }).notNull().default("PORTRAIT"),
  showLogo: boolean().notNull().default(true),
  showAddress: boolean().notNull().default(true),
  showPhone: boolean().notNull().default(true),
  footerText: text(),
  isActive: boolean().notNull().default(true),
}, (t) => [
  uniqueIndex("document_templates_active_uq").on(t.documentType).where(sql`${t.isActive}`),
]);
