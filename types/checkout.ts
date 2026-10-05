// types/checkout.ts

export interface CheckoutSummaryRequest {
    address_id: number | null;
}

export interface CheckoutSummaryResponse {
    subtotal: number | string;
    tax: number | string;
    shipping_fee: number | string;
    discount: number | string;
    total_amount: number | string;
    idempotency_key: string;
}

export interface CheckoutRequest {
    address_id: number;
    idempotency_key: string;
}

export interface CheckoutResponse {
    message: string;
    order_id: number;
    order_number: string;
    payment_status: string;
    razorpay_order_id: string;
    payment_url: string | null;
}
