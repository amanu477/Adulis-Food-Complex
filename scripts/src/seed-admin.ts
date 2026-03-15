import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const email = "admin@adulis.com";
const password = "admin123";
const name = "Admin";

const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));

if (existing) {
  console.log(`Admin user already exists (id=${existing.id}). Updating password...`);
  const passwordHash = await bcrypt.hash(password, 10);
  await db.update(usersTable).set({ passwordHash, role: "admin" }).where(eq(usersTable.email, email));
  console.log("Admin password and role updated.");
} else {
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, passwordHash, role: "admin" })
    .returning();
  console.log(`Admin user created (id=${user.id})`);
}

process.exit(0);
