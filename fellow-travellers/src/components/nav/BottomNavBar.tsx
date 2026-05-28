"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard",    icon: "home_max",   label: "Home" },
  { href: "/steps",        icon: "route",      label: "Stappen" },
  { href: "/companion",    icon: "psychology", label: "Companion" },
  { href: "/settings",     icon: "settings",   label: "Meer" },
] as const;

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-outline-variant/20 pb-safe">
      <div className="flex justify-around items-center px-2 py-2 max-w-screen-md mx-auto">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[64px] ${
                active
                  ? "bg-primary-container/25 text-primary"
                  : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] transition-all duration-200"
                style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : { fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                {icon}
              </span>
              <span
                className={`text-[10px] font-medium leading-none tracking-wide transition-all duration-200 ${
                  active ? "opacity-100" : "opacity-70"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
