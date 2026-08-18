"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pokemon", label: "Pokémon" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" prefetch={false} className="site-brand group focus-pokemon">
          <span
            className="site-brand-mark"
            aria-hidden="true"
          >
            <span className="site-brand-mark-ball" />
          </span>
          <span className="site-brand-copy">
            <span className="site-brand-title">Pokémon Explorer</span>
            <span className="site-brand-tagline">browse · search · save</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="site-nav">
          <ul className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-4 md:flex md:flex-wrap">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="min-w-0">
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "site-nav-link",
                      active ? "site-nav-link-active" : "site-nav-link-idle",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
