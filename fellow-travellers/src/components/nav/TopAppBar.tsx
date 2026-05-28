"use client";

import Link from "next/link";

interface TopAppBarProps {
  title: string;
  icon?: string;
  subtitle?: string;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export default function TopAppBar({
  title,
  icon = "spa",
  subtitle,
  backHref,
  rightAction,
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
      <div className="flex items-center justify-between px-6 h-16 max-w-screen-md mx-auto">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </Link>
          ) : (
            <span className="material-symbols-outlined text-primary">{icon}</span>
          )}
          <div>
            <h1 className="text-headline-md text-primary tracking-tight leading-none">{title}</h1>
            {subtitle && (
              <p className="text-label-sm text-outline mt-0.5 font-normal tracking-normal">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
      </div>
    </header>
  );
}
