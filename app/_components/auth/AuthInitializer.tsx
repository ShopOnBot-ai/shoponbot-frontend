"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { clearUser, setUser, startAuthCheck } from "@/lib/store/slices/authSlice"
import { setCart } from "@/lib/store/slices/cartSlice"
import { getCart } from "@/services/cart.service"
import { getCurrentUser } from "@/services/user.service"
import { useEffect, useRef } from "react"

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const {isOrderPlaceSuccessfully} = useAppSelector(state => state.checkout)
    const AuthCheck = async () => {
        try {
            const user = await getCurrentUser()
            dispatch(setUser(user))
            if (user) {
                if(isOrderPlaceSuccessfully){
                    return;
                }
                const cart = await getCart()
                dispatch(setCart(cart))
            }
        } catch (error) {
            console.error("Auth hydration failed:", error);
            dispatch(clearUser())
        }
    }
    useEffect(() => {
        dispatch(startAuthCheck())
        AuthCheck()
    }, [dispatch, isOrderPlaceSuccessfully])
    return <>{children}</>
}