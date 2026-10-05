"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clearOrderGuard } from "@/lib/store/slices/checkoutSlice";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CheckoutSuccessPage = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch()
    const router = useRouter();

    const orderNumber = searchParams.get("order_number");
    
    useEffect(() => {
        dispatch(clearOrderGuard())
    }, [dispatch])

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg shadow-sm">
                <CardContent className="flex flex-col items-center text-center p-8">

                    <CheckCircle2 className="h-16 w-16 text-green-600 mb-5" />

                    <h1 className="text-2xl font-bold">
                        Payment Successful!
                    </h1>

                    <p className="text-muted-foreground mt-2">
                        Thank you for your order. Your payment has been received
                        successfully.
                    </p>

                    {orderNumber && (
                        <div className="mt-6 w-full rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                Order Number
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {orderNumber}
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-5">
                        You will receive your order updates once your order
                        starts processing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
                        <Button
                            className="flex-1"
                            onClick={() => router.push("/")}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>

                        {/* <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push("/orders")}
                        >
                            View Orders
                        </Button> */}
                    </div>

                </CardContent>
            </Card>
        </main>
    );
}

export default CheckoutSuccessPage