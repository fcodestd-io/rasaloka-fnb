// Akuntansi: chart of accounts, jurnal (append-only), baris jurnal
import { sql } from "drizzle-orm";
import {
  type AnyPgColumn, boolean, check, date, index, integer, pgTable, text,
  uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";
import { accountType, journalStatus, normalBalance } from "./enums";
import { money, pk, stdCols, tz } from "./helpers";
import { approvals, users } from "./identity";

export const accounts = pgTable("accounts", {
  ...stdCols(),
  code: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 120 }).notNull(),
  accountType: accountType().notNull(),
  normalBalance: normalBalance().notNull(),
  systemKey: varchar({ length: 40 }), // CASH, AR, AP, ... dipakai posting engine
  isSystem: boolean().notNull().default(false),
  isActive: boolean().notNull().default(true),
}, (t) => [
  uniqueIndex("accounts_code_uq").on(t.code),
  uniqueIndex("accounts_system_key_uq").on(t.systemKey),
]);

export const journalEntries = pgTable("journal_entries", {
  id: pk(),
  entryNumber: varchar({ length: 40 }).notNull(),
  entryDate: date().notNull(),
  sourceType: varchar({ length: 40 }).notNull(),
  sourceId: uuid(), // NULL hanya untuk jurnal manual
  eventCode: varchar({ length: 40 }).notNull(),
  description: text().notNull(),
  status: journalStatus().notNull().default("POSTED"),
  reversalOfId: uuid().references((): AnyPgColumn => journalEntries.id),
  correctionApprovalId: uuid().references(() => approvals.id),
  totalAmount: money().notNull(),
  postedBy: uuid().notNull().references(() => users.id),
  postedAt: tz().notNull().defaultNow(),
}, (t) => [
  uniqueIndex("journal_entries_number_uq").on(t.entryNumber),
  // BR-ACC-003: satu event bisnis = satu jurnal (cegah double posting)
  uniqueIndex("journal_entries_source_uq")
    .on(t.sourceType, t.sourceId, t.eventCode)
    .where(sql`${t.sourceId} IS NOT NULL`),
  index("journal_entries_date_idx").on(t.entryDate),
  index("journal_entries_source_idx").on(t.sourceType, t.sourceId),
]);

export const journalLines = pgTable("journal_lines", {
  id: pk(),
  entryId: uuid().notNull().references(() => journalEntries.id),
  lineNo: integer().notNull(),
  accountId: uuid().notNull().references(() => accounts.id),
  debit: money().notNull().default("0"),
  credit: money().notNull().default("0"),
  memo: text(),
}, (t) => [
  uniqueIndex("journal_lines_entry_line_uq").on(t.entryId, t.lineNo),
  index("journal_lines_account_idx").on(t.accountId),
  // BR-ACC-001: tiap baris hanya debit ATAU kredit (> 0)
  check("journal_lines_one_side", sql`(${t.debit} > 0 AND ${t.credit} = 0) OR (${t.credit} > 0 AND ${t.debit} = 0)`),
]);
