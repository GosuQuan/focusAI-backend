# Next.js Backend User Management System - 创建步骤

## 1. 项目初始化
```bash
# 创建项目
npx create-next-app@latest nextjs-backend
# 选择以下选项：
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? (recommended) Yes
# ✔ Would you like to customize the default import alias (@/*)? No

# 安装依赖
cd nextjs-backend
cnpm install @prisma/client mysql2 prisma
```

## 2. 数据库配置
```bash
# 初始化Prisma
npx prisma init

# 创建数据库架构 (prisma/schema.prisma)
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

# 配置环境变量 (.env)
DATABASE_URL="mysql://root:123456@localhost:3306/user_management"

# 生成Prisma客户端
npx prisma generate

# 同步数据库
npx prisma db push
```

## 3. API路由实现

### 创建用户列表路由 (src/app/api/users/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### 创建单个用户操作路由 (src/app/api/users/[id]/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const user = await prisma.user.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
```

## 4. CORS配置
创建中间件 (src/middleware.ts)：
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  
  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

## 5. Next.js配置
创建 next.config.js：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}
```

## 6. 启动项目
```bash
npm run dev
```

## 注意事项
1. 确保MySQL服务已启动
2. 检查数据库连接字符串是否正确
3. 确保已执行 prisma generate 和 prisma db push
4. 检查所有依赖是否正确安装

## API端点
- GET /api/users - 获取所有用户
- POST /api/users - 创建新用户
- GET /api/users/[id] - 获取单个用户
- PUT /api/users/[id] - 更新用户
- DELETE /api/users/[id] - 删除用户
