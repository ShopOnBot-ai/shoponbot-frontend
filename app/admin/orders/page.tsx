"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { useDebounce } from "@/hooks/useDebounce"
import { useDialog } from "@/hooks/useModal"
import { usePagination } from "@/hooks/usePagination"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setOrders, setOrdersLoading, updateSingleOrder } from "@/lib/store/slices/adminOrdersSlice"
import { setErrors, setUsers } from "@/lib/store/slices/usersSlice"
import { acceptOrder, activateUser, deactivateUser, deliveredOrder, getOrders, getUsers, rejectOrder, shippedOrder } from "@/services/admin.service"
import { useEffect, useState } from "react"

const OrdersTable = () => {
    const dispatch = useAppDispatch()
    const { orders, totalCount, isLoading } = useAppSelector((state) => state.getAdminOrders)

    const [search, setSearch] = useState<string>("")

    const debouncedSearchQuery = useDebounce(search, 500)
    const LIMIT = 10
    const { currentPage, goToNextPage, goToPreviousPage, totalPages, resetPage } = usePagination({ totalCount: totalCount, initialLimit: LIMIT })
    const { isOpen, actionType, closeDialog, openDialog, selectedId, setIsOpen, setIsActionLoading, isActionLoading } = useDialog()

    const fetchAllOrders = async () => {
        try {
            dispatch(setOrdersLoading())
            const response = await getOrders(currentPage, LIMIT, debouncedSearchQuery)
            console.log(response, "response form orders table")
            dispatch(setOrders(response))
        } catch (error) {
            dispatch(setErrors("Failed to load orders record."))
        }
    }

    useEffect(() => {
        resetPage()
    }, [debouncedSearchQuery])

    useEffect(() => {
        fetchAllOrders()
    }, [currentPage, debouncedSearchQuery, dispatch])

    const handleAcceptOrder = async (order_id: number) => {
        const data = await acceptOrder(order_id)
        console.log("data for accept order", data)
        dispatch(updateSingleOrder(data))
    }

    const handleRejecttOrder = async (order_id: number) => {
        const data = await rejectOrder(order_id)
        console.log("data for reject order", data)
        dispatch(updateSingleOrder(data))
    }

    const handleShippedtOrder = async (order_id: number) => {
        const data = await shippedOrder(order_id)
        console.log("data for shipped order", data)
        dispatch(updateSingleOrder(data))
    }

    const handleDeliveredtOrder = async (order_id: number) => {
        const data = await deliveredOrder(order_id)
        console.log("data for delivered order", data)
        dispatch(updateSingleOrder(data))
    }

    return (
        <>
            <div className="p-6">
                <Input
                    className="w-[50%] flex items-center justify-center"
                    placeholder="Search by Email or Name.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Table className="my-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Order number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment mode</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                        <Skeleton className="h-8 w-28 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell className="font-medium">{order.order_number}</TableCell>
                                    <TableCell className="">{order.status}</TableCell>
                                    <TableCell className="">{order.payment_status}</TableCell>
                                    <TableCell className="flex gap-2">
                                        {order.status === "pending" ? (
                                            <>
                                                <Button className="cursor-pointer" onClick={() => handleAcceptOrder(order.id)}>Accept</Button>
                                                <Button className="cursor-pointer" variant="outline" onClick={() => handleRejecttOrder(order.id)}>Reject</Button>
                                            </>
                                        ) : order.status === "processing" ? (
                                            <>
                                                <Button className="cursor-pointer bg-blue-500" onClick={() => handleShippedtOrder(order.id)}>Shipped</Button>
                                            </>
                                        ) : order.status === "shipped" ? (
                                            <>
                                                <Button className="cursor-pointer" onClick={() => handleDeliveredtOrder(order.id)}>Delivered</Button>
                                            </>
                                        ) : order.status === "delivered" ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Delivered 🎉
                                            </span>
                                        ) : order.status === "cancelled" ? (
                                            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                Cancelled ❌
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                        <p className="text-base font-semibold text-foreground">No users found</p>
                                        <p className="text-sm max-w-xs text-center leading-relaxed">
                                            We couldn't find any user matching <span className="font-bold text-foreground">"{search}"</span>. Check the spelling or try a different filter.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-4">
                    <Field orientation="horizontal" className="w-fit">
                        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                        <Select defaultValue="25">
                            <SelectTrigger className="w-20" id="select-rows-per-page">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                <SelectGroup>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={goToPreviousPage}
                                    aria-disabled={currentPage === 1}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={goToNextPage}
                                    aria-disabled={currentPage >= totalPages}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md rounded-xl bg-background border shadow-xl">
                    <DialogHeader className="space-y-1.5">
                        <DialogTitle className={`text-xl font-bold tracking-tight ${actionType === "deactivate" ? "text-destructive" : "text-green-600"}`}>
                            {actionType === "deactivate" ? "Deactivate User Account" : "Activate User Account"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                            {actionType === "deactivate"
                                ? "Are you absolutely sure you want to deactivate this account? The user will instantly lose access tokens and will be completely restricted from purchasing items inside ShopOnBot.ai."
                                : "Are you sure you want to activate this user account? The user will regain immediate capability to login, access dashboards, and continue ordering items across the platform."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end mt-4">
                        <Button variant="outline" size="sm" disabled={isActionLoading} onClick={closeDialog}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === "deactivate" ? "destructive" : "default"}
                            size="sm"
                            disabled={isActionLoading}
                            onClick={() => { }}
                        >
                            {isActionLoading ? "Processing..." : actionType === "deactivate" ? "Confirm Deactivation" : "Confirm Activation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OrdersTable