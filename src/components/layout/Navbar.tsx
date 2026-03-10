"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { NavbarThemeToggle } from "./NavbarThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/#about", label: "Acerca de", alwaysShow: true },
    { href: "/#contribute", label: "Colabora", alwaysShow: true },
    ...(user
      ? [{ href: "/proyectos", label: "Ir a mis proyectos", alwaysShow: true }]
      : [
          { href: "/login", label: "Iniciar Sesión", alwaysShow: false },
          { href: "/register", label: "Crear Cuenta", alwaysShow: false },
        ]),
  ];

  return (
    <nav className="max-w-4xl mx-auto fixed top-4 left-0 right-0 z-50 p-2 border border-stone-200/50 dark:border-stone-700/30 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-full shadow-sm shadow-stone-900/5 dark:shadow-black/20">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
          TaskFlow
        </Link>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/#about"
            className="px-3.5 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all duration-200"
          >
            Acerca de
          </Link>
          <Link
            href="/#contribute"
            className="px-3.5 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all duration-200"
          >
            Colabora
          </Link>

          {!isAuthPage && (
            <>
              {user ? (
                <Link
                  href="/proyectos"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 dark:bg-amber-500 text-white hover:bg-amber-700 dark:hover:bg-amber-400 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                >
                  Ir a mis proyectos
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200"
                  >
                    Crear Cuenta
                  </Link>
                </>
              )}
            </>
          )}

          <NavbarThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="mobile-only items-center gap-1">
          <NavbarThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Abrir menú</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-sidebar">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks
                  .filter((link) => link.alwaysShow || !isAuthPage)
                  .map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
