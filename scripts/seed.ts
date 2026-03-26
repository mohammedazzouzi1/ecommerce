import mongoose from "mongoose";

/** Product schema matching the main application model */
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "" },
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

const demoProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 349.99,
    image: "https://picsum.photos/seed/headphones/600/600",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable over-ear design. Perfect for music lovers and professionals.",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Leather Crossbody Bag",
    price: 199.0,
    image: "https://picsum.photos/seed/bag/600/600",
    description:
      "Handcrafted genuine leather crossbody bag with adjustable strap. Multiple compartments for organization. Ideal for everyday use.",
    category: "Accessories",
    stock: 75,
  },
  {
    name: "Smart Fitness Watch",
    price: 599.0,
    image: "https://picsum.photos/seed/watch/600/600",
    description:
      "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water resistant up to 50 meters.",
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 89.0,
    image: "https://picsum.photos/seed/tshirt/600/600",
    description:
      "Ultra-soft 100% organic cotton t-shirt. Sustainably made with eco-friendly dyes. Available in multiple colors. Comfortable fit for all-day wear.",
    category: "Clothing",
    stock: 200,
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    price: 149.0,
    image: "https://picsum.photos/seed/coffee/600/600",
    description:
      "Artisan ceramic pour-over coffee dripper with matching carafe and two cups. Makes the perfect brew every time. Great gift for coffee enthusiasts.",
    category: "Home & Kitchen",
    stock: 40,
  },
  {
    name: "Running Sneakers Pro",
    price: 449.0,
    image: "https://picsum.photos/seed/sneakers/600/600",
    description:
      "Lightweight performance running shoes with responsive cushioning and breathable mesh upper. Designed for road running and daily training.",
    category: "Footwear",
    stock: 60,
  },
];

/**
 * Seeds the database with demo products.
 * Clears existing products before inserting new ones.
 */
async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "Error: MONGODB_URI is not defined. Create a .env.local file with your MongoDB connection string."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const created = await Product.insertMany(demoProducts);
    console.log(`Inserted ${created.length} demo products`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
