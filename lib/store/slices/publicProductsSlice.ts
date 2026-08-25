import { PublicProducts, PublicProductsResponsePayload } from './../../../types/products';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PublicProductsState  {
    products: PublicProducts[],
    isLoading: boolean,
    error: string | null
    hasMore: boolean,
    page: number,
    limit: number
}

const initialState: PublicProductsState = {
    products: [],
    isLoading: false,
    error: null,
    hasMore: false,
    page: 1,
    limit: 10
}

export const publicProductsSlice = createSlice({
    name: "publicProducts",
    initialState,
    reducers: {
        setProductsLoading(state) {
            state.isLoading = true;
            state.error = null
        },
        setInitialProducts(state, action: PayloadAction<PublicProductsResponsePayload>) {
            state.products = action.payload.products;
            state.hasMore = action.payload.hasMore;
            state.page = action.payload.page;
            state.limit = action.payload.limit
            state.isLoading = false;
            state.error = null;
        }, 
        appendProducts(state, action: PayloadAction<PublicProductsResponsePayload>) {
            const existingIds = new Set(state.products.map((product) => product.id ))
            const newProducts = action.payload.products.filter((product) => !existingIds.has(product.id))
            state.products.push(...newProducts);
            state.hasMore = action.payload.hasMore;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.isLoading = false;
            state.error = null
        },
        setErrors(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload
        },
        clearProducts(state) {
            state.products = [];
            state.isLoading = false;
            state.error = null;
            state.page = 1;
            state.hasMore = false
        }

    }
})

export const { setProductsLoading, setInitialProducts, appendProducts, setErrors, clearProducts } = publicProductsSlice.actions;
export default publicProductsSlice.reducer