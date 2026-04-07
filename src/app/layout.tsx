import type { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'world.nol.com clone',
  description: 'Homepage skeleton for a world.nol.com-inspired Next.js App Router build.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
