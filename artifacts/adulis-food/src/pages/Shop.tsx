import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Package } from "lucide-react";
import { useListProducts, useAddToCart } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Snacks", "Spreads", "Nuts"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [addingId, setAddingId] = useState<number | null>(null);
  const { data: products = [], isLoading } = useListProducts();
  const addToCartMutation = useAddToCart();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (productId: number, name: string) => {
    if (!user) {
      setLocation("/login");
      return;
    }
    setAddingId(productId);
    addToCartMutation.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Added to cart!", description: `${name} added to your cart.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not add to cart.", variant: "destructive" });
        },
        onSettled: () => setAddingId(null),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-primary to-[#8B4513] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://superboostup.com/AdulisFarm/wp-content/uploads/2026/01/ChatGPT-Image-Jan-28-2026-04_26_49-PM.png')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-200 text-sm tracking-widest uppercase font-semibold mb-3"
          >
            Premium Ethiopian Products
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-display font-bold mb-4"
          >
            Our Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto"
          >
            Hand-crafted Ethiopian snacks and spreads, made with love and tradition.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex gap-3 flex-wrap mb-10 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white text-foreground/70 hover:bg-primary/10 border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={product.stock === 0 || addingId === product.id}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-md shadow-primary/20"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {addingId === product.id ? "Adding…" : "Add"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
