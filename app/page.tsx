import { ProductGrid } from "@/components/ProductGrid";
import { IProduct } from "@/types";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getProducts(category?: string): Promise<IProduct[]> {
  try {
    await connectDB();
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoryParam = searchParams.category;
  const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const products = await getProducts(category);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40L40 0z' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px"
          }}
        />
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#d4af37]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#50c878]/10 rounded-full blur-3xl" />



        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="text-[#d4af37] text-sm tracking-[0.3em] uppercase font-medium">
              Artisanat Marocain
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Bijoux d&apos;Exception</span>
            <span className="block text-[#d4af37]">aux Traditions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
            Découvrez notre collection exclusive de bijoux marocains,
            alliant l&apos;artisanat traditionnel et l&apos;élégance moderne.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#products"
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
            >
              Découvrir la Collection
            </Link>
            <Link
              href="/cart"
              className="px-8 py-4 border-2 border-[#d4af37]/50 text-[#d4af37] font-semibold rounded-full hover:bg-[#d4af37]/10 transition-all"
            >
              Mon Panier
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-sm tracking-[0.2em] uppercase">Nos Collections</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mt-2">
              Explorez par Catégorie
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Rings", icon: "💍" },
              { name: "Necklaces", icon: "📿" },
              { name: "Bracelets", icon: "✨" },
              { name: "Traditional Moroccan Jewelry", icon: "🏺" },
            ].map((category) => (
              <Link
                key={category.name}
                href="#products"
                className="group relative aspect-square rounded-2xl bg-gradient-to-br from-[#f8f6f3] to-[#e8e4df] overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] group-hover:text-[#d4af37] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-sm tracking-[0.2em] uppercase">Sélection Exclusive</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mt-2">
              Nos Bijoux en Vedette
            </h2>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-sm tracking-[0.2em] uppercase">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Ce que Disent Nos Clients
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Fatima B.", text: "Des bijoux d'une qualité exceptionnelle. Le service est impeccable." },
              { name: "Youssef A.", text: "J'ai offert un collier à ma mère, elle était ravie. Magnifique !" },
              { name: "Amina L.", text: "Une collection unique qui célèbre notre héritage. Je recommande !" },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <p className="text-gray-300 mb-6 italic">&quot;{t.text}&quot;</p>
                <p className="text-[#d4af37] font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#d4af37] text-sm tracking-[0.2em] uppercase">Instagram</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mt-2">
              Elvaris Jewelry
            </h2>
            <a
              href="https://www.instagram.com/elvarisjewelry?igsh=MWMwY3UybDk3MXA4Mw=="
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-[#1a1a2e] underline underline-offset-4 hover:text-[#d4af37]"
            >
              Follow on Instagram @elvarisjewelry
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=80",
            ].map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={src}
                  alt={`Instagram jewelry ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1a1a2e]/0 group-hover:bg-[#1a1a2e]/25 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#d4af37] to-[#b8941f]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Commandez par WhatsApp</h2>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1a1a2e] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
