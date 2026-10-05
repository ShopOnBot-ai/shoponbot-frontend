import { apiClient } from "@/lib/api/axios"
import { AddressesResponse } from "@/types/profile"

const url = {
    addresses: `/address`
}

export const getAddresses = async(): Promise<AddressesResponse> => {
    const response = await apiClient.get<AddressesResponse>(url.addresses)
    return response.data
}