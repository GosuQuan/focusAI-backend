# Next.js 后端项目

这是一个使用 Next.js 13+ 构建的后端项目，实现了基本的用户管理系统。

## 前置知识

在开始之前，建议了解以下技术：

1. **基础知识**
   - JavaScript/TypeScript 基础
   - Node.js 基础
   - SQL 基础
   - RESTful API 设计原则

2. **核心技术栈**
   - Next.js 13+ (App Router)
   - TypeScript
   - Prisma (ORM)
   - MySQL

3. **推荐学习资源**
   - [Next.js 官方文档](https://nextjs.org/docs)
   - [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
   - [Prisma 官方文档](https://www.prisma.io/docs/)
   - [MySQL 教程](https://dev.mysql.com/doc/refman/8.0/en/)

## 环境要求

- Node.js 16.14 或更高版本
- MySQL 8.0 或更高版本
- npm 或 cnpm

## 目录结构

```
nextjs-backend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       ├── route.ts            # 用户列表 API
│   │   │       └── [id]/
│   │   │           └── route.ts        # 单个用户 API
│   │   └── page.tsx                    # 首页
│   └── scripts/
│       └── seed.js                     # 数据库种子脚本
├── prisma/
│   └── schema.prisma                   # 数据库模型定义
├── .env                                # 环境变量配置
├── package.json
└── README.md
```

## 快速开始

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd nextjs-backend
   ```

2. **安装依赖**
   ```bash
   cnpm install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 为 `.env`
   - 修改数据库连接信息：
     ```
     DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"
     ```

4. **初始化数据库**
   ```bash
   npx prisma db push
   ```

5. **生成测试数据**
   ```bash
   node scripts/seed.js
   ```

6. **启动开发服务器**
   ```bash
   npm run dev
   ```

## API 接口

### 用户管理 API

1. **获取用户列表**
   - GET `/api/users`
   - 返回所有用户列表

2. **创建新用户**
   - POST `/api/users`
   - 请求体：
     ```json
     {
       "name": "用户名",
       "email": "邮箱",
       "phone": "电话"
     }
     ```

3. **获取单个用户**
   - GET `/api/users/[id]`
   - 返回指定 ID 的用户信息

4. **更新用户**
   - PUT `/api/users/[id]`
   - 请求体同创建用户

5. **删除用户**
   - DELETE `/api/users/[id]`
   - 删除指定 ID 的用户

## 开发流程

1. **功能开发**
   - 在 `src/app/api` 下创建新的 API 路由
   - 在 `prisma/schema.prisma` 中定义新的数据模型
   - 运行 `npx prisma db push` 更新数据库结构

2. **测试**
   - 使用 Postman 或其他 API 测试工具测试接口
   - 检查数据库中的数据是否正确

3. **部署**
   - 确保所有环境变量配置正确
   - 运行 `npm run build` 构建项目
   - 使用 `npm start` 启动生产服务器

## 常见问题

1. **数据库连接问题**
   - 检查 MySQL 服务是否启动
   - 验证数据库用户名和密码
   - 确认数据库是否创建

2. **API 404 错误**
   - 检查路由文件名是否正确
   - 确认 API 路径是否正确
   - 验证 HTTP 方法是否正确

3. **Prisma 相关问题**
   - 运行 `npx prisma generate` 重新生成客户端
   - 确保数据库结构与 schema 一致

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。
