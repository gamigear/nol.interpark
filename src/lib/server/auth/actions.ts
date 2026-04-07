'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_AUTH_REDIRECTS, ADMIN_SESSION_COOKIE, validateAdminCredentials } from '@/lib/admin-auth';
import { createSessionToken } from '@/lib/server/auth/session';
import { getAdminAuthConfig } from '@/lib/server/auth/config';

export type SignInState = {
  error?: string;
  success?: string;
};

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Vui lòng nhập email và password.' };
  }

  const result = await validateAdminCredentials(email, password);

  if (!result.valid || !result.userId) {
    return { error: 'Email hoặc password không đúng.' };
  }

  // Create a real signed session token
  const config = getAdminAuthConfig();
  const token = createSessionToken(result.userId, config.sessionTtlSeconds);

  // Set the session cookie with the signed token
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.sessionCookieSecure || process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: config.sessionTtlSeconds,
  });

  redirect(ADMIN_AUTH_REDIRECTS.dashboard);
}
