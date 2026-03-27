import Link from "next/link";

/**
 * Footer component displayed at the bottom of every page.
 * Contains site links, branding, and copyright information.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">Elvaris Jewelry</h3>
            <p className="mt-2 text-sm text-gray-600">
              Moroccan jewelry crafted with elegance and modern luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                WhatsApp: +{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212673717955"}
              </li>
              <li className="text-sm text-gray-600">
                Instagram: @elvarisjewelry
              </li>
              <li>
                <a
                  href="https://www.instagram.com/elvarisjewelry?igsh=MWMwY3UybDk3MXA4Mw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Open Instagram Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Elvaris Jewelry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
