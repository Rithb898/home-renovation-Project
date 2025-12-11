import { beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db.js";

beforeAll(async () => {
  // Setup test database connection
});

afterAll(async () => {
  // Cleanup and disconnect
  await prisma.$disconnect();
});
