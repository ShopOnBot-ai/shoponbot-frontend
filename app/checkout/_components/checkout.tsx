import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, ShoppingBag } from "lucide-react";
import PriceDetails from "@/app/_components/PriceDetails";

// Mock Data for the UI
const addresses = [
  { id: "addr-1", name: "John Doe", type: "Home", details: "123 Main Street, Apt 4B", city: "New York, NY 10001", default: true },
  { id: "addr-2", name: "John Doe", type: "Office", details: "456 Corporate Blvd, Suite 100", city: "Goldman Tower, NY 10005", default: false }
];

const orderItems = [
  { id: 1, name: "Premium Wireless Headphones", price: 199.99, qty: 1, image: "https://unsplash.com", meta: "Color: Matte Black" },
  { id: 2, name: "Ergonomic Mechanical Keyboard", price: 129.50, qty: 1, image: "https://unsplash.com", meta: "Switch: Linear Red" }
];

export const Checkout = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Address & Order Items (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: User Addresses */}
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
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`flex items-start space-x-4 rounded-lg border p-4 transition-all ${
                    address.default ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                  }`}
                >
                  <Checkbox 
                    id={address.id} 
                    defaultChecked={address.default} 
                    className="mt-1"
                  />
                  <div className="grid gap-1 flex-1 cursor-pointer">
                    <label htmlFor={address.id} className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                      {address.name}
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                        {address.type}
                      </span>
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">{address.details}</p>
                    <p className="text-sm text-muted-foreground">{address.city}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 2: Order Items */}
          <Card className="w-full shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" /> Order Summary
              </CardTitle>
              <CardDescription>Review the items in your cart</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-16 w-16 rounded-md object-cover border bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">\${item.price.toFixed(2)}</p>
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
