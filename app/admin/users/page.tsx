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
import { fetchUsers, setErrors, setUsers } from "@/lib/store/slices/usersSlice"
import { activateUser, deactivateUser, getUsers } from "@/services/admin.service"
import { useEffect, useState } from "react"

const UsersTable = () => {
    const dispatch = useAppDispatch()
    const { users, isLoading, total_count } = useAppSelector((state) => state.getUsers)

    const [search, setSearch] = useState<string>("")

    const debouncedSearchQuery = useDebounce(search, 500)
    const LIMIT = 10
    const { currentPage, goToNextPage, goToPreviousPage, totalPages, resetPage } = usePagination({ totalCount: total_count, initialLimit: LIMIT })
    const { isOpen, actionType, closeDialog, openDialog, selectedId, setIsOpen, setIsActionLoading, isActionLoading } = useDialog()

    const fetchAllUsers = async () => {
        try {
            dispatch(fetchUsers())
            const response = await getUsers(currentPage, LIMIT, debouncedSearchQuery)
            console.log(response, "response form users table")
            dispatch(setUsers(response))
        } catch (error) {
            dispatch(setErrors("Failed to load users record."))
        }
    }

    useEffect(() => {
        resetPage()
    }, [debouncedSearchQuery])

    useEffect(() => {
        fetchAllUsers()
    }, [currentPage, debouncedSearchQuery, dispatch])


    const handleConfirmAction = async () => {
        if (!selectedId || !actionType) return;
        try {
            setIsActionLoading(true)
            const response = actionType === "deactivate" ? await deactivateUser(selectedId) : await activateUser(selectedId)
            toast.add({ type: "success", description: response.message })
            closeDialog()
            fetchAllUsers()
        } catch (error) {
            toast.add({ type: "warning", description: `Failed to execute ${actionType} request` });
            setIsActionLoading(false);
        }
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
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
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
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell className="font-medium">{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className={user.is_active ? "text-green-500 font-medium" : "text-red-500 font-medium"}>{user.is_active ? "Active" : "Inactive"}</TableCell>
                                    <TableCell className={user.role === "admin" ? "text-green-500" : ""}>{user.role}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button className="cursor-pointer" variant="outline" onClick={() => openDialog(user.id, user.is_active ? "deactivate" : "activate")}>
                                            {user.is_active ? "Deactivate" : "Activate"}
                                        </Button>
                                        <Button className="cursor-pointer" variant="outline">{user.role === "admin" ? "Convert to user" : "Convert to admin"}</Button>
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
                            onClick={handleConfirmAction}
                        >
                            {isActionLoading ? "Processing..." : actionType === "deactivate" ? "Confirm Deactivation" : "Confirm Activation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UsersTable