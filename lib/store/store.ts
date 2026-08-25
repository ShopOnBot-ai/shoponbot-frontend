import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import getUsersReducer from "./slices/usersSlice";
import productsReducer from "./slices/productsSlice";
import publicProductsReducer from "./slices/publicProductsSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        getUsers: getUsersReducer,
        products: productsReducer,
        publicProducts: publicProductsReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;