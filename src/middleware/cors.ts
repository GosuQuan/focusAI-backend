import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export function cors(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  // 设置允许的源为前端应用的地址
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  
  // 允许携带凭证（cookies）
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // 允许的请求方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // 允许的请求头
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return next();
}
