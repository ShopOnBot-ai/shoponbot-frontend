"use client"

import { useAppDispatch } from "@/lib/store/hooks"
import { clearUser, setUser, startAuthCheck } from "@/lib/store/slices/authSlice"
import { setCart } from "@/lib/store/slices/cartSlice"
import { getCart } from "@/services/cart.service"
import { getCurrentUser } from "@/services/user.service"
import { useEffect, useRef } from "react"

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    console.log("auth checked")
    const dispatch = useAppDispatch()
    const AuthCheck = async () => {
        try {
            const user = await getCurrentUser()
            dispatch(setUser(user))
            if (user) {
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
    }, [dispatch])
    return <>{children}</>
}