import type { Db } from "../index";
import { systemSettings } from "../schema";

type Row = typeof systemSettings.$inferInsert;
type DT = Row["dataType"];
type AL = NonNullable<Row["accessLevel"]>;
// [key, value, tipe, access, group, deskripsi]
type S = readonly [string, string, DT, AL, string, string];

const GENERAL: readonly S[] = [
  ["restaurant.name", "RasaLoka Kitchen & Eatery", "STRING", "STANDARD", "restaurant", "Nama restoran (header dokumen)"],
  ["restaurant.address", "Jl. Contoh No. 1, Bandung, Jawa Barat", "STRING", "STANDARD", "restaurant", "Alamat restoran"],
  ["restaurant.phone", "022-0000000", "STRING", "STANDARD", "restaurant", "Telepon"],
  ["restaurant.email", "halo@rasaloka.test", "STRING", "STANDARD", "restaurant", "Email kontak (informasi saja)"],
  ["restaurant.logo_url", "", "STRING", "STANDARD", "restaurant", "URL logo di Cloudinary"],
  ["restaurant.business_hours", JSON.stringify({ mon_fri: "10:00-22:00", sat_sun: "09:00-23:00" }), "JSON", "STANDARD", "restaurant", "Jam operasional"],
  ["system.currency", "IDR", "STRING", "CRITICAL", "system", "Mata uang"],
  ["system.timezone", "Asia/Jakarta", "STRING", "CRITICAL", "system", "Zona waktu bisnis"],
  ["code.customer.prefix", "CUS", "STRING", "STANDARD", "code", "Prefix kode customer"],
  ["code.supplier.prefix", "SUP", "STRING", "STANDARD", "code", "Prefix kode supplier"],
  ["code.employee.prefix", "EMP", "STRING", "STANDARD", "code", "Prefix kode karyawan"],
  ["inventory.default_low_stock_threshold", "0", "DECIMAL", "STANDARD", "inventory", "Batas low stock bila safety_stock = 0"],
  ["inventory.allow_negative_stock", "false", "BOOLEAN", "CRITICAL", "inventory", "Izinkan stok negatif (BR-INV-004)"],
  ["inventory.adjustment_approval_threshold", "2000000", "DECIMAL", "CRITICAL", "inventory", "Nilai adjustment (Rp) yang butuh approval Owner"],
  ["purchasing.over_receipt_tolerance_percent", "0", "DECIMAL", "STANDARD", "purchasing", "Toleransi over-receipt (%)"],
  ["purchasing.price_tolerance_percent", "0", "DECIMAL", "STANDARD", "purchasing", "Toleransi selisih harga invoice vs PO (%)"],
  ["ar.default_payment_terms_days", "14", "INTEGER", "STANDARD", "receivables", "Jatuh tempo default invoice event (hari)"],
  ["complaint.window_days", "7", "INTEGER", "STANDARD", "complaint", "Batas hari complaint untuk order COMPLETED"],
  ["sales.tax_percent", "0", "DECIMAL", "CRITICAL", "sales", "Pajak sederhana per order (%)"],
  ["payroll.payment_day", "25", "INTEGER", "STANDARD", "payroll", "Tanggal gaji"],
  ["accounting.fiscal_year_start_month", "1", "INTEGER", "CRITICAL", "accounting", "Bulan awal tahun fiskal"],
  ["accounting.payment_method_accounts", JSON.stringify({ CASH: "1000", BANK_TRANSFER: "1010", QRIS_MANUAL: "1010", DEBIT_CARD: "1010", OTHER: "1010" }), "JSON", "CRITICAL", "accounting", "Pemetaan metode pembayaran ke kode akun kas/bank"],
  ["mrp.default_horizon_days", "7", "INTEGER", "STANDARD", "mrp", "Horizon perencanaan MRP (hari)"],
  ["mrp.include_event_demand", "true", "BOOLEAN", "STANDARD", "mrp", "Sertakan kontrak event sebagai demand"],
  ["auth.max_failed_logins", "5", "INTEGER", "CRITICAL", "auth", "Maksimum login gagal sebelum dikunci"],
  ["auth.lockout_minutes", "15", "INTEGER", "CRITICAL", "auth", "Lama kunci akun (menit)"],
  ["auth.session_hours", "8", "INTEGER", "CRITICAL", "auth", "Masa berlaku sesi (jam)"],
];

// [tipe dokumen, format, reset]  token: {YYYY} {YY} {MM} {DD} {SEQ:n}
const DOCS: ReadonlyArray<readonly [string, string, string]> = [
  ["ORDER", "ORD/{YYYY}{MM}{DD}/{SEQ:4}", "DAILY"],
  ["RECEIPT", "RCP/{YYYY}{MM}{DD}/{SEQ:4}", "DAILY"],
  ["EVENT_CONTRACT", "CTR/{YYYY}/{SEQ:4}", "YEARLY"],
  ["INVOICE", "INV/{YYYY}{MM}/{SEQ:5}", "MONTHLY"],
  ["CREDIT_NOTE", "CN/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["REFUND", "RFD/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["AR_PAYMENT", "ARP/{YYYY}{MM}/{SEQ:5}", "MONTHLY"],
  ["PURCHASE_ORDER", "PO/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["GOODS_RECEIPT", "GR/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["SUPPLIER_INVOICE", "AP/{YYYY}{MM}/{SEQ:5}", "MONTHLY"],
  ["SUPPLIER_PAYMENT", "SPV/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["SUPPLIER_RETURN", "RTN/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["STOCK_ADJUSTMENT", "ADJ/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["PAYSLIP", "PSL/{YYYY}{MM}/{SEQ:5}", "MONTHLY"],
  ["EXPENSE", "EXP/{YYYY}{MM}/{SEQ:4}", "MONTHLY"],
  ["JOURNAL", "JV/{YYYY}/{SEQ:6}", "YEARLY"],
  ["MRP_RUN", "MRP/{YYYY}{MM}/{SEQ:3}", "MONTHLY"],
  ["EMPLOYEE_CODE", "EMP-{SEQ:4}", "NEVER"],
  ["CUSTOMER_CODE", "CUS-{SEQ:4}", "NEVER"],
  ["SUPPLIER_CODE", "SUP-{SEQ:4}", "NEVER"],
];

export async function seedSettings(db: Db): Promise<void> {
  const docRows: S[] = DOCS.flatMap(([type, format, reset]): S[] => [
    [`doc.${type}.format`, format, "STRING", "STANDARD", "document", `Format nomor ${type}`],
    [`doc.${type}.reset`, reset, "STRING", "STANDARD", "document", `Reset sequence ${type}`],
  ]);
  const all = [...GENERAL, ...docRows];
  await db.insert(systemSettings).values(
    all.map(([key, value, dataType, accessLevel, groupName, description]) => ({
      key, value, dataType, accessLevel, groupName, description,
    })),
  ).onConflictDoNothing(); // BR-015: key unik
  console.log(`  ✓ system_settings (${all.length})`);
}
