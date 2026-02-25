import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { seed } from './seed';

async function init(): Promise<void> {
  const dbPath   = path.join(__dirname, 'dev.db');
  const sqlPath  = path.join(__dirname, 'schema.sql');

  console.log('=== Database Initialization ===');
  console.log(`Database path : ${dbPath}`);
  console.log(`Schema path   : ${sqlPath}`);
  console.log('');

  // 1. 读取并执行 schema.sql
  console.log('[1/3] Applying schema...');
  const schema = fs.readFileSync(sqlPath, 'utf-8');
  const db = new Database(dbPath);
  db.exec(schema);
  console.log('      schema applied successfully.');
  console.log('');

  // 2. 写入测试数据
  console.log('[2/3] Seeding test data...');
  await seed(db);
  console.log('');

  // 3. 验证并打印结果
  console.log('[3/3] Verifying data...');
  const tables = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
    .all() as { name: string }[];

  console.log(`      Tables created: ${tables.map((t) => t.name).join(', ')}`);

  const users = db
    .prepare(`SELECT id, name, email, role, created_at FROM users`)
    .all() as { id: number; name: string; email: string; role: string; created_at: string }[];

  console.log(`      Users inserted: ${users.length}`);
  console.log('');
  console.log('  ID | Name  | Email                   | Role  | Created At');
  console.log('  ---|-------|-------------------------|-------|-------------------');
  for (const u of users) {
    console.log(
      `  ${String(u.id).padEnd(2)} | ${u.name.padEnd(5)} | ${u.email.padEnd(23)} | ${u.role.padEnd(5)} | ${u.created_at}`
    );
  }

  db.close();
  console.log('');
  console.log('=== Initialization complete! dev.db is ready. ===');
}

init().catch((err) => {
  console.error('Initialization failed:', err);
  process.exit(1);
});
