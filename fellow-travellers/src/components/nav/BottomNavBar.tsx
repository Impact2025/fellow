"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home_max", label: "Home" },
  { href: "/steps", icon: "route", label: "Stappen" },
  { href: "/companion", icon: "psychology", label: "Companion" },
  { href: "/settings", icon: "settings", label: "Instellingen" },
] as const;

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface/95 z-50 border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(71,101,83,0.06)] backdrop-blur-md">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={label}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300",
              active
                ? "bg-primary-container/20 text-primary"
                : "text-on-surface-variant hover:bg-surface-variant/30"
            )}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
