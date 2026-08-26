import { useState } from "react";

interface UsePaginationProps {
  totalCount: number;
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = ({
  totalCount,
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps) => {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [limit, setLimit] = useState<number>(initialLimit)

    const totalPages = Math.ceil(totalCount / limit) || 1;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const goToNextPage = () => {
        if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (hasPrevPage) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    const changeLimit = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1)
    }

    return {
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        goToNextPage,
        goToPreviousPage,
        setCurrentPage,
        resetPage,
        changeLimit,
        limit
    };
};
