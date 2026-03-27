"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProductFormProps } from "@/types";
import Image from "next/image";

/**
 * Reusable product form component for creating and editing products.
 * Handles validation, submission, and displays success/error messages.
 * Supports local image file upload.
 */
export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const [previewImages, setPreviewImages] = useState<string[]>(initialData?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price?.toString() || "",
    originalPrice: initialData?.originalPrice?.toString() || "",
    image: initialData?.image || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    stock: initialData?.stock?.toString() || "100",
  });

  /** Handles input field changes */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  }

  /** Handles file selection for image upload */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setError("");
  }

  /** Converts file to base64 for upload */
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /** Validates form fields before submission */
  function validate(): boolean {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setError("Price must be a positive number");
      return false;
    }
    if (formData.originalPrice && parseFloat(formData.originalPrice) < 0) {
      setError("Original price must be a positive number");
      return false;
    }
    if (formData.originalPrice) {
      const p = parseFloat(formData.price);
      const op = parseFloat(formData.originalPrice);
      if (Number.isFinite(p) && Number.isFinite(op) && op <= p) {
        setError("Original price must be higher than current price to show a discount.");
        return false;
      }
    }
    if (!formData.image.trim() && !previewImage) {
      setError("Product image is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    return true;
  }

  /** Handles form submission for creating or updating a product */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let imageData = formData.image.trim();

      // If a file was selected, convert it to base64
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        imageData = await fileToBase64(file);
      }

      const body = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice.trim()
          ? parseFloat(formData.originalPrice)
          : undefined,
        image: imageData,
        description: formData.description.trim(),
        category: formData.category.trim(),
        stock: parseInt(formData.stock) || 100,
        images: previewImages.slice(0, 8),
      };

      const url =
        mode === "create"
          ? "/api/products"
          : `/api/products/${initialData?._id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard-azzouzi-secure");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Product name"
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price (MAD) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="0.00"
        />
      </div>

      {/* Original Price (optional) */}
      <div>
        <label
          htmlFor="originalPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Original Price (MAD) (optional)
        </label>
        <input
          type="number"
          id="originalPrice"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="e.g., 120.00"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Image *
        </label>

        {/* Image Preview */}
        {previewImage && (
          <div className="mt-2 mb-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="mt-1">
          <input
            ref={fileInputRef}
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: JPG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>

        {/* Or use URL */}
        <div className="mt-4">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Or enter Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="image"
            value={formData.image}
            onChange={(e) => {
              handleChange(e);
              setPreviewImage(e.target.value);
            }}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gallery Images (optional)
        </label>
        {previewImages.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {previewImages.map((img, idx) => (
              <div key={`${img}-${idx}`} className="relative h-24 rounded-lg overflow-hidden border border-gray-300">
                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <input
          ref={multiFileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            Promise.all(
              files
                .filter((f) => f.type.startsWith("image/"))
                .slice(0, 8)
                .map(fileToBase64)
            ).then((images) => setPreviewImages(images));
          }}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Product description"
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="NOUVEAUTÉS">NOUVEAUTÉS</option>
          <option value="BAGUES">BAGUES</option>
          <option value="COLLIERS">COLLIERS</option>
          <option value="BRACELETS">BRACELETS</option>
          <option value="BOUCLES">BOUCLES</option>
          <option value="PIERRES NATURELLES">PIERRES NATURELLES</option>
          <option value="COLLECTIONS">COLLECTIONS</option>
        </select>
      </div>

      {/* Stock */}
      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="100"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Update Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard-azzouzi-secure")}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
