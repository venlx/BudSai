"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
  }

  return (
    <nav className="sticky top-0 z-50 bg-secondary-color text-forth-color p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 BudSai</h1>

        {/* Burger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-6 h-0.5 bg-primary-color"></span>
          <span className="w-6 h-0.5 bg-primary-color"></span>
          <span className="w-6 h-0.5 bg-primary-color"></span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {session && (
            <>
              <Link href="/" className="hover:text-primary-color">
                Home
              </Link>
              <Link href="/categories" className="hover:text-primary-color">
                Categories
              </Link>
              <Link href="/dashboard" className="hover:text-primary-color">
                Dashboard
              </Link>
              <Link href="/settings" className="hover:text-primary-color">
                Settings
              </Link>
            </>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="hover:text-primary-color"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/sign-in" className="hover:text-primary-color">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          {session && (
            <>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary-color"
              >
                Home
              </Link>
              <span className="h-0.5 bg-third-color"></span>
              <Link
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary-color"
              >
                Categories
              </Link>
              <span className="h-0.5 bg-third-color"></span>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary-color"
              >
                Dashboard
              </Link>
              <span className="h-0.5 bg-third-color"></span>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary-color"
              >
                Settings
              </Link>
              <span className="h-0.5 bg-third-color"></span>
            </>
          )}
          {session ? (
            <button
              onClick={() => {
                setIsOpen(false);
                void handleSignOut();
              }}
              className="text-left hover:text-primary-color"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary-color"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
