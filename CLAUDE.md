# 用户管理系统 (User Management System)

## 项目概述
一个全栈用户管理系统，支持注册/登录、角色权限、用户 CRUD 操作。

## 技术栈
- **frontend/**: React 18 + TypeScript + Vite + TailwindCSS
- **backend/**: Node.js + Express + TypeScript + JWT 认证
- **database/**: SQLite（开发环境，文件存储在 database/dev.db）

## 目录结构
```
user-mgmt-system/
├── frontend/      # React 前端
├── backend/       # Express API 后端
├── database/      # 数据库 schema 和迁移脚本
└── CLAUDE.md
```

## API 约定
- 基础路径：`/api/v1`
- 认证：JWT Bearer Token，存放在 Authorization header
- 响应格式：`{ success: boolean, data?: any, message?: string }`

## 用户角色
- `admin`：可管理所有用户
- `user`：只能查看/编辑自己的信息

## 核心功能
1. 注册 / 登录 / 登出
2. 获取用户列表（仅 admin）
3. 获取/更新/删除单个用户
4. JWT Token 刷新

## 开发规范
- 使用 TypeScript，严格模式
- API 路由统一在 backend/src/routes/ 下
- 数据库操作统一在 backend/src/models/ 下
- 前端组件放在 frontend/src/components/ 下
- 前端页面放在 frontend/src/pages/ 下
