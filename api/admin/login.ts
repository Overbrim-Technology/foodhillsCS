import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminCookie, isValidAdminPassword } from '../_auth';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (!isValidAdminPassword(password)) {
    return response.status(401).json({ error: 'Invalid admin password' });
  }

  return response
    .setHeader('Set-Cookie', createAdminCookie())
    .status(200)
    .json({ ok: true });
}
