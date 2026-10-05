import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [value, delay])
    return debouncedValue
}