import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/auth';
import { PrismaClient, Role } from '@prisma/client';
import { cors } from '../../../middleware/cors';

const prisma = new PrismaClient();

// 创建基础路由处理器
const handler = createRouter<NextApiRequest, NextApiResponse>()
  .use(cors)
  .get(async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })
  .put(async (req, res) => {
    const { id } = req.query;
    const { role } = req.body;

    if (!id || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { role },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          updatedAt: true,
        },
      });
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
      await prisma.user.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

// 使用 withAuth 包装路由处理器
export default withAuth(handler, Role.ADMIN);
