import { apiClient } from "@/lib/api/axios"
import { UserActionResponse, UserResponsePayload } from "@/types/user"
import { CreateProductPayload, DeleteProductResponse, ProductImageResponse, ProductsResponse, UpdatedProductResponse, UpdateProductPayload } from "@/types/products"
import { AdminOrdersResponse, Order } from "@/types/orders"

const url = {
    getUsers: "/admin/users",
    deactivateUser: "/admin/user/deactivate",
    activateUser: "/admin/user/activate",
    getAdminProducts: "/admin/products",
    addProduct: "/admin/add_product",
    updateProduct: (id: number) => `/admin/products/${id}`,
    deleteProduct: (id: number) => `/admin/products/${id}`,
    uploadProductImage: "/uploads/product-image",
    getOrders: "/admin/orders",
    acceptOrder: (orderId: number) => `/admin/orders/${orderId}/accept`,
    rejectOrder: (orderId: number) => `/admin/orders/${orderId}/reject`,
    shippedOrder: (orderId: number) => `/admin/orders/${orderId}/ship`,
    deliveredtOrder: (orderId: number) => `/admin/orders/${orderId}/deliver`
}

export const getUsers = async(page: number, limit: number, search?: string ): Promise<UserResponsePayload> => {
    const response = await apiClient.get<UserResponsePayload>(url.getUsers, {
        params: {
            page,
            limit,
            ...(search ? { search } : {})
        }
    })
    return response.data
}

export const deactivateUser = async(id: number): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(url.deactivateUser, {id})
    return response.data
}

export const activateUser = async(id: number): Promise<UserActionResponse> => {
    const response = await apiClient.post<UserActionResponse>(url.activateUser, {id})
    return response.data
}

export const getAdminProducts = async(page: number, limit: number, search?: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(url.getAdminProducts, {
        params: {
            page,
            limit,
            ...(search ? { search }: {})
        }
    })
    return response.data
}

export const addProduct = async(payload: CreateProductPayload) => {
    const response = await apiClient.post(url.addProduct, payload)
    return response.data
}

export const updateProduct = async(id: number, payload: UpdateProductPayload): Promise<UpdatedProductResponse> => {
    const response = await apiClient.patch<UpdatedProductResponse>(url.updateProduct(id), payload)
    return response.data
}

export const deleteProduct = async(id: number): Promise<DeleteProductResponse> => {
    const response = await apiClient.delete<DeleteProductResponse>(url.deleteProduct(id))
    return response.data
}

export const productImage = async(file: File | null): Promise<ProductImageResponse | null> => {
    if(!file) return null;
    const formData = new FormData()
    formData.append("file", file)
    const response = await apiClient.post<ProductImageResponse>(url.uploadProductImage, formData)
    return response.data
}

export const getOrders = async(page: number, limit: number, search: string | null = null): Promise<AdminOrdersResponse> => {
    const response = await apiClient.get<AdminOrdersResponse>(url.getOrders, {
        params: {
            page,
            limit,
            ...(search ? {search} : {})
        }
    })
    return response.data
}

export const acceptOrder = async(order_id: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(url.acceptOrder(order_id), {})
    return response.data
}

export const rejectOrder = async(order_id: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(url.rejectOrder(order_id), {})
    return response.data
}

export const shippedOrder = async(order_id: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(url.shippedOrder(order_id), {})
    return response.data
}

export const deliveredOrder = async(order_id: number): Promise<Order> => {
    const response = await apiClient.patch<Order>(url.deliveredtOrder(order_id), {})
    return response.data
}