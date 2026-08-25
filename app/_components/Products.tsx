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
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Send, Sparkles, User } from "lucide-react";

const LIMIT = 10

export const Products = () => {
    const dispatch = useDispatch()
    const { isLoading, products, page, hasMore } = useAppSelector((state) => state.publicProducts)
    const [search, setSearch] = useState<string>("")
    const debouncedSearchQuery = useDebounce(search, 500)
    const [messages, setMessages] = React.useState([
        {
            id: "welcome",
            role: "assistant",
            text: "Bhai, welcome to ShopOnBot.ai! Main aapki kya madad kar sakta hoon?",
            timestamp: new Date(),
        },
    ])

    console.log({
        hasMore,
        page,
        products: products.length
    })

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
                                    <Button className="w-28 font-medium cursor-pointer" disabled={!product.in_stock}>
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

                    <div className="fixed bottom-6 right-12 z-50">
                        <TooltipProvider>
                            {/* add open and open change prop */}
                            <Dialog>
                                <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="icon"
                                                className="h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary cursor-pointer"
                                            >
                                                <Bot className="h-[120px] w-[120px] text-primary-foreground animate-pulse" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="font-medium mb-2">
                                        Ask AI
                                    </TooltipContent>
                                </Tooltip>

                                {/* Production-Grade Chat Pop-up overlay */}
                                <DialogContent className="fixed bottom-20 right-10 top-auto left-auto translate-x-0 translate-y-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:slide-out-to-bottom-5 w-[360px] h-[480px] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border">
                                    <DialogHeader className="p-4 border-b bg-black text-white border-white/10 flex flex-row items-center gap-3 space-y-0 relative">
                                        <Avatar className="h-10 w-10 border border-white/20 bg-white/10 ">
                                            <AvatarFallback className="bg-white/10">
                                                <Sparkles className="h-5 w-5 text-white" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-left">
                                            <DialogTitle className="text-base font-bold flex items-center gap-1.5 text-white">
                                                ShopOnBot Assistant
                                            </DialogTitle>
                                            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                                Online
                                            </p>
                                        </div>
                                    </DialogHeader>

                                    <ScrollArea className="flex-1 p-4 bg-background">
                                        <div className="space-y-4">
                                            {messages.map((msg) => {
                                                const isAssistant = msg.role === "assistant"
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                                                            }`}
                                                    >
                                                        <Avatar className="h-8 w-8 shrink-0 select-none border">
                                                            <AvatarFallback className={isAssistant ? "bg-primary/10" : "bg-muted"}>
                                                                {isAssistant ? (
                                                                    <Bot className="h-4 w-4 text-primary" />
                                                                ) : (
                                                                    <User className="h-4 w-4" />
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div
                                                            className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${isAssistant
                                                                    ? "bg-muted/60 text-foreground rounded-tl-none"
                                                                    : "bg-primary text-primary-foreground rounded-tr-none"
                                                                }`}
                                                        >
                                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                                            <span
                                                                className={`text-[10px] block mt-1 text-right opacity-60 ${isAssistant ? "text-muted-foreground" : "text-primary-foreground"
                                                                    }`}
                                                            >
                                                                {msg.timestamp.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {/* add ref */}
                                            <div />
                                        </div>
                                    </ScrollArea>

                                    <form
                                        onSubmit={() => { "" }}
                                        className="p-4 border-t bg-muted/20 flex items-center gap-2"
                                    >
                                        <Input
                                            value=""
                                            onChange={() => ("")}
                                            placeholder="Type or ASK Assistant..."
                                            className="flex-1 focus-visible:ring-1 pr-10 rounded-xl"
                                            maxLength={1000}
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="rounded-xl shrink-0 cursor-pointer"
                                            disabled={false}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </TooltipProvider>
                    </div>
                </>
            )}
        </>
    )
}