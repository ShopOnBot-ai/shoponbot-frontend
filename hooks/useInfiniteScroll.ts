import { useAppSelector } from "@/lib/store/hooks"
import { useEffect, useRef, useState } from "react"

interface useInfiniteScrollProps {
    onLoadMore: () => void;
}

export const useInfiniteScroll = ({ onLoadMore }: useInfiniteScrollProps) => {
    const { hasMore, isLoading } = useAppSelector((state) => state.publicProducts)
    const observerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const element = observerRef.current
        if (!element) return;
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting && hasMore) {
                    console.log("SENTINEL INTERSECTED")
                    onLoadMore()
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold: 0
            }
        )
        observer.observe(element);
        return () => {
            observer.disconnect()
        }
    }, [hasMore, isLoading, onLoadMore])

    return {
        observerRef
    }
}