import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

function requireAuth(req: any, res: any): boolean {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/cart", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const userId = req.session.userId as number;
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      product: {
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        category: productsTable.category,
        stock: productsTable.stock,
        active: productsTable.active,
        badge: productsTable.badge,
      },
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.userId, userId));

  res.json(
    items.map((i) => ({
      ...i,
      product: { ...i.product, price: parseFloat(i.product.price) },
    }))
  );
});

router.post("/cart", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const userId = req.session.userId as number;
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    res.status(400).json({ error: "productId and quantity required" });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));

  let item;
  if (existing) {
    [item] = await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id))
      .returning();
  } else {
    [item] = await db.insert(cartItemsTable).values({ userId, productId, quantity }).returning();
  }
  res.status(201).json({
    ...item,
    product: { ...product, price: parseFloat(product.price) },
  });
});

router.patch("/cart/:itemId", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const userId = req.session.userId as number;
  const raw = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const itemId = parseInt(raw, 10);
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    res.status(400).json({ error: "quantity must be >= 1" });
    return;
  }
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.userId, userId)));
  if (!existing) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }
  const [item] = await db
    .update(cartItemsTable)
    .set({ quantity })
    .where(eq(cartItemsTable.id, itemId))
    .returning();
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
  res.json({
    ...item,
    product: { ...product, price: parseFloat(product.price) },
  });
});

router.delete("/cart/clear", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const userId = req.session.userId as number;
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
  res.json({ success: true });
});

router.delete("/cart/:itemId", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const userId = req.session.userId as number;
  const raw = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const itemId = parseInt(raw, 10);
  await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.userId, userId)));
  res.json({ success: true });
});

export default router;
