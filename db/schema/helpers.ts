import { numeric, timestamp, uuid } from "drizzle-orm/pg-core";

// Builder harus dibuat baru per tabel (tidak boleh dibagi), maka berupa fungsi.
export const pk = () => uuid().primaryKey().defaultRandom();
export const tz = () => timestamp({ withTimezone: true });
export const createdAt = () => tz().notNull().defaultNow();
export const updatedAt = () =>
  tz().notNull().defaultNow().$onUpdate(() => new Date());

/** Kolom standar: id, created_at, updated_at */
export const stdCols = () => ({
  id: pk(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const money = () => numeric({ precision: 15, scale: 2 }); // Rupiah
export const qty = () => numeric({ precision: 14, scale: 3 }); // kuantitas
export const unitCost = () => numeric({ precision: 18, scale: 4 }); // biaya per unit dasar
export const pct = () => numeric({ precision: 5, scale: 2 }); // persen
