'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signInAction, type SignInState } from '@/lib/server/auth/actions';

export default function AdminSignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, {} as SignInState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Sign in to world.nol CMS</h2>
          <p className="mt-2 text-sm text-gray-600">
            Admin authentication — credential flow
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {state.error}
            </div>
          )}

          <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <strong>Access note:</strong> Use an admin account provisioned in the auth bootstrap layer. This screen validates credentials only — password reset and MFA flows are still handled separately.
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/en" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to public homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
