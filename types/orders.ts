// 1. Single Order Item Component (Child Table Matrix)
export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    product_price: string;
    quantity: number;
    subtotal: string;
}

export interface ShippingAddress {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    latitude?: string | null;
    longitude?: string | null;
}

export interface Order {
    id: number;
    user_id: number;
    order_number: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'success' | 'failed' | 'refunded';
    subtotal: string;
    tax: string;
    shipping_fee: string;
    discount: string;
    total_amount: string;
    currency: string;
    shipping_address: ShippingAddress;
    items: OrderItem[];
    cancelled_by?: 'user' | 'admin' | 'system' | null;
    cancellation_reason?: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdminOrdersResponse {
    message: string;
    orders: Order[];
    currentPage: number;
    limit: number;
    total_count: number;
}
