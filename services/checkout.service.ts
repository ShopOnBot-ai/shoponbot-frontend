// services/checkout.service.ts
import { apiClient } from "@/lib/api/axios";
import { CheckoutRequest, CheckoutResponse, CheckoutSummaryRequest, CheckoutSummaryResponse } from "@/types/checkout";

const url = {
    checkoutSummary: "/orders/checkout/summary",
    checkout: "/orders/checkout/place-order"
};

export const postCheckoutSummary = async (payload: CheckoutSummaryRequest): Promise<CheckoutSummaryResponse> => {
    const response = await apiClient.post<CheckoutSummaryResponse>(url.checkoutSummary, payload);
    return response.data;
};

export const checkoutOrder = async(payload: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiClient.post<CheckoutResponse>(url.checkout, payload);
    return response.data
}
