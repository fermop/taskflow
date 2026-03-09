"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarThemeToggle } from "./NavbarThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-2 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          TaskFlow
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isAuthPage && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Crear Cuenta
              </Link>
            </>
          )}

          <NavbarThemeToggle />
        </div>
      </div>
    </nav>
  );
}
