"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Hash,
  House,
  Layers,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: House },
  { href: "/course", label: "Course", icon: GraduationCap },
  { href: "/write", label: "Write", icon: PenLine },
  { href: "/practice", label: "Practice", icon: Layers },
  { href: "/numbers", label: "Numbers", icon: Hash },
  { href: "/alphabet", label: "Alphabet", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="glyph text-xl leading-none">ქ</span>
            <span className="font-heading hidden text-sm font-semibold tracking-tight sm:inline">
              Georgian Space
            </span>
          </Link>

          <nav className="flex flex-1 items-center gap-2 overflow-x-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground ring-1 ring-primary/30"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t border-border/70 py-6">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          Georgian Space — learn the alphabet by hand.
          Progress is stored locally in your browser.
        </p>
      </footer>
    </div>
  );
}
