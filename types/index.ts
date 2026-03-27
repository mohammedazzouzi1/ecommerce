/** Product interface matching the Mongoose schema */
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  category?: string;
  stock?: number;
  createdAt?: string;
}

/** Cart item with product reference and quantity */
export interface CartItem {
  product: IProduct;
  quantity: number;
}

/** Props for the ProductForm component */
export interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: IProduct;
}

/** Props for the WhatsApp button */
export interface WhatsAppButtonProps {
  productName?: string;
  price?: number;
  quantity?: number;
  customMessage?: string;
}
