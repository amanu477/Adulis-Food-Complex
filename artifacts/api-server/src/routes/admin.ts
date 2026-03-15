import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function requireAdmin(req: any, res: any): boolean {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  if (req.session.userRole !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
}

async function getOrderWithItems(orderId: number, includeUser = false) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
  let userName = null;
  let userEmail = null;
  if (includeUser) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId));
    if (user) {
      userName = user.name;
      userEmail = user.email;
    }
  }
  return {
    ...order,
    total: parseFloat(order.total),
    createdAt: order.createdAt.toISOString(),
    items: items.map((i) => ({ ...i, price: parseFloat(i.price) })),
    userName,
    userEmail,
  };
}

router.get("/admin/users", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    }))
  );
});

router.patch("/admin/users/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { role } = req.body;
  const [user] = await db
    .update(usersTable)
    .set({ role })
    .where(eq(usersTable.id, id))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt.toISOString() });
});

router.delete("/admin/users/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.json({ success: true });
});

router.get("/admin/orders", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  const result = await Promise.all(orders.map((o) => getOrderWithItems(o.id, true)));
  res.json(result.filter(Boolean));
});

router.patch("/admin/orders/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status } = req.body;
  const [order] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const result = await getOrderWithItems(order.id, true);
  res.json(result);
});

router.get("/admin/products", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
  res.json(products.map((p) => ({ ...p, price: parseFloat(p.price) })));
});

router.post("/admin/products", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { name, description, price, imageUrl, category, stock, active, badge } = req.body;
  if (!name || !description || price === undefined || !imageUrl || !category || stock === undefined) {
    res.status(400).json({ error: "Missing required product fields" });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      name,
      description,
      price: String(price),
      imageUrl,
      category,
      stock,
      active: active !== false,
      badge: badge || null,
    })
    .returning();
  res.status(201).json({ ...product, price: parseFloat(product.price) });
});

router.patch("/admin/products/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { name, description, price, imageUrl, category, stock, active, badge } = req.body;
  const updates: Record<string, any> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = String(price);
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (category !== undefined) updates.category = category;
  if (stock !== undefined) updates.stock = stock;
  if (active !== undefined) updates.active = active;
  if (badge !== undefined) updates.badge = badge;
  const [product] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ ...product, price: parseFloat(product.price) });
});

router.delete("/admin/products/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

export default router;
