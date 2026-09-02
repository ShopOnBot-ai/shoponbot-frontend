export interface CreateCartPayload {
    product_id: number,
    quantity: number
}

export interface CartProduct {
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface updateQuantityPayload {
  quantity: number
}