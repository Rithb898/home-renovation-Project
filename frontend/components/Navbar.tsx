"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Main Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* 1. Logo */}
          <Link href="/" className="group z-50 flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            </span>
          </Link>

          {/* 2. Desktop Navigation (Center) */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-red-600 ${
                  pathname === link.href ? "text-red-600" : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. Desktop Actions (Right) - ADDED LOGIN HERE */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 transition-colors hover:text-red-600"
            >
              Log In
            </Link>
            <Link
              href="/signup" // Changed to /signup for "Get Started" flow
              className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:bg-red-500 hover:shadow-red-300"
            >
              Get Started
            </Link>
          </div>

          {/* 4. Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-50 p-2 text-slate-600 transition-colors hover:text-red-600 focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu Dropdown - UPDATED WITH LOGIN/SIGNUP */}
      <div
        className={`absolute top-0 left-0 flex h-screen w-full flex-col items-center justify-center bg-white transition-all duration-300 ease-in-out md:hidden ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-slate-900 hover:text-red-600"
            >
              {link.name}
            </Link>
          ))}

          <div className="mx-auto my-4 h-1 w-12 rounded-full bg-slate-100"></div>

          {/* Mobile Auth Links */}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="text-xl font-semibold text-slate-500 hover:text-red-600"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-red-600 px-8 py-4 font-bold text-white shadow-xl shadow-red-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
