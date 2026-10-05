"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, ShoppingBag } from "lucide-react";
import PriceDetails from "@/app/_components/PriceDetails";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/store/hooks";
import { getAddresses } from "@/services/profile.service";
import { setAddresses, setAddressLoading } from "@/lib/store/slices/profileSlice";
import { useCallback, useEffect, useState } from "react";
import { postCheckoutSummary } from "@/services/checkout.service";
import { setCheckoutSummary, setCheckoutSummaryLoading, setSelectedAddressId } from "@/lib/store/slices/checkoutSlice";

export const Checkout = () => {
  const dispatch = useDispatch();
  const { addresses, isLoading, error } = useAppSelector(state => state.profile)
  const { cart } = useAppSelector(state => state.cart)
  const { selectedAddressId } = useAppSelector(state => state.checkout)
  console.log(selectedAddressId, "selected address ic")

  const fetchAddresses = async () => {
    try {
      dispatch(setAddressLoading())
      const addresses = await getAddresses()
      dispatch(setAddresses(addresses))
    } catch (error) {
      console.log("Failed to fetch addresses")
    }
  }

  useEffect(() => {
      fetchAddresses()
  }, [])

  const handleAddressToggleExecution = useCallback(async(addressId: number) => {
    if (selectedAddressId === addressId) {
      dispatch(setSelectedAddressId(null))
      dispatch(setCheckoutSummary(null))
      return null;
    }

    try {
      dispatch(setSelectedAddressId(addressId))
      dispatch(setCheckoutSummaryLoading())
      const payload = {
        address_id: addressId
      }
      const response = await postCheckoutSummary(payload)
      console.log("summary response", response)
      dispatch(setCheckoutSummary(response))
    } catch (error) {
      console.log("failed to load checkout summary response", error)
    }
  }, [dispatch, selectedAddressId])

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" /> Shipping Address
                </CardTitle>
                <CardDescription>Select your preferred delivery location</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> New Address
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">Loading address records... ⏳</div>
              ) : addresses.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No addresses found. Add a destination.</div>
              ) : (
                addresses.map((address) => {
                  const isCurrentSelected = selectedAddressId === Number(address.id);
                  console.log("iscurrent selected", isCurrentSelected)
                  return (
                    <div
                      key={address.id}
                      onClick={() => handleAddressToggleExecution(Number(address.id))}
                      className={`flex items-start space-x-4 rounded-lg border p-4 transition-all cursor-pointer ${
                        isCurrentSelected 
                          ? "border-green-500 bg-green-50 shadow-sm ring-1 ring-primary/20" 
                          : "border-muted hover:bg-muted/30"
                      }`}
                    >
                      <Checkbox
                        id={`address-${address.id}`}
                        checked={isCurrentSelected}
                        onCheckedChange={() => handleAddressToggleExecution(Number(address.id))}
                        className="mt-1"
                      />
                      <div className="grid gap-1 flex-1">
                        <label 
                          htmlFor={`address-${address.id}`} 
                          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                        >
                          {address.name}
                          {address.phone && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                              {address.phone}
                            </span>
                          )}
                        </label>
                        <p className="text-sm text-muted-foreground mt-2">{address.address_line1}</p>
                        {address.address_line2 && (
                          <p className="text-sm text-muted-foreground">{address.address_line2}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{address.city}, {address.state} - <strong className="font-semibold">{address.postal_code}</strong></p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>

          </Card>

          <Card className="w-full shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" /> Order Summary
              </CardTitle>
              <CardDescription>Review the items in your cart</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {cart?.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.title}
                    className="h-16 w-16 rounded-md object-cover border bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">{item.product.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹ {item.product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
        <PriceDetails />
      </div>
    </div>
  );
}
