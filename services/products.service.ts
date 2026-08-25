// 1. getUserProducts
// 2. getProductById

import { apiClient } from "@/lib/api/axios"
import { PublicProductsResponsePayload } from "@/types/products"

const url = {
    getAllProducts: "/products"
}

export const getAllProducts = async(page: number, limit: number, search: string | null) => {
    const response = await apiClient.get<PublicProductsResponsePayload>(url.getAllProducts, {
        params: {
            page,
            limit,
            ... (search ? { search }: {})
        }
    })
    console.log(response, "response")
    return response.data
}