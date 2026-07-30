import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'gobboz_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = { address: string; exp: number };

function sessionSecret(): string {
  // SECURE_HASH is retained for existing deployments; new installations should
  // use the clearer AUTH_SECRET name.
  const secret = process.env.AUTH_SECRET || process.env.SECURE_HASH;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET (or legacy SECURE_HASH) must be a random value of at least 32 characters.');
  }
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

export function createSession(address: string): string {
  const payload = Buffer.from(JSON.stringify({
    address: address.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function setSession(response: NextResponse, address: string) {
  response.cookies.set(SESSION_COOKIE, createSession(address), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export function getAuthenticatedWallet(request: NextRequest): string | null {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.address || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed.address.toLowerCase();
  } catch {
    return null;
  }
}

export function assertSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('host');
  try {
    const originHost = new URL(origin).host;
    return originHost === host || origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function publicUser(user: { walletAddress: string; twitter: string; pullsLeft: number; referralCode: string; referredUsers: string[]; completedTasks: string[]; rewards: unknown[] }) {
  return {
    walletAddress: user.walletAddress,
    twitter: user.twitter,
    pullsLeft: user.pullsLeft,
    referralCode: user.referralCode,
    referredUsers: user.referredUsers,
    completedTasks: user.completedTasks,
    rewards: user.rewards
  };
}
