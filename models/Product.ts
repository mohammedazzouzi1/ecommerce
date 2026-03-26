import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Product document interface extending Mongoose Document.
 */
export interface IProductDocument extends Document {
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category?: string;
  stock: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose Product model.
 * Uses existing model if available (for Next.js hot reload) or creates a new one.
 */
const Product: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
