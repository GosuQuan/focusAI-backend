import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser, setAuthCookie } from '../../../lib/auth';
import { z } from 'zod';
import { cors } from '../../../middleware/cors';
import nc from 'next-connect';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(cors)
  .post(async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await loginUser(validatedData.email, validatedData.password);

      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { user, token } = result;
      setAuthCookie(res, token);

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

export default handler;
