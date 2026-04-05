"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-secondary-color text-forth-color p-4">
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
        <div className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-primary-color">
            Home
          </Link>
          <Link href="/categories" className="hover:text-primary-color">
            Categories
          </Link>
          <Link href="/dashboard" className="hover:text-primary-color">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
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
        </div>
      )}
    </nav>
  );
}
