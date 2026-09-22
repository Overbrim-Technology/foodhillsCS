import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'foodhills_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const getSecret = () => process.env.ADMIN_SESSION_SECRET || '';

export const hasAdminConfiguration = () => Boolean(process.env.ADMIN_PASSWORD && getSecret());

const sign = (value: string) => createHmac('sha256', getSecret()).update(value).digest('hex');

export const createAdminCookie = () => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}`;
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
};

export const isAdminRequest = (cookieHeader = '') => {
  const token = cookieHeader
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  if (!token || !getSecret()) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;

  const expected = sign(expiresAt);
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

export const isValidAdminPassword = (password: string) => {
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  if (!configuredPassword || password.length !== configuredPassword.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(configuredPassword));
};
