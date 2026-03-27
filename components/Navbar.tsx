"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

const CATEGORIES = [
  "NOUVEAUTÉS", "BAGUES", "COLLIERS", "BRACELETS",
  "BOUCLES", "PIERRES NATURELLES", "COLLECTIONS"
];

/**
 * Main navigation bar component.
 * Glassmorphism at top of page, solid white when scrolled.
 */
export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isGlass = !scrolled && !mobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${isGlass
        ? "bg-white/10 backdrop-blur-md"
        : "bg-white/95 backdrop-blur-sm shadow-md"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row: Logo + Nav + Cart */}
        <div className="flex h-20 items-center justify-between border-b-2 border-b-[#d4af37]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-page.png"
              alt="Elvaris Jewelry"
              width={360}
              height={220}
              className="h-14 w-auto object-contain sm:h-16"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${isGlass
                ? "text-white/90 hover:text-[#d4af37]"
                : "text-gray-800 hover:text-[#d4af37]"
                }`}
            >
              Home
            </Link>
            <Link
              href="/#products"
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${isGlass
                ? "text-white/90 hover:text-[#d4af37]"
                : "text-gray-800 hover:text-[#d4af37]"
                }`}
            >
              Shop
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-6 w-6 transition-colors duration-300 ${isGlass ? "text-white/90 group-hover:text-[#d4af37]" : "text-gray-700 group-hover:text-[#d4af37]"
                  }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-white">
                  {totalItems()}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-6 w-6 transition-colors duration-300 ${isGlass ? "text-white/90" : "text-gray-700"
                  }`}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Row (Desktop) */}
        <div className="hidden md:flex items-center justify-center gap-8 py-3 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/?category=${encodeURIComponent(category)}#products`}
              className={`text-[11px] font-bold tracking-widest transition-colors duration-300 whitespace-nowrap hover:text-[#d4af37] ${isGlass ? "text-white/75" : "text-gray-500"
                }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm font-medium text-gray-700 hover:text-[#d4af37] px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="block text-sm font-medium text-gray-700 hover:text-[#d4af37] px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <div className="pt-2 border-t border-gray-100">
              <span className="block px-2 text-[10px] font-bold tracking-widest text-gray-400 mb-2">CATÉGORIES</span>
              <div className="space-y-2 pl-2">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={`/?category=${encodeURIComponent(category)}#products`}
                    className="block text-sm font-medium text-gray-600 hover:text-[#d4af37]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-gray-100 px-2">
              <span className="block text-[10px] font-bold tracking-widest text-gray-400 mb-3">SUIVEZ-NOUS</span>
              <div className="flex items-center gap-6">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/elvarisjewelry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#E1306C] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/elvarisjewelry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#1877F2] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#25D366] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
