"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { ShoppingCart } from "lucide-react";
import { useDialog } from "@/hooks/useModal";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { selectCartSubtotal } from "@/lib/store/selectors/cartSelectors";
import { CartItem } from "@/types/cart";
import { removeItemfromCart, updateQuantity } from "@/services/cart.service";
import { useDispatch } from "react-redux";
import { setCart } from "@/lib/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import PriceDetails from "@/app/_components/PriceDetails";

export const CartItemsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const { openDialog, closeDialog, setIsOpen, isOpen, actionType, selectedData, selectedId } = useDialog<string, CartItem>()
  const { cart, isLoading, error } = useAppSelector((state) => state.cart)
  const [quantity, setQuantity] = useState<string>("")
  const hasItems = (cart?.items?.length ?? 0) > 0;

  const handleQuantityInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)
  }

  const handleQtySelect = async (cartItemId: number, value: string) => {
    if (value === "more") {
      setQuantity("")
      openDialog(cartItemId, "more")
      return;
    }

    const newQty = Number(value)
    console.log(newQty)

    try {
      const response = await updateQuantity(cartItemId, {
        quantity: newQty
      })
      dispatch(setCart(response))
      console.log(response, "qty response")
    } catch (error) {
      console.log("Failed to update qunatity")
    }
  }

  const handleCustomQuantity = async () => {
    if (!selectedId) return;
    console.log(selectedId, "selected Id")

    const newQty = Number(quantity);

    if (!Number.isInteger(newQty) || newQty < 4) {
      return;
    }
    try {
      const response = await updateQuantity(selectedId, {
        quantity: newQty
      })
      dispatch(setCart(response))
      closeDialog()
    } catch (error) {
      console.log("Failed to update quantity from modal")
    }
  }

  const handleRemove = async (cartItemId: number) => {
    try {
      const response = await removeItemfromCart(cartItemId)
      dispatch(setCart(response))
    } catch (error) {
      console.log("Failed to remove item from cart")
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-sm shadow-sm border-gray-200 bg-white">
            <CardHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground"/> Your Cart ({cart?.items.length})
              </CardTitle>
              <Button variant="link" className="text-sm font-medium text-blue-600 p-0 h-auto hover:underline">
                Enter Delivery Pincode
              </Button>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-gray-100">
              {cart?.items.length === 0 ? (
                <div className="flex min-h-[250px] items-center justify-center">
                  <p className="text-lg font-medium text-muted-foreground">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cart?.items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6">

                    {/* Left Section Layout: Image & Selection Counter */}
                    <div className="flex flex-col items-center gap-4 flex-shrink-0">
                      <div className="w-28 h-28 border border-gray-100 p-2 rounded-sm flex items-center justify-center bg-white">
                        <img
                          src={item.product.image_url ?? ""}
                          alt={item.product.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Shadcn Select Dropdown Wrapper */}
                      <div className="flex items-center space-x-1 w-full max-w-[100px]">
                        <span className="font-semibold">Qty: </span>
                        <Select
                          defaultValue={String(item.quantity)}
                          value={item.quantity <= 3 ? String(item.quantity) : "more"}
                          onValueChange={(value) => {
                            if (!value) return;
                            console.log("Selected quantity:", value);
                            handleQtySelect(item.id, value)
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs font-medium border-gray-300 bg-gray-50 rounded-sm">
                            <SelectValue placeholder="Qty">{item.quantity}</SelectValue>
                          </SelectTrigger>
                          <SelectContent className="rounded-sm">
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="more">More</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right Section Layout: Metadata Information */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div>
                          <h2 className="text-base text-gray-900 hover:text-blue-600 cursor-pointer font-normal line-clamp-2 max-w-md leading-snug">
                            {item.product.title}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-gray-700">{item.product.description}</span>
                          </p>
                        </div>

                        {/* <div className="text-sm text-gray-800 md:text-right flex-shrink-0">
                        {item.deliveryDate}
                      </div> */}
                      </div>

                      {/* Pricing Structure Display */}
                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-xl font-semibold text-gray-900">
                          ₹{item.product.price.toLocaleString("en-IN")}
                        </span>
                        {/* <span className="text-sm text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString("en-IN")}
                      </span> */}
                        {/* <span className="text-sm font-medium text-green-600">
                        {item.discount}
                      </span> */}
                      </div>
                      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50">
                        <Button
                          className="cursor-pointer px-6 py-3"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {hasItems && (
          <PriceDetails />
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md rounded-xl bg-background border shadow-xl">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {actionType === "more" ? "Enter Quantity" : ""}
              </DialogTitle>
              <Input
                placeholder="Qunatity"
                min={4}
                value={quantity}
                onChange={handleQuantityInputChange}
              />
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end mt-4">
              <Button variant="outline" size="sm" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCustomQuantity}
                className="cursor-pointer"
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
