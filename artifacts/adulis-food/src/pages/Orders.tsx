import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { useListMyOrders } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function Orders() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useListMyOrders({ query: { enabled: !!user } });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Please sign in to view your orders.</p>
        <Link href="/login">
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold">Sign In</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold mb-8"
        >
          My Orders
        </motion.h1>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping and your orders will appear here.</p>
            <Link href="/shop">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Order #{order.id}</span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-sm flex-grow">{item.productName}</span>
                      <span className="text-sm text-muted-foreground">× {item.quantity}</span>
                      <span className="text-sm font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate max-w-[60%]">
                    📍 {order.shippingAddress}
                  </p>
                  <span className="font-bold text-primary text-lg">${Number(order.total).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
