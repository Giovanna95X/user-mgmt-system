import db from '../config/database';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password_hash?: string;
  role?: UserRole;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function toPublicUser(user: User): PublicUser {
  const { password_hash: _pw, ...publicUser } = user;
  return publicUser;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const UserModel = {
  findAll(): User[] {
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  },

  findById(id: number): User | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  },

  findByEmail(email: string): User | undefined {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  },

  create(input: CreateUserInput): User {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (@name, @email, @password_hash, @role)
    `);
    const info = stmt.run({
      name: input.name,
      email: input.email,
      password_hash: input.password_hash,
      role: input.role ?? 'user',
    });
    return UserModel.findById(info.lastInsertRowid as number) as User;
  },

  update(id: number, input: UpdateUserInput): User | undefined {
    const fields: string[] = [];
    const params: Record<string, unknown> = { id };

    if (input.name !== undefined) {
      fields.push('name = @name');
      params['name'] = input.name;
    }
    if (input.email !== undefined) {
      fields.push('email = @email');
      params['email'] = input.email;
    }
    if (input.password_hash !== undefined) {
      fields.push('password_hash = @password_hash');
      params['password_hash'] = input.password_hash;
    }
    if (input.role !== undefined) {
      fields.push('role = @role');
      params['role'] = input.role;
    }

    if (fields.length === 0) return UserModel.findById(id);

    fields.push("updated_at = CURRENT_TIMESTAMP");

    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = @id`).run(params);
    return UserModel.findById(id);
  },

  delete(id: number): boolean {
    const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return info.changes > 0;
  },

  count(): number {
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return row.count;
  },
};
