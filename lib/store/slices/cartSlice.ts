import { CartResponse } from "@/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
    cart: CartResponse | null,
    isLoading: boolean,
    error: string | null
}

const initialCartState: CartState = {
    cart: null,
    isLoading: false,
    error: null
}

const CartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        setCart(state, action: PayloadAction<CartResponse>) {
            state.cart = action.payload
            state.isLoading = false
            state.error = null
        },
        setCartLoading(state, action) {
            state.isLoading = true
            state.error = null
        },
        setCartError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        clearCart(state, action) {
            state.cart = null
            state.isLoading = false
            state.error = null
        },
    }
})

export const { setCart, setCartLoading, setCartError, clearCart } = CartSlice.actions;
export default CartSlice.reducer;