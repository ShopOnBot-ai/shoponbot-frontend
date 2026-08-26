import { Product, ProductsResponse } from "@/types/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
    products: Product[],
    page : number,
    limit: number,
    total_count: number,
    isLoading: boolean,
    error: string | null
}
const initialState: ProductState = {
    products: [],
    page: 1,
    limit: 10,
    total_count: 0,
    isLoading: false,
    error: null
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProductsLoading(state) {
            state.isLoading = true;
            state.error = null;
        },
        setProducts(state, action: PayloadAction<ProductsResponse>) {
            state.products = action.payload.products;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.total_count = action.payload.total_count;
            state.isLoading = false;
            state.error = null;
        },
        setErrors(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearProducts(state) {
            state.products = []
            state.isLoading = false
            state.error = null
        },
        removeProduct(state, action) {
            state.products = state.products.filter((item) => item.id !== action.payload)
        }
    }
})

export const { setErrors, setProducts, setProductsLoading, clearProducts, removeProduct } = productsSlice.actions
export default productsSlice.reducer