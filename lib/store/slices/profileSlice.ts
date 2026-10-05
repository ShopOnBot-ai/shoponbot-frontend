import { Addresses, AddressesResponse } from "@/types/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressesState {
    addresses: Addresses[],
    isLoading: boolean,
    error: null
}

const initialAddressesState: AddressesState = {
    addresses: [],
    isLoading: false,
    error: null
}

const profileSlice = createSlice({
    name: "profile",
    initialState: initialAddressesState,
    reducers: {
        setAddressLoading(state) {
            state.isLoading = true;
            state.error = null
        },
        setAddresses(state, action: PayloadAction<AddressesResponse>) {
            state.addresses = action.payload.addresses
            state.isLoading = false;
            state.error = null
        }
    }
})

export const { setAddressLoading, setAddresses } = profileSlice.actions
export default profileSlice.reducer