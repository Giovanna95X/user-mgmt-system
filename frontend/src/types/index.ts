// 用户角色枚举
export type UserRole = 'admin' | 'user';

// 用户信息类型
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// 认证响应类型（登录/注册接口返回）
export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message?: string;
}

// 通用 API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// 用户列表响应类型
export interface UsersListResponse {
  success: boolean;
  data: User[];
  message?: string;
}

// 登录请求参数
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求参数
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
