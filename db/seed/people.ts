import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import type { Db } from "../index";
import { employeeSalaryHistories, employees, positions, users } from "../schema";

const POSITIONS = ["Manager", "Cashier", "Waiter", "Kitchen", "Steward"] as const;

// [kode, nama, posisi, tanggal masuk, gaji bulanan]
const STAFF: ReadonlyArray<readonly [string, string, string, string, string]> = [
  ["EMP-0001", "Rina Wulandari", "Manager", "2024-01-15", "9000000"],
  ["EMP-0002", "Siti Rahmawati", "Cashier", "2024-03-01", "3200000"],
  ["EMP-0003", "Dewi Lestari", "Cashier", "2025-02-10", "3200000"],
  ["EMP-0004", "Budi Santoso", "Waiter", "2024-05-01", "3500000"],
  ["EMP-0005", "Agus Prasetyo", "Waiter", "2024-06-01", "3400000"],
  ["EMP-0006", "Nina Kartika", "Waiter", "2025-01-05", "3300000"],
  ["EMP-0007", "Rizky Maulana", "Waiter", "2025-04-01", "3300000"],
  ["EMP-0008", "Putri Ayu", "Waiter", "2025-08-01", "3300000"],
  ["EMP-0009", "Fajar Nugroho", "Waiter", "2025-09-15", "3300000"],
  ["EMP-0010", "Andi Wijaya", "Kitchen", "2024-02-01", "4000000"],
  ["EMP-0011", "Hendra Gunawan", "Kitchen", "2024-07-01", "3800000"],
  ["EMP-0012", "Yusuf Hakim", "Kitchen", "2025-01-15", "3600000"],
  ["EMP-0013", "Lia Permata", "Kitchen", "2025-03-01", "3500000"],
  ["EMP-0014", "Tono Suryadi", "Kitchen", "2025-06-01", "3400000"],
  ["EMP-0015", "Wati Handayani", "Steward", "2025-07-01", "3000000"],
];

export async function seedPeople(db: Db): Promise<void> {
  await db.insert(positions).values(POSITIONS.map((name) => ({ name }))).onConflictDoNothing();
  const pos = new Map((await db.select().from(positions)).map((p) => [p.name, p.id]));

  await db.insert(employees).values(
    STAFF.map(([employeeCode, fullName, position, hireDate]) => {
      const positionId = pos.get(position);
      if (!positionId) throw new Error(`Posisi tidak ditemukan: ${position}`);
      return { employeeCode, fullName, positionId, hireDate };
    }),
  ).onConflictDoNothing();
  const emp = new Map((await db.select().from(employees)).map((e) => [e.employeeCode, e.id]));

  // User login: 1 per role. Owner tidak terdaftar sebagai karyawan.
  const password = process.env.SEED_OWNER_PASSWORD ?? "RasaLoka#2026";
  const passwordHash = await hash(password); // Argon2id
  const accountsSeed = [
    { username: "owner", email: "owner@rasaloka.test", role: "OWNER", emp: null },
    { username: "manager", email: "manager@rasaloka.test", role: "MANAGER", emp: "EMP-0001" },
    { username: "cashier", email: "cashier@rasaloka.test", role: "CASHIER", emp: "EMP-0002" },
    { username: "waiter", email: "waiter@rasaloka.test", role: "WAITER", emp: "EMP-0004" },
    { username: "kitchen", email: "kitchen@rasaloka.test", role: "KITCHEN", emp: "EMP-0010" },
  ] as const;
  await db.insert(users).values(
    accountsSeed.map((u) => ({
      username: u.username, email: u.email, role: u.role, passwordHash,
      employeeId: u.emp ? (emp.get(u.emp) ?? null) : null,
      mustChangePassword: true,
    })),
  ).onConflictDoNothing();

  // Salary history (hanya bila employee belum punya)
  const [owner] = await db.select().from(users).where(eq(users.username, "owner"));
  if (!owner) throw new Error("User owner tidak ditemukan");
  const existing = new Set((await db.select().from(employeeSalaryHistories)).map((h) => h.employeeId));
  const rows: Array<typeof employeeSalaryHistories.$inferInsert> = [];
  for (const [code, , , , salary] of STAFF) {
    const employeeId = emp.get(code);
    if (!employeeId || existing.has(employeeId)) continue;
    if (code === "EMP-0004") {
      // Contoh SRS: Budi Rp3.500.000 (s.d. 31-10-2026) lalu Rp3.750.000 mulai 01-11-2026
      rows.push(
        { employeeId, monthlySalary: "3500000", effectiveFrom: "2026-01-01", effectiveTo: "2026-10-31", reason: "Gaji awal 2026", createdBy: owner.id },
        { employeeId, monthlySalary: "3750000", effectiveFrom: "2026-11-01", effectiveTo: null, reason: "Kenaikan gaji", createdBy: owner.id },
      );
    } else {
      rows.push({ employeeId, monthlySalary: salary, effectiveFrom: "2026-01-01", effectiveTo: null, reason: "Gaji awal 2026", createdBy: owner.id });
    }
  }
  if (rows.length > 0) await db.insert(employeeSalaryHistories).values(rows);

  console.log(`  ✓ positions, employees (${STAFF.length}), users (5), salary histories`);
  console.log(`    login demo: owner/manager/cashier/waiter/kitchen — password dari SEED_OWNER_PASSWORD`);
}
