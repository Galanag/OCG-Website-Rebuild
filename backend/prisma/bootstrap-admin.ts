import "dotenv/config";
import { prisma, disconnectPrisma } from "../src/prisma/client.js";
import { ensureRoles, hashPassword } from "../src/services/auth.service.js";

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "OCG Administrator";
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env before running this script.");
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  await ensureRoles();
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    console.info(`Administrator ${email} already exists; password was not changed.`);
    return;
  }
  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      mustChangePassword: true,
      roles: { create: [{ roleId: superAdmin.id }] },
    },
  });
  console.info(`Created first administrator ${email}. The initial password must be changed after login.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });