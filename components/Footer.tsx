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
            <h3 className="text-lg font-bold text-gray-900">ShopMAD</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your one-stop shop for quality products. Fast delivery across
              Morocco.
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
                WhatsApp: +212 600 000 000
              </li>
              <li className="text-sm text-gray-600">
                Email: contact@shopmad.com
              </li>
              <li className="text-sm text-gray-600">Casablanca, Morocco</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ShopMAD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
