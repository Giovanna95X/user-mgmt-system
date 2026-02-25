import type { User } from '../types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// 保存 token 到 localStorage
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// 获取 token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// 删除 token
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// 保存用户信息到 localStorage
export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// 获取用户信息
export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

// 删除用户信息
export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

// 判断是否已登录
export function isAuthenticated(): boolean {
  return !!getToken();
}

// 判断当前用户是否为 admin
export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}

// 清除所有认证信息（登出）
export function clearAuth(): void {
  removeToken();
  removeUser();
}
