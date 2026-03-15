import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useCreateOrder,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: cartItems = [], isLoading } = useGetCart({
    query: { queryKey: getGetCartQueryKey(), enabled: !!user },
  });
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const createOrderMutation = useCreateOrder();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/50 px-4">
        <ShoppingBag className="h-16 w-16 text-primary/40 mb-4" />
        <h2 className="text-2xl font-display font-bold mb-2">{t("cart.empty")}</h2>
        <p className="text-muted-foreground mb-6">{t("cart.emptySignIn")}</p>
        <Link href="/login">
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
            {t("cart.signIn")}
          </button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

  const handleQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ itemId, data: { quantity } }, { onSuccess: invalidateCart });
  };

  const handleRemove = (itemId: number) => {
    removeMutation.mutate({ itemId }, { onSuccess: invalidateCart });
  };

  const handleCheckout = () => {
    if (!address.trim()) {
      toast({ title: t("cart.addressRequired"), description: t("cart.addressRequiredDesc"), variant: "destructive" });
      return;
    }
    setCheckingOut(true);
    createOrderMutation.mutate(
      { data: { shippingAddress: address } },
      {
        onSuccess: () => {
          invalidateCart();
          toast({ title: t("cart.orderPlaced"), description: t("cart.orderConfirmed") });
          setLocation("/orders");
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err?.data?.error ?? t("cart.orderFailed"), variant: "destructive" });
        },
        onSettled: () => setCheckingOut(false),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold mb-8"
        >
          {t("cart.title")}
        </motion.h1>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">{t("cart.loading")}</div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">{t("cart.emptyCart")}</h2>
            <p className="text-muted-foreground mb-6">{t("cart.addProducts")}</p>
            <Link href="/shop">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
                {t("cart.browseShop")}
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                      <p className="text-primary font-bold">${Number(item.product.price).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-400 hover:text-red-600 transition mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={() => clearMutation.mutate({ data: undefined } as any, { onSuccess: invalidateCart })}
                className="text-sm text-muted-foreground hover:text-red-500 transition flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t("cart.clearCart")}
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="font-display font-bold text-xl mb-4">{t("cart.orderSummary")}</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                    <span className="truncate max-w-[60%]">{item.product.name} × {item.quantity}</span>
                    <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>{t("cart.total")}</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                >
                  {t("cart.proceedToCheckout")} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <label className="block text-sm font-medium">{t("cart.shippingAddress")}</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder={t("cart.addressPlaceholder")}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-60 shadow-lg shadow-primary/30"
                  >
                    {checkingOut ? t("cart.placingOrder") : t("cart.placeOrder")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
