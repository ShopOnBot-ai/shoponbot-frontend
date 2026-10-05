import { CheckoutResponse, CheckoutSummaryResponse } from "@/types/checkout";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
    selectedAddressId: number | null;
    checkoutSummary: CheckoutSummaryResponse | null;
    isLoading: boolean;
    error: string | null;

    isProcessing: boolean;
    orderDetails: CheckoutResponse | null;
    isOrderPlaceSuccessfully: boolean
}

const initialCheckoutState: CheckoutState = {
    selectedAddressId: null,
    checkoutSummary: null,
    isLoading: false,
    error: null,

    isProcessing: false,
    orderDetails: null,
    isOrderPlaceSuccessfully: false
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialCheckoutState,
    reducers: {
        setSelectedAddressId(state, action: PayloadAction<number | null>) {
            state.selectedAddressId = action.payload;
            state.error = null;
        },
        setCheckoutSummaryLoading(state) {
            state.isLoading = true;
            state.error = null;
        },
        setCheckoutSummary(state, action: PayloadAction<CheckoutSummaryResponse | null>) {
            state.checkoutSummary = action.payload;
            state.isLoading = false;
            state.error = null
        },
        setOrderProcessing(state) {
            state.isProcessing = true;
            state.error = null
        },
        setOrder(state, action: PayloadAction<CheckoutResponse>) {
            state.isProcessing = false;
            state.isOrderPlaceSuccessfully = true;
            state.orderDetails = action.payload;
            state.error = null
        },
        setOrderFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload
        },
        clearOrderGuard(state) {
            state.isOrderPlaceSuccessfully = false;
        }
    }
})

export const { setSelectedAddressId, setCheckoutSummaryLoading, setCheckoutSummary, setOrderProcessing, setOrder, setOrderFailure, clearOrderGuard } = checkoutSlice.actions;
export default checkoutSlice.reducer