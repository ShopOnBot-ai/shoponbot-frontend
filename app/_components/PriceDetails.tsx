"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartSubtotal, selectTotalQuantity } from "@/lib/store/selectors/cartSelectors";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { setOrder, setOrderFailure, setOrderProcessing } from "@/lib/store/slices/checkoutSlice";
import { checkoutOrder } from "@/services/checkout.service";
import { CreditCard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PriceDetails = () => {
    const pathname = usePathname()
    console.log("pathname", pathname)
    const router = useRouter()
    const dispatch = useDispatch()
    const totalQuantity = useSelector(selectTotalQuantity)
    const subtotal = useSelector(selectCartSubtotal)
    const { checkoutSummary, selectedAddressId, isProcessing } = useAppSelector(state => state.checkout)

    const handleButtonClick = async() => {
        if (pathname === "/cart") {
            router.push("/checkout");
            return null
        }
        if (pathname === "/checkout") {
            if (!selectedAddressId) return;
            try {
                dispatch(setOrderProcessing())
                const payload = {
                    address_id: selectedAddressId,
                    idempotency_key: checkoutSummary?.idempotency_key || ""
                }
                const orderResponse = await checkoutOrder(payload)
                console.log("order successfully saved waiting for payment verification", orderResponse)
                dispatch(setOrder(orderResponse))
                dispatch(clearCart(null))

                const RazorpaySDK = (window as any).Razorpay
                console.log("3. Razorpay SDK:", RazorpaySDK);
                if(!RazorpaySDK) {
                    alert("Razorpay SDK is not fully loaded inside your browser. Retrying configuration initialization...");
                    return;
                }

                const checkoutOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Til8Q4iVamhR7s",
                    amount: Math.round(Number(checkoutSummary?.total_amount) * 100),
                    currency: "INR",
                    name: "ShopOnBot Digital Store",
                    description: `Transaction reference for Order Instance #${orderResponse.order_number}`,
                    order_id: orderResponse.razorpay_order_id, 
                    
                    handler: async function (paymentSuccessPayload: any) {
                        console.log("💰 Payments Authorized Successfully on Client SDK Window Container:", paymentSuccessPayload);
                        console.log("Payment ID:", paymentSuccessPayload.razorpay_payment_id);
                        console.log("Order ID:", paymentSuccessPayload.razorpay_order_id);
                        console.log("Signature:", paymentSuccessPayload.razorpay_signature);
                        dispatch(clearCart(null));
                        
                        router.push(`/checkout/success?order_number=${orderResponse.order_number}`);
                    },
                    prefill: {
                        name: "Customer Client Profile Name",
                        email: "customer@shoponbot.com"
                    },
                    theme: {
                        color: "#0F172A"
                    },
                    modal: {
                        ondismiss: function () {
                            console.warn("Transaction aborted or popup window dismissed by the customer.");
                            dispatch(setOrderFailure("Payment dismissed by user."));
                        }
                    }
                };

                const paymentInstance = new RazorpaySDK(checkoutOptions);
                paymentInstance.open();
            } catch (error) {
                console.log("Failed to place an order", error)
            }
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
                    
                    {/* Items base subtotal counts */}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price ({totalQuantity} items)</span>
                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {pathname === "/checkout" && checkoutSummary ? (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery / Shipping Charges</span>
                                <span className={Number(checkoutSummary.shipping_fee) === 0 ? "text-green-600" : ""}>
                                    {Number(checkoutSummary.shipping_fee) === 0 ? "Free" : `₹${Number(checkoutSummary.shipping_fee).toLocaleString("en-IN")}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax Applied</span>
                                <span className="text-destructive">+₹{Number(checkoutSummary.tax).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-green-600">-₹{Number(checkoutSummary.discount).toLocaleString("en-IN")}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total Amount Payable</span>
                                <span className="text-primary">₹{Number(checkoutSummary.total_amount).toLocaleString("en-IN")}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* /cart estimation view layout parameters */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimated Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Estimated Total</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full text-md font-semibold tracking-wide cursor-pointer" 
                        size="lg" 
                        disabled={isProcessing || (pathname === "/checkout" && !selectedAddressId)}
                        onClick={handleButtonClick}
                    >
                        {isProcessing ? "Processing..." : (pathname === "/cart" ? "Checkout" : "Place Order")}
                    </Button>
                </CardFooter>

                </Card>
            </div>
        )
    }

    export default PriceDetails