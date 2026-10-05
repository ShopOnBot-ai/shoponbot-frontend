import { AdminOrdersResponse, Order } from "@/types/orders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminOrdersState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    limit: number;
    searchQuery: string;
    totalCount: number;

}

const initalState: AdminOrdersState = {
    orders: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    limit: 10,
    searchQuery: "",
    totalCount: 0
}

const orderSlice = createSlice({
    name: "orders",
    initialState: initalState,
    reducers: {
        setOrdersLoading(state) {
            state.isLoading = true;
            state.error = null;
        },
        setOrders(state, action: PayloadAction<AdminOrdersResponse>) {
            state.orders = action.payload.orders;
            state.isLoading = false;
            state.error = null;
            state.currentPage = action.payload.currentPage
            state.limit = action.payload.limit
            state.totalCount = action.payload.total_count
        },
        updateSingleOrder(state, action: PayloadAction<Order>) {
            const updatedOrder = action.payload

            const index = state.orders.findIndex((order) => order.id === updatedOrder.id)
            if(index !== -1) {
                state.orders[index] = updatedOrder
            }
        }
    }
})

export const { setOrders, setOrdersLoading, updateSingleOrder } = orderSlice.actions
export default orderSlice.reducer