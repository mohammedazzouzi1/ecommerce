import { redirect } from "next/navigation";
import { getCurrentAdmin, isAuthenticated } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import AdminActivity from "@/models/AdminActivity";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

async function getStats() {
  await connectDB();
  const totalProducts = await Product.countDocuments();
  const recentProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  const recentActivity = await AdminActivity.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  return { totalProducts, recentProducts, recentActivity };
}

export default async function AdminDashboardPage() {
  // Check authentication
  if (!isAuthenticated()) {
    redirect("/dashboard-azzouzi-secure/login");
  }

  const admin = getCurrentAdmin();
  const { totalProducts, recentProducts, recentActivity } = await getStats();

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Azzouzi Jewelry</h1>
                <p className="text-xs text-[#d4af37]">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                Welcome, {admin?.username}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#d4af37]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#50c878]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Orders</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#50c878]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#50c878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#c9a86c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">0 MAD</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#c9a86c]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9a86c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard-azzouzi-secure/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white rounded-lg hover:from-[#e5c048] hover:to-[#c9a32a] transition-all shadow-lg shadow-[#d4af37]/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2a2a4e] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Website
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Recent Products</h2>
            <Link
              href="/dashboard-azzouzi-secure/products"
              className="text-sm text-[#d4af37] hover:text-[#b8941f] transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No products yet. Add your first product!
              </div>
            ) : (
              recentProducts.map((product: any) => (
                <div key={product._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1a1a2e]">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.price} MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard-azzouzi-secure/products/${product._id}/edit`}
                      className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Admin Activity Logs</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.length === 0 ? (
              <div className="px-6 py-6 text-sm text-gray-500">No activity yet.</div>
            ) : (
              recentActivity.map((item: any) => (
                <div key={item._id} className="px-6 py-3 flex items-center justify-between text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium">{item.adminUsername}</span> {item.action}
                  </div>
                  <div className={item.status === "success" ? "text-green-600" : "text-red-600"}>
                    {item.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
