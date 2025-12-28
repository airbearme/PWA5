import { createClient } from "@/lib/supabase/server"
import { CheckoutButton } from "@/components/checkout-button"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*").eq("available", true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="container mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Mobile Bodega
          </h1>
          <p className="text-muted-foreground mt-2">Shop essentials during your ride</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold mt-4">${product.price}</p>
            <CheckoutButton
              items={[
                {
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                },
              ]}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}