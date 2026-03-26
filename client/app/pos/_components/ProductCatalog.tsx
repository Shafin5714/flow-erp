import { Product, ProductVariant } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProductCatalogProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  productsLoading: boolean;
  filteredProducts: Product[];
  addToCart: (product: Product, variant?: ProductVariant) => void;
}

export function ProductCatalog({
  searchTerm,
  setSearchTerm,
  productsLoading,
  filteredProducts,
  addToCart,
}: ProductCatalogProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-base focus-visible:ring-primary shadow-inner"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/sales")}>
            Exit POS
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {productsLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((p) => (
              <Card
                key={p.id}
                className={cn(
                  "cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md overflow-hidden group rounded-xl",
                  !p.hasVariants && p.stock <= 0 && "opacity-50 grayscale"
                )}
                onClick={() => {
                  if (p.hasVariants && p.variants && p.variants.length > 0) {
                    addToCart(p, p.variants[0]);
                  } else if (p.stock > 0) {
                    addToCart(p);
                  }
                }}
              >
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
                  {p.mainImage ? (
                    <Image
                      src={p.mainImage}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-400">
                      <ShoppingCart className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                  {p.hasVariants && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      {p.variants?.length} Options
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-sm line-clamp-2 leading-tight">{p.name}</p>
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                    <span className="font-bold text-primary">${p.salePrice.toLocaleString()}</span>
                    {!p.hasVariants && (
                      <Badge
                        variant={p.stock > 0 ? "secondary" : "destructive"}
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
