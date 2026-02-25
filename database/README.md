# 数据库说明

## 文件
- `schema.sql`: 表结构定义
- `init.ts`: 初始化脚本（创建表 + 写入测试数据）
- `seed.ts`: 测试数据
- `dev.db`: SQLite 数据库文件（运行 init.ts 后生成）

## 使用
```bash
cd database
npm init -y
npm install better-sqlite3 bcryptjs
npm install -D typescript @types/node @types/better-sqlite3 @types/bcryptjs ts-node
npx ts-node init.ts
```

## 测试账号
| 邮箱 | 密码 | 角色 |
|------|------|------|
| admin@example.com | Admin123! | admin |
| alice@example.com | Alice123! | user |
| bob@example.com | Bob123! | user |
