import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin } from '../middleware/auth';
import { UserModel, UpdateUserInput, toPublicUser, UserRole } from '../models/user';

const router = Router();

// All users routes require authentication
router.use(authenticate);

// ─── GET / — list all users (admin only) ─────────────────────────────────────

router.get('/', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const users = UserModel.findAll().map(toPublicUser);
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('[GET /users]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET /:id — get single user (self or admin) ───────────────────────────────

router.get('/:id', (req: Request, res: Response): void => {
  try {
    const targetId = parseInt(req.params['id'] as string, 10);
    if (isNaN(targetId)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }

    const currentUser = req.user!;
    if (currentUser.role !== 'admin' && currentUser.userId !== targetId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const user = UserModel.findById(targetId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: toPublicUser(user) });
  } catch (err) {
    console.error('[GET /users/:id]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── PUT /:id — update user (self or admin) ───────────────────────────────────

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const targetId = parseInt(req.params['id'] as string, 10);
    if (isNaN(targetId)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }

    const currentUser = req.user!;
    if (currentUser.role !== 'admin' && currentUser.userId !== targetId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const existing = UserModel.findById(targetId);
    if (!existing) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    // Only admins can change roles
    if (role !== undefined && currentUser.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only admins can change roles' });
      return;
    }

    if (role !== undefined && role !== 'user' && role !== 'admin') {
      res.status(400).json({ success: false, message: 'role must be "user" or "admin"' });
      return;
    }

    // Check email uniqueness if changing
    if (email && email !== existing.email) {
      const collision = UserModel.findByEmail(email);
      if (collision) {
        res.status(409).json({ success: false, message: 'Email already in use' });
        return;
      }
    }

    const update: UpdateUserInput = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role as UserRole;
    if (password) {
      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        return;
      }
      update.password_hash = await bcrypt.hash(password, 12);
    }

    const updated = UserModel.update(targetId, update);
    res.json({ success: true, data: toPublicUser(updated!) });
  } catch (err) {
    console.error('[PUT /users/:id]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── DELETE /:id — delete user (admin only) ───────────────────────────────────

router.delete('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const targetId = parseInt(req.params['id'] as string, 10);
    if (isNaN(targetId)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }

    const deleted = UserModel.delete(targetId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (err) {
    console.error('[DELETE /users/:id]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
