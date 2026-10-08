// db/index.ts — koneksi Drizzle ORM -> Neon PostgreSQL
// Memakai driver WebSocket Pool (neon-serverless) supaya transaksi interaktif
// (SELECT ... FOR UPDATE lalu INSERT) didukung. Driver HTTP TIDAK mendukungnya.
import { config } from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Next.js sudah memuat .env.local sendiri; ini hanya untuk script (seed, tsx, dll).
if (!process.env.DATABASE_URL) {
  config({ path: ".env.local" });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diset. Buat .env.local dari .env.example");
}

// Node < 22 belum punya WebSocket global.
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

// Cegah pembuatan Pool berulang saat hot-reload di development.
const globalForDb = globalThis as unknown as { __rasalokaPool?: Pool };
export const pool: Pool =
  globalForDb.__rasalokaPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") {
  globalForDb.__rasalokaPool = pool;
}

export const db = drizzle({ client: pool, schema, casing: "snake_case" });

export type Db = typeof db;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export * from "./schema";
export { schema };
