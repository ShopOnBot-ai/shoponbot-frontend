"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useDebounce } from "@/hooks/useDebounce"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useAppSelector } from "@/lib/store/hooks"
import { appendProducts, setInitialProducts, setProductsLoading } from "@/lib/store/slices/publicProductsSlice"
import { getAllProducts } from "@/services/products.service"
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { createCart } from "@/services/cart.service"
import { setCart } from "@/lib/store/slices/cartSlice"
import { ChatInerface } from "./ChatInterface"

const LIMIT = 10

export const Products = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, products, page, hasMore } = useAppSelector((state) => state.publicProducts);
    const [search, setSearch] = useState<string>("");
    const debouncedSearchQuery = useDebounce(search, 500);

    const fetchAllproducts = useCallback(async () => {
        try {
            dispatch(setProductsLoading())
            const response = await getAllProducts(1, LIMIT, debouncedSearchQuery)
            dispatch(setInitialProducts(response))
        } catch (error) {
            console.log("Failed to fecth products", error)
        }
    }, [dispatch, debouncedSearchQuery])

    const loadMoreProducts = useCallback(async () => {
        if (isLoading || !hasMore) return;
        try {
            dispatch(setProductsLoading())
            const nextPage = page + 1
            const [loadProducts] = await Promise.all([
                getAllProducts(nextPage, LIMIT, debouncedSearchQuery),
                new Promise((resolve) => setTimeout(resolve, 500))
            ])
            dispatch(appendProducts(loadProducts))
        } catch (error) {
            console.log("Failed to load more products")
        }
    }, [dispatch, page, hasMore, isLoading, debouncedSearchQuery])

    const { observerRef } = useInfiniteScroll({ onLoadMore: loadMoreProducts })

    useEffect(() => {
        fetchAllproducts()
    }, [fetchAllproducts])

    const handleAddToCart = async (pid: number, quantity: number = 3) => {
        const payload = {
            product_id: pid,
            quantity: quantity
        }
        try {
            const cartResponse = await createCart(payload)
            console.log(cartResponse, "Cart Response")
            dispatch(setCart(cartResponse))
        } catch (error) {
            console.log("Failed to add items to the cart")
        }
    }

    return (
        <>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden flex flex-col justify-between min-h-[320px]"
                        >
                            <CardHeader className="p-4 pb-0">
                                <Skeleton className="aspect-video w-full rounded-lg" />

                                <Skeleton className="h-5 w-3/4 mt-3" />
                            </CardHeader>

                            <CardContent className="p-4 pt-3">
                                <Skeleton className="h-6 w-24" />
                            </CardContent>

                            <CardFooter className="p-4 pt-3 border-t bg-muted/20 flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <p className='flex item-center justify-center min-h-screen font-semibold text-2xl'>No products found...!</p>
            ) : (
                <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {products.map((product) => (
                            <Card
                                key={product.id}
                                className={`w-full max-w-sm overflow-hidden flex flex-col justify-between transition-all ${product.in_stock ? "hover:shadow-md" : "opacity-60"}`}
                            >
                                <div>
                                    <div className="relative h-30 w-full bg-muted">
                                        <img
                                            src={product.image_url || "/placeholder-product.jpg"}
                                            alt={product.title}
                                            className={`h-full w-full object-cover object-center ${!product.in_stock ? "grayscale" : ""}`}
                                        />
                                        {!product.in_stock && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground shadow">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1 text-xl">{product.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>
                                </div>
                                <CardFooter className="flex justify-between items-center gap-4 pt-0">
                                    <span className="text-xl font-bold text-foreground">
                                        ₹ {product.price}
                                    </span>
                                    <Button 
                                        className="w-28 font-medium cursor-pointer" 
                                        disabled={!product.in_stock} 
                                        onClick={() => handleAddToCart(product.id)}
                                    >
                                        {product.in_stock ? "Add to Cart" : "Unavailbale"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {isLoading && products.length > 0 && (
                        <div className="flex justify-center py-8">
                            <Spinner />
                        </div>
                    )}
                    {hasMore && (
                        <div ref={observerRef} className="h-10 w-full" />
                    )}
                </>
            )}
            <ChatInerface />
        </>
    )
}