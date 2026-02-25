import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const SALT_ROUNDS = 10;

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const seedUsers: SeedUser[] = [
  { name: 'Admin', email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
  { name: 'Alice', email: 'alice@example.com', password: 'Alice123!', role: 'user' },
  { name: 'Bob',   email: 'bob@example.com',   password: 'Bob123!',   role: 'user' },
];

export function seed(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role)
    VALUES (@name, @email, @password_hash, @role)
  `);

  const insertMany = db.transaction((users: SeedUser[]) => {
    for (const user of users) {
      const password_hash = bcrypt.hashSync(user.password, SALT_ROUNDS);
      insert.run({ name: user.name, email: user.email, password_hash, role: user.role });
      console.log(`  [seed] Inserted user: ${user.email} (role: ${user.role})`);
    }
  });

  insertMany(seedUsers);
}

// 直接执行时的入口
if (require.main === module) {
  const dbPath = path.join(__dirname, 'dev.db');
  const db = new Database(dbPath);
  try {
    seed(db);
    console.log('Seed completed.');
  } catch (err: unknown) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
}
