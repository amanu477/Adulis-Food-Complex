import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck, Leaf, Star, Info, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Snacks", "Spreads", "Nuts"];

const PRODUCT_FEATURES: Record<string, string[]> = {
  "Kolo": ["100% Natural Barley", "No Artificial Flavors", "Rich in Fiber", "Traditional Recipe"],
  "Dabo Kolo": ["Baked Not Fried", "Traditional Spices", "Perfect for Sharing", "Long Shelf Life"],
  "Peanut Butter": ["No Palm Oil", "High Protein", "No Preservatives", "Freshly Ground"],
  "Roasted Peanuts": ["Premium Crop Selection", "In-House Roasted", "High Protein", "Resealable Packaging"],
};

function getFeatures(name: string): string[] {
  const key = Object.keys(PRODUCT_FEATURES).find(k => name.includes(k));
  return key ? PRODUCT_FEATURES[key] : ["Premium Quality", "Natural Ingredients", "Ethiopian Tradition", "Family Approved"];
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [addingId, setAddingId] = useState<number | null>(null);
  const { data: products = [], isLoading } = useListProducts();
  const addToCartMutation = useAddToCart();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (productId: number, name: string) => {
    if (!user) { setLocation("/login"); return; }
    setAddingId(productId);
    addToCartMutation.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Added to cart!", description: `${name} has been added to your cart.` });
        },
        onError: () => toast({ title: "Error", description: "Could not add to cart.", variant: "destructive" }),
        onSettled: () => setAddingId(null),
      }
    );
  };

  const titleText = "Our Products";

  return (
    <div className="flex flex-col min-h-screen">
      {/* PAGE HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/02/Gemini_Generated_Image_kbsd93kbsd93kbsd.png"
            alt="Products hero"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 bg-primary/20 inline-block px-4 py-1.5 rounded-full border border-primary/30"
            >
              Our Range
            </motion.p>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 flex justify-center gap-[0.2em] overflow-hidden">
              {titleText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, type: "spring", damping: 12, stiffness: 200 }}
                  className={char === " " ? "w-4" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="w-32 h-1.5 bg-gradient-to-r from-primary to-amber-300 mx-auto mb-8 rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Crafted with care, purity, and the authentic taste your family loves.
              Discover our full range of premium Ethiopian food products.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-muted/50 border-y border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
            className="flex flex-wrap justify-center gap-8 md:gap-20 text-sm font-medium text-foreground/80"
          >
            {[
              { icon: ShieldCheck, text: "Quality Certified", color: "text-blue-500" },
              { icon: Leaf, text: "Sustainably Sourced", color: "text-secondary" },
              { icon: Star, text: "5-Star Rated Products", color: "text-amber-500", fill: true },
              { icon: Info, text: "100% Natural Ingredients", color: "text-primary" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 group"
              >
                <div className={`p-2 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform ${badge.color}`}>
                  <badge.icon className={`w-5 h-5 ${badge.fill ? "fill-current" : ""}`} />
                </div>
                <span className="group-hover:text-foreground transition-colors">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-4 mb-16 justify-center">
            {CATEGORIES.filter(c => c === "All" || products.some(p => p.category === c)).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_rgba(194,99,33,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-20">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="group"
                  >
                    <Card className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 bg-card relative">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-20" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none" />
                      <CardContent className="p-0 relative z-10">
                        <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                          {/* Image */}
                          <div className={`${idx % 2 === 1 ? "lg:order-2" : ""} bg-muted/40 p-12 flex items-center justify-center relative overflow-hidden`}>
                            <motion.div className="absolute w-[150%] aspect-square bg-white rounded-full opacity-50 blur-3xl" />
                            <motion.img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-72 h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl relative z-10 animate-float"
                              whileHover={{ scale: 1.12, rotate: idx % 2 === 0 ? 5 : -5 }}
                              transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            />
                          </div>
                          {/* Content */}
                          <div className={`${idx % 2 === 1 ? "lg:order-1" : ""} p-10 lg:p-14 flex flex-col justify-center bg-card`}>
                            <div className="flex items-center gap-3 mb-4">
                              {product.badge && (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-bold px-3 py-1 shadow-none">
                                  {product.badge}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-muted-foreground border-border/60">
                                {product.category}
                              </Badge>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                              {product.name}
                            </h2>
                            <div className="flex text-primary mb-4">
                              {[1,2,3,4,5].map((i) => (
                                <Star key={i} className="w-5 h-5 fill-current drop-shadow-sm" />
                              ))}
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                              {product.description}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                              {getFeatures(product.name).map((feat, i) => (
                                <motion.div
                                  key={feat}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * i }}
                                  viewport={{ once: true }}
                                  className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-muted/30 p-3 rounded-lg border border-border/50"
                                >
                                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                                  {feat}
                                </motion.div>
                              ))}
                            </div>
                            {/* Price + Add to Cart */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div>
                                <span className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddToCart(product.id, product.name)}
                                disabled={product.stock === 0 || addingId === product.id}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 duration-200"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                {addingId === product.id ? "Adding…" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                              </button>
                              {!user && (
                                <Link href="/login">
                                  <span className="text-sm text-muted-foreground hover:text-primary transition cursor-pointer">
                                    Sign in to order
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-xl">No products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HUMANITARIAN NOTE */}
      <section className="py-24 bg-secondary/5 border-y border-secondary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-secondary/10 text-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"
            >
              <Leaf strokeWidth={1.5} className="w-10 h-10" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Creating the Region's Essential Nutrition
            </h2>
            <p className="text-muted-foreground text-xl leading-relaxed mb-10">
              We provide fortified baby food, baking ingredients, snacks, and specialized relief products
              to humanitarian organizations, bakeries, retailers, and families across East Africa.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all hover:shadow-[0_0_20px_rgba(44,104,66,0.3)]">
                Partner With Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
