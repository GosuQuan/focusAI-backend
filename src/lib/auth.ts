import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: number;
  email: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: JWTPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    'Set-Cookie',
    serialize('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    })
  );
}

export async function verifyAuth(req: NextApiRequest): Promise<JWTPayload | null> {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: any, requiredRole?: Role) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await verifyAuth(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (requiredRole && user.role !== requiredRole && user.role !== Role.ADMIN) {
      console.log(user.role)
      return res.status(403).json({ error: 'need admin' });
    }

    // 将用户信息添加到请求对象
    (req as any).user = user;

    // 检查 handler 类型并相应处理
    if (typeof handler === 'function') {
      return handler(req, res);
    } else if (handler && typeof handler.run === 'function') {
      return handler.run(req, res);
    } else {
      throw new Error('Invalid handler provided to withAuth');
    }
  };
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) return null;

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
}
