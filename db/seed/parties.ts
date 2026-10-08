import type { Db } from "../index";
import {
  accounts, complaintCategories, customers, documentTemplates, expenseCategories, suppliers,
} from "../schema";

export async function seedParties(db: Db): Promise<void> {
  await db.insert(complaintCategories).values(
    ["Kualitas Makanan", "Kecepatan Layanan", "Kebersihan", "Sikap Staf", "Kesalahan Order", "Harga / Tagihan", "Lainnya"]
      .map((name) => ({ name })),
  ).onConflictDoNothing();

  // Kategori OPEX -> akun beban (kode akun dari seed accounts)
  const acc = new Map((await db.select().from(accounts)).map((a) => [a.code, a.id]));
  const cats: ReadonlyArray<readonly [string, string, boolean]> = [
    ["Salary", "6000", true], // sistem: berasal dari payroll, bukan input manual
    ["Electricity", "6010", false],
    ["Rent", "6020", false],
    ["Internet", "6030", false],
    ["Maintenance", "6040", false],
    ["Transport", "6050", false],
    ["Office Supplies", "6060", false],
    ["Administration", "6070", false],
    ["Other", "6090", false],
  ];
  await db.insert(expenseCategories).values(
    cats.map(([name, code, isSystem]) => {
      const accountId = acc.get(code);
      if (!accountId) throw new Error(`Akun ${code} belum ada (jalankan seedAccounts dulu)`);
      return { name, accountId, isSystem };
    }),
  ).onConflictDoNothing();

  await db.insert(suppliers).values([
    { supplierCode: "SUP-0001", name: "Pasar Induk Segar", contactName: "Pak Dedi", phone: "0812-0000-0001", paymentTermsDays: 7 },
    { supplierCode: "SUP-0002", name: "CV Daging Prima", contactName: "Bu Ratna", phone: "0812-0000-0002", paymentTermsDays: 14 },
    { supplierCode: "SUP-0003", name: "UD Ikan Segar Nusantara", contactName: "Pak Joko", phone: "0812-0000-0003", paymentTermsDays: 7 },
    { supplierCode: "SUP-0004", name: "PT Sembako Jaya", contactName: "Bu Lina", phone: "0812-0000-0004", paymentTermsDays: 30 },
    { supplierCode: "SUP-0005", name: "Toko Bumbu Berkah", contactName: "Pak Haji Umar", phone: "0812-0000-0005", paymentTermsDays: 14 },
    { supplierCode: "SUP-0006", name: "CV Minuman Nusantara", contactName: "Bu Sari", phone: "0812-0000-0006", paymentTermsDays: 30 },
  ]).onConflictDoNothing();

  await db.insert(customers).values([
    { customerCode: "CUS-0001", name: "PT Maju Bersama", customerType: "CORPORATE", phone: "022-1111111" },
    { customerCode: "CUS-0002", name: "Keluarga Bpk. Hendro", customerType: "INDIVIDUAL", phone: "0813-0000-0001" },
    { customerCode: "CUS-0003", name: "Arisan Ibu-ibu Melati", customerType: "INDIVIDUAL", phone: "0813-0000-0002" },
    { customerCode: "CUS-0004", name: "CV Karya Mandiri", customerType: "CORPORATE", phone: "022-2222222" },
    { customerCode: "CUS-0005", name: "Komunitas Sepeda Lembang", customerType: "INDIVIDUAL", phone: "0813-0000-0003" },
  ]).onConflictDoNothing();

  const footer = "Dokumen ini dihasilkan oleh sistem RasaLoka.";
  await db.insert(documentTemplates).values([
    { documentType: "RECEIPT", templateName: "Struk Thermal 80mm", paperSize: "THERMAL_80", footerText: "Terima kasih atas kunjungan Anda" },
    { documentType: "INVOICE", templateName: "Invoice A4", paperSize: "A4", footerText: footer },
    { documentType: "CREDIT_NOTE", templateName: "Credit Note A4", paperSize: "A4", footerText: footer },
    { documentType: "AR_PAYMENT", templateName: "Receipt Pembayaran A5", paperSize: "A5", orientation: "LANDSCAPE", footerText: footer },
    { documentType: "SUPPLIER_INVOICE", templateName: "Invoice Supplier (AP) A4", paperSize: "A4", footerText: footer },
    { documentType: "SUPPLIER_PAYMENT", templateName: "Voucher Pembayaran A5", paperSize: "A5", orientation: "LANDSCAPE", footerText: footer },
    { documentType: "PURCHASE_ORDER", templateName: "Purchase Order A4", paperSize: "A4", footerText: footer },
    { documentType: "GOODS_RECEIPT", templateName: "Goods Receipt A4", paperSize: "A4", footerText: footer },
    { documentType: "PAYSLIP", templateName: "Slip Gaji A4", paperSize: "A4", footerText: "Slip gaji ini sah tanpa tanda tangan basah." },
  ]).onConflictDoNothing();

  console.log("  ✓ complaint categories, expense categories, suppliers, customers, document templates");
}
