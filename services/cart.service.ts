import { apiClient } from "@/lib/api/axios"
import { CartResponse, CreateCartPayload } from "@/types/cart"

const url = {
    cart: "/cart"
}

export const createCart = async(payload: CreateCartPayload): Promise<CartResponse> => {
    const response = await apiClient.post<CartResponse>(url.cart, payload)
    return response.data
}

export const getCart = async() => {
    const response = await apiClient.get(url.cart)
    return response.data
}