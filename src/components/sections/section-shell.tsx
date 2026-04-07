import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

type SectionShellProps = {
  id?: string;
  className?: string;
  tone?: 'default' | 'plain' | 'highlight';
  children: ReactNode;
};

export function SectionShell({ id, className, tone = 'default', children }: SectionShellProps) {
  return (
    <section id={id} className={cn('section-shell', className)}>
      <div className="container">
        <div
          className={cn(
            'section-panel',
            tone === 'plain' && 'section-panel--plain',
            tone === 'highlight' && 'section-panel--highlight',
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
