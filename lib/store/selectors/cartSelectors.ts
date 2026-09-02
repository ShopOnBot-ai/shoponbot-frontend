import { RootState } from "../store";

export const selectCart = (state: RootState) => state.cart;

export const selectCartItems = (state: RootState) =>
    state.cart.cart?.items ?? [];

export const selectTotalQuantity = (state: RootState) =>
    state.cart.cart?.items.reduce(
        (total, item) => total + item.quantity,
        0
    ) ?? 0;

export const selectCartSubtotal = (state: RootState) =>
    state.cart.cart?.items.reduce(
        (total, item) => total + item.subtotal,
        0
    ) ?? 0;

export const selectCartProductIds = (state: RootState) =>
    state.cart.cart?.items.map(
        (item) => item.product_id
    ) ?? [];