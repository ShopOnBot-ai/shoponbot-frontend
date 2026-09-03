import { apiClient } from "@/lib/api/axios"
import { CartResponse, CreateCartPayload, updateQuantityPayload } from "@/types/cart"

const url = {
    cart: "/cart",
    updateQuantity: (id: number) => `/cart/${id}`,
    removeItem: (id: number) => `/cart/${id}`,
}

export const createCart = async(payload: CreateCartPayload): Promise<CartResponse> => {
    const response = await apiClient.post<CartResponse>(url.cart, payload)
    return response.data
}

export const getCart = async() => {
    const response = await apiClient.get(url.cart)
    return response.data
}

export const updateQuantity = async(cartitemId: number, payload: updateQuantityPayload): Promise<CartResponse> => {
    const response = await apiClient.patch<CartResponse>(url.updateQuantity(cartitemId), payload);
    return response.data
}

export const removeItemfromCart = async(cartitemId: number): Promise<CartResponse> => {
    const response = await apiClient.delete<CartResponse>(url.removeItem(cartitemId));
    return response.data
}