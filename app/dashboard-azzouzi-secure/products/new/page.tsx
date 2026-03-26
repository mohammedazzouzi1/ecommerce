import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  if (!isAuthenticated()) {
    redirect("/dashboard-azzouzi-secure/login");
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard-azzouzi-secure" className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">Azzouzi Jewelry</h1>
                  <p className="text-xs text-[#d4af37]">Admin Dashboard</p>
                </div>
              </Link>
            </div>
            <Link
              href="/dashboard-azzouzi-secure"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Add New Product</h1>
          <p className="text-gray-600 mb-8">Create a new jewelry product for your collection.</p>
          
          <ProductForm mode="create" />
        </div>
      </div>
    </div>
  );
}
