export interface Addresses {
    id: string,
    name: string,
    phone: string,
    address_line1: string,
    address_line2: string | null,
    city: string
    state: string
    postal_code: string
    country: string
    latitude: number | string | null,
    longitude: number | string | null,
}

export interface AddressesResponse {
    message: string,
    addresses: Addresses[]
}