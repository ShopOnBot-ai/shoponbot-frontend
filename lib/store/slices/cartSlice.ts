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
        incrementQuantity(state, action) {

        },
        decrementQuantity(state, action) {

        },
        removeCart(state, action) {

        },
        clearCart(state, action) {
            
        },
    }
})

export const { setCart } = CartSlice.actions;
export default CartSlice.reducer;