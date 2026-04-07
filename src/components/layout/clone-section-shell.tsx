import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type SectionShellTone = 'default' | 'subtle' | 'dark';

type CloneSectionShellProps = {
  children: ReactNode;
  className?: string;
  tone?: SectionShellTone;
  id?: string;
};

const toneClassMap: Record<SectionShellTone, string> = {
  default: 'bg-white',
  subtle: 'bg-neutral-50',
  dark: 'bg-neutral-950 text-white',
};

export function CloneSectionShell({
  children,
  className,
  tone = 'default',
  id,
}: CloneSectionShellProps) {
  return (
    <section id={id} className={cn('py-8 md:py-12 xl:py-16', toneClassMap[tone], className)}>
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-5 md:px-6 xl:px-8">{children}</div>
    </section>
  );
}
