"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { useDebounce } from '@/hooks/useDebounce'
import { useDialog } from '@/hooks/useModal'
import { usePagination } from '@/hooks/usePagination'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { clearProducts, removeProduct, setErrors, setProducts, setProductsLoading } from '@/lib/store/slices/productsSlice'
import { addProduct, deleteProduct, getAdminProducts, productImage, updateProduct } from '@/services/admin.service'
import { Edit2, Eye, Package, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


const Products = () => {
    const dispatch = useAppDispatch()
    const { products, isLoading, error, total_count } = useAppSelector((state) => state.products)
    console.log(products, "products..")
    const [form, setForm] = useState({
        title: "",
        description: "",
        image_url: "",
        price: 0,
        in_stock: false,
        stock_quantity: 0
    })
    const [imagePreview, setImagePreview] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [search, setSearch] = useState<string>("")
    const { isOpen, setIsOpen, actionType, setIsActionLoading, isActionLoading, closeDialog, openDialog, selectedProduct, setSelectedProduct } = useDialog()
    const debouncedSearchQuery = useDebounce(search, 500)
    const { currentPage, resetPage, goToNextPage, goToPreviousPage, totalPages, hasNextPage, hasPrevPage, limit, changeLimit } = usePagination({ totalCount: total_count, initialLimit: 10 })

    const loadProducts = async () => {
        dispatch(setProductsLoading())
        try {
            const response = await getAdminProducts(currentPage, limit, debouncedSearchQuery)
            dispatch(setProducts(response))
        } catch (error) {
            console.error(error)
            dispatch(setErrors("Failed to fetch products"))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        resetPage()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;
        setSelectedFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleAddProdcut = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsActionLoading(true)
            let image_url: string | null = null
            if (selectedFile) {
                const imageResponse = await productImage(selectedFile)
                image_url = imageResponse?.image_url ?? null
            }
            if (actionType === "Edit-product") {
                if (!selectedProduct) return;
                const updateData = await updateProduct(selectedProduct?.id, {
                    title: form.title,
                    description: form.description,
                    image_url,
                    price: form.price,
                    in_stock: form.in_stock,
                    stock_quantity: form.stock_quantity
                })
                toast.add({ type: "success", description: updateData.message })
                closeDialog()
            } else {
                const data = await addProduct({
                    title: form.title,
                    description: form.description,
                    image_url,
                    price: form.price,
                    in_stock: form.in_stock,
                    stock_quantity: form.stock_quantity
                })
                toast.add({ type: "success", description: data.message })
                closeDialog()
            }
            const productsResponse = await getAdminProducts(currentPage, limit, debouncedSearchQuery)
            dispatch(setProducts(productsResponse))
        } catch (error) {
            toast.add({
                type: "warning", description: actionType === "Edit-product"
                    ? "Failed to update product"
                    : "Failed to add product"
            })
            console.log(error)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleDeleteProduct = async (id: number) => {
        console.log("calling")
        try {
            setIsActionLoading(true)
            const response = await deleteProduct(id)
            dispatch(removeProduct(id))
            toast.add({ type: "success", description: response.message })
            closeDialog()
        } catch (error) {
            console.log(error, "error")
            toast.add({ type: "warning", description: "Failed to delete this product" })
        } finally {
            setIsActionLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [currentPage, limit, debouncedSearchQuery])

    useEffect(() => {
        if (!selectedProduct) return;

        setForm({
            title: selectedProduct.title,
            description: selectedProduct.description ?? "",
            image_url: selectedProduct.image_url ?? "",
            price: selectedProduct.price,
            in_stock: selectedProduct.in_stock,
            stock_quantity: selectedProduct.stock_quantity
        })
    }, [selectedProduct])



    return (
        <div className='p-6 space-y-8'>
            <div className='flex item-center justify-between'>
                <Input
                    className='w-[50%]'
                    placeholder='Search Products...'
                    value={search}
                    onChange={handleSearchChange}
                />
                <Button className="cursor-pointer" onClick={() => openDialog(null, "Add-product")}>Add Product</Button>
            </div>
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
                                className='group overflow-hidden flex flex-col justify-between min-h-[320px] transition-all hover:shadow-md'
                            >
                                <CardHeader className='p-4 pb-0 relative'>
                                    {/* Image Placeholder */}
                                    <div className='aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden mb-2'>
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Package className="h-8 w-8 stroke-1 transition-transform group-hover:scale-110" />
                                            </div>
                                        )}
                                        <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${product.in_stock ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'
                                            }`}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    {/* <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>{product.category}</span> */}
                                    <CardTitle className='font-semibold text-base tracking-tight leading-tight line-clamp-1 mt-1'>
                                        {product.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='px-4 flex-1'>
                                    <p className='text-sm text-zinc-500 tracking-tight text-primary'>{product.description}</p>
                                </CardContent>
                                <CardContent className='p-4 pt-1 flex-1'>
                                    <p className='text-lg font-bold tracking-tight text-primary'>₹ {product.price}</p>
                                </CardContent>

                                {/* Hover Quick Actions inside CardFooter */}
                                <CardFooter className='p-4 pt-3 border-t bg-muted/20 flex items-center gap-2'>
                                    <Button variant='outline' size='icon' className='h-8 w-8 cursor-pointer'>
                                        <Eye className='h-4 w-4 text-muted-foreground' />
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        className='h-8 w-8 cursor-pointer'
                                        onClick={() => {
                                            openDialog(product.id, "Edit-product", product)
                                        }}
                                    >
                                        <Edit2 className='h-4 w-4 text-muted-foreground' />
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        className='h-8 w-8 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 ml-auto'
                                        onClick={() => {
                                            openDialog(product.id, "Delete-product", product)
                                        }
                                        }
                                    >
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Field orientation="horizontal" className="w-fit">
                            <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                            <Select value={String(limit)} onValueChange={(value) => changeLimit(Number(value))}>
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
                                        aria-disabled={!hasPrevPage}
                                        className={
                                            !hasPrevPage
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <span className="px-3 text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={goToNextPage}
                                        aria-disabled={!hasNextPage}
                                        className={
                                            !hasNextPage
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md rounded-xl bg-background border shadow-xl">
                    <DialogHeader className="space-y-1.5 pb-2">
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {actionType === "Add-product" ? "Add Product" : actionType === "Delete-product" ? "Delete product" : "Edit Product"}
                        </DialogTitle>
                    </DialogHeader>
                    {actionType === "Add-product" || actionType === "Edit-product" ? (
                        <form onSubmit={handleAddProdcut}>
                            <FieldGroup className='space-y-1'>
                                <Field className="space-y-1.5">
                                    <Label className="text-sm font-medium">Title</Label>
                                    <Input
                                        placeholder='Enter title...'
                                        type='text'
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                    />
                                </Field>
                                <Field className="space-y-1.5">
                                    <Label className="text-sm font-medium">Description</Label>
                                    <Input
                                        placeholder='Enter description...'
                                        type='text'
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </Field>
                                <Field className="space-y-1.5">
                                    <Label className="text-sm font-medium">Price</Label>
                                    <Input
                                        placeholder='Enter price...'
                                        type='number'
                                        name="price"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                price: Number(e.target.value)
                                            }))
                                        }
                                    />
                                </Field>
                                <Field className="space-y-1.5">
                                    <Label className="text-sm font-medium">Image</Label>
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="New product image"
                                            className="h-24 w-24 rounded-md object-cover"
                                        />
                                    ) : form.image_url ? (
                                        <img
                                            src={form.image_url}
                                            alt={form.title}
                                            className="h-24 w-24 rounded-md object-cover"
                                        />
                                    ) : null}
                                    <Input
                                        type='file'
                                        name="image_url"
                                        onChange={handleImageChange}
                                        className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                </Field>
                                {/* add checkbox for in stock field */}
                                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                    <Checkbox
                                        id="in-stock"
                                        checked={form.in_stock}
                                        onCheckedChange={(checked) => setForm((prev) => ({
                                            ...prev,
                                            in_stock: checked === true
                                        }))}
                                        className="mt-0.5"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
                                            Available in Stock
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Toggle visibility of this product on the public storefront.
                                        </p>
                                    </div>
                                </div>
                                {/* add dropdown for stock quantity field */}
                                <Field className="space-y-1.5">
                                    <Label className="text-sm font-medium">Stock Quantity</Label>
                                    <Select
                                        defaultValue="10"
                                        value={String(form.stock_quantity)}
                                        onValueChange={(value) => setForm((prev) => ({
                                            ...prev,
                                            stock_quantity: Number(value)
                                        }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select quantity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">Low Stock (5 units)</SelectItem>
                                            <SelectItem value="10">Standard (10 units)</SelectItem>
                                            <SelectItem value="25">Bulk (25 units)</SelectItem>
                                            <SelectItem value="50">Wholesale (50+ units)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                            <DialogFooter className="flex gap-2 sm:justify-end mt-4">
                                <Button type='button' variant="outline" size="sm" disabled={isActionLoading} className="cursor-pointer" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    disabled={isActionLoading}
                                    className="cursor-pointer"
                                    type='submit'
                                >
                                    {isActionLoading
                                        ? "Processing..."
                                        : actionType === "Edit-product"
                                            ? "Update"
                                            : "Save"}
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <>
                            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                Are you absolutely sure you want to delete this product?
                            </DialogDescription>
                            <DialogFooter className="flex gap-2 sm:justify-end mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isActionLoading}
                                    className="cursor-pointer"
                                    onClick={closeDialog}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    disabled={isActionLoading}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (!selectedProduct?.id) return;
                                        handleDeleteProduct(selectedProduct?.id)
                                    }}
                                >
                                    {isActionLoading ? "Deleting..." : "Delete"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Products