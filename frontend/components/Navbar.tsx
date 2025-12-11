"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main Navigation Links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Hulip<span className="text-red-600">.</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation (Center) */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-red-600 ${
                  pathname === link.href ? 'text-red-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. Desktop Actions (Right) - ADDED LOGIN HERE */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" // Changed to /signup for "Get Started" flow
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-full shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* 4. Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-red-600 transition-colors focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu Dropdown - UPDATED WITH LOGIN/SIGNUP */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full bg-white h-screen flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
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
          
          <div className="w-12 h-1 bg-slate-100 mx-auto my-4 rounded-full"></div>

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
            className="px-8 py-4 bg-red-600 text-white font-bold rounded-full shadow-xl shadow-red-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;