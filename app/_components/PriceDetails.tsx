"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/store/hooks";
import { CreditCard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const PriceDetails = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { cart, isLoading, error } = useAppSelector((state) => state.cart)

    const handleClickEvent = () => {
        if (pathname === "/cart") {
            router.push("/checkout");
            return null
        }
    }
        return (
            <div className="lg:col-span-1">
                <Card className="sticky top-6 shadow-sm border-2">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" /> Price Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart?.items.map((item) => (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Price {`(${item.quantity} items)`}</span>
                                        <span>₹{item.subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span className="text-green-600">-\$30.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery Charges</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center font-semibold text-lg">
                                    <span>Total Amount</span>
                                    <span>₹{item.subtotal.toLocaleString("en-IN")}</span>
                                </div>
                            </>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full size-lg text-md font-semibold tracking-wide cursor-pointer" size="lg" onClick={handleClickEvent}>
                            {pathname === "/cart" ? "Checkout" : "Place Order"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    export default PriceDetails