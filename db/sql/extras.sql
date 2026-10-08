-- db/sql/extras.sql
-- Constraint & trigger yang TIDAK dapat diekspresikan di schema Drizzle.
-- Jalankan SEKALI setelah migrasi pertama (drizzle-kit migrate), mis.:
--   psql "$DATABASE_URL_UNPOOLED" -f db/sql/extras.sql
-- atau tempel ke migrasi kustom: drizzle-kit generate --custom --name=extras

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1) Salary history tidak boleh overlap per employee (BR-EMP-001)
ALTER TABLE employee_salary_histories
  ADD CONSTRAINT employee_salary_no_overlap
  EXCLUDE USING gist (
    employee_id WITH =,
    daterange(effective_from, effective_to, '[]') WITH &&
  );

-- 2) Immutability: stock_movements, journal_lines, audit_logs (BR-INV-002, BR-ACC-002)
CREATE OR REPLACE FUNCTION forbid_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Tabel % bersifat append-only (% ditolak)', TG_TABLE_NAME, TG_OP;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movements_immutable BEFORE UPDATE OR DELETE ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER journal_lines_immutable BEFORE UPDATE OR DELETE ON journal_lines
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER audit_logs_immutable BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();

-- journal_entries: tidak boleh dihapus; hanya kolom status yang boleh berubah (POSTED -> REVERSED)
CREATE OR REPLACE FUNCTION journal_entries_guard() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'journal_entries tidak boleh dihapus';
  END IF;
  IF (to_jsonb(NEW) - 'status') IS DISTINCT FROM (to_jsonb(OLD) - 'status') THEN
    RAISE EXCEPTION 'journal_entries immutable; hanya status yang boleh berubah';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER journal_entries_immutable BEFORE UPDATE OR DELETE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION journal_entries_guard();

-- 3) Debit = Credit per jurnal, diperiksa saat COMMIT (BR-005)
CREATE OR REPLACE FUNCTION check_journal_balanced() RETURNS trigger AS $$
DECLARE d numeric; c numeric;
BEGIN
  SELECT COALESCE(SUM(debit), 0), COALESCE(SUM(credit), 0) INTO d, c
  FROM journal_lines WHERE entry_id = NEW.entry_id;
  IF d <> c OR d = 0 THEN
    RAISE EXCEPTION 'Jurnal % tidak seimbang (debit %, kredit %)', NEW.entry_id, d, c;
  END IF;
  RETURN NULL;
END $$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER journal_lines_balanced
  AFTER INSERT ON journal_lines
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION check_journal_balanced();

-- 4) Komponen payroll hanya boleh berubah saat periode OPEN (BR-PAY-005)
CREATE OR REPLACE FUNCTION payroll_components_guard() RETURNS trigger AS $$
DECLARE st payroll_period_status; item uuid;
BEGIN
  item := COALESCE(NEW.payroll_item_id, OLD.payroll_item_id);
  SELECT p.status INTO st FROM payroll_items i
    JOIN payroll_periods p ON p.id = i.period_id WHERE i.id = item;
  IF st <> 'OPEN' THEN
    RAISE EXCEPTION 'Payroll period % tidak OPEN; komponen tidak dapat diubah', st;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$ LANGUAGE plpgsql;

CREATE TRIGGER payroll_components_guard BEFORE INSERT OR UPDATE OR DELETE ON payroll_item_components
  FOR EACH ROW EXECUTE FUNCTION payroll_components_guard();
