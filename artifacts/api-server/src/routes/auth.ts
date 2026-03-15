import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, otpTokensTable } from "@workspace/db";
import { eq, or, and, gt } from "drizzle-orm";

const router: IRouter = Router();

function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

router.post("/auth/send-otp", async (req, res): Promise<void> => {
  const { phone } = req.body;
  if (!phone || phone.trim().length < 7) {
    res.status(400).json({ error: "Valid phone number is required" });
    return;
  }
  const cleanPhone = phone.trim();

  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.phone, cleanPhone));
  if (existingUser) {
    res.status(409).json({ error: "Phone number already registered" });
    return;
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.delete(otpTokensTable).where(eq(otpTokensTable.phone, cleanPhone));
  await db.insert(otpTokensTable).values({ phone: cleanPhone, code, expiresAt });

  res.json({
    message: `OTP sent to ${cleanPhone}`,
    devOtp: code,
  });
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const { name, phone, password, otpCode } = req.body;
  if (!name || !phone || !password || !otpCode) {
    res.status(400).json({ error: "Name, phone, password and OTP are required" });
    return;
  }
  const cleanPhone = phone.trim();

  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.phone, cleanPhone));
  if (existingUser) {
    res.status(409).json({ error: "Phone number already registered" });
    return;
  }

  const [token] = await db
    .select()
    .from(otpTokensTable)
    .where(
      and(
        eq(otpTokensTable.phone, cleanPhone),
        eq(otpTokensTable.code, otpCode),
        eq(otpTokensTable.used, false),
        gt(otpTokensTable.expiresAt, new Date())
      )
    );

  if (!token) {
    res.status(400).json({ error: "Invalid or expired OTP code" });
    return;
  }

  await db.update(otpTokensTable).set({ used: true }).where(eq(otpTokensTable.id, token.id));

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ name: name.trim(), phone: cleanPhone, passwordHash })
    .returning();

  req.session.userId = user.id;
  req.session.userRole = user.role;
  res.status(201).json({ id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ error: "Phone/email and password are required" });
    return;
  }
  const clean = identifier.trim();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.phone, clean), eq(usersTable.email, clean)));

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  req.session.userId = user.id;
  req.session.userRole = user.role;
  res.json({ id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role });
});

export default router;
