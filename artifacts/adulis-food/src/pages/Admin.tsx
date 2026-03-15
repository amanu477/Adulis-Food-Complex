import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Package, ShoppingBag, Trash2, Edit, ToggleLeft, ToggleRight, Plus, X, Check
} from "lucide-react";
import {
  useAdminListUsers,
  useAdminListOrders,
  useAdminListProducts,
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminUpdateOrder,
  useAdminDeleteProduct,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  getAdminListUsersQueryKey,
  getAdminListOrdersQueryKey,
  getAdminListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

type Tab = "users" | "orders" | "products";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("users");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [] } = useAdminListUsers({ query: { enabled: isAdmin } });
  const { data: orders = [] } = useAdminListOrders({ query: { enabled: isAdmin } });
  const { data: products = [] } = useAdminListProducts({ query: { enabled: isAdmin } });

  const updateUserMutation = useAdminUpdateUser();
  const deleteUserMutation = useAdminDeleteUser();
  const updateOrderMutation = useAdminUpdateOrder();
  const deleteProductMutation = useAdminDeleteProduct();
  const createProductMutation = useAdminCreateProduct();
  const updateProductMutation = useAdminUpdateProduct();

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", imageUrl: "", category: "Snacks", stock: "10", active: true, badge: "",
  });
  const [showProductForm, setShowProductForm] = useState(false);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Access denied. Admins only.</p>
      </div>
    );
  }

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
  const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() });
  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: getAdminListProductsQueryKey() });

  const handleRoleToggle = (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateUserMutation.mutate(
      { id: userId, data: { role: newRole } },
      { onSuccess: () => { invalidateUsers(); toast({ title: "Role updated" }); } }
    );
  };

  const handleDeleteUser = (userId: number) => {
    if (!confirm("Delete this user?")) return;
    deleteUserMutation.mutate({ id: userId }, { onSuccess: () => { invalidateUsers(); toast({ title: "User deleted" }); } });
  };

  const handleOrderStatus = (orderId: number, status: string) => {
    updateOrderMutation.mutate({ id: orderId, data: { status } }, { onSuccess: invalidateOrders });
  };

  const handleDeleteProduct = (productId: number) => {
    if (!confirm("Delete this product?")) return;
    deleteProductMutation.mutate({ id: productId }, { onSuccess: () => { invalidateProducts(); toast({ title: "Product deleted" }); } });
  };

  const openProductForm = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        imageUrl: product.imageUrl,
        category: product.category,
        stock: String(product.stock),
        active: product.active,
        badge: product.badge ?? "",
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", imageUrl: "", category: "Snacks", stock: "10", active: true, badge: "" });
    }
    setShowProductForm(true);
  };

  const handleSaveProduct = () => {
    const data = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      badge: productForm.badge || null,
    };
    if (editingProduct) {
      updateProductMutation.mutate(
        { id: editingProduct.id, data },
        { onSuccess: () => { invalidateProducts(); setShowProductForm(false); toast({ title: "Product updated" }); } }
      );
    } else {
      createProductMutation.mutate(
        { data },
        { onSuccess: () => { invalidateProducts(); setShowProductForm(false); toast({ title: "Product created" }); } }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your store</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Users", value: users.length, icon: Users, color: "from-blue-500 to-blue-600", tab: "users" },
            { label: "Orders", value: orders.length, icon: ShoppingBag, color: "from-amber-500 to-orange-600", tab: "orders" },
            { label: "Products", value: products.length, icon: Package, color: "from-green-500 to-emerald-600", tab: "products" },
          ].map((card) => (
            <motion.button
              key={card.label}
              whileHover={{ scale: 1.02 }}
              onClick={() => setTab(card.tab as Tab)}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5 text-left shadow-lg ${tab === card.tab ? "ring-4 ring-white/30" : ""}`}
            >
              <card.icon className="h-8 w-8 mb-3 opacity-80" />
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm opacity-80">{card.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          {(["users", "orders", "products"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t ? "bg-primary text-white shadow" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["ID", "Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-500">#{u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        title={u.role === "admin" ? "Remove admin" : "Make admin"}
                        className="text-purple-500 hover:text-purple-700 transition"
                      >
                        {u.role === "admin" ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["ID", "Customer", "Items", "Total", "Status", "Date", "Update"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-500">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{(order as any).userName ?? "—"}</p>
                      <p className="text-xs text-gray-400">{(order as any).userEmail ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 font-bold text-primary">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40"
                      >
                        {STATUS_OPTS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => openProductForm()}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition shadow-md shadow-primary/20"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Active", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-medium text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                      <td className="px-4 py-3 font-bold text-primary">${Number(p.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => openProductForm(p)} className="text-blue-500 hover:text-blue-700 transition">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-display font-bold">{editingProduct ? "Edit Product" : "New Product"}</h3>
              <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Image URL", key: "imageUrl", type: "text" },
                { label: "Price ($)", key: "price", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Badge (optional)", key: "badge", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type={type}
                    value={(productForm as any)[key]}
                    onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {["Snacks", "Spreads", "Nuts"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium">Active (visible in shop)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowProductForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                {editingProduct ? "Save Changes" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
