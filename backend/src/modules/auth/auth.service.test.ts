import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as fc from "fast-check";
import { checkEmailAvailability, getUserByEmail } from "./auth.service.js";
import { prisma } from "../../lib/db.js";

describe("Auth Service - Property-Based Tests", () => {
  // Pre-create a set of test users for property testing
  const existingTestEmails: string[] = [];
  const testUserIds: string[] = [];

  beforeAll(async () => {
    // Create a small set of test users upfront
    const testEmails = [
      "test1@example.com",
      "test2@example.com",
      "test3@example.com",
      "test4@example.com",
      "test5@example.com",
    ];

    for (const email of testEmails) {
      try {
        const user = await prisma.user.create({
          data: {
            id: `test-user-${Date.now()}-${Math.random()}`,
            email: email,
            name: "Test User",
            emailVerified: false,
          },
        });
        testUserIds.push(user.id);
        existingTestEmails.push(email);
      } catch (error) {
        // User might already exist, skip
      }
    }
  });

  afterAll(async () => {
    // Cleanup all test users
    if (testUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: testUserIds,
          },
        },
      });
    }
  });

  /**
   * Feature: signup-validation, Property 2: Email availability check accuracy
   * Validates: Requirements 2.1, 2.2, 2.3
   *
   * For any email address, the availability check response SHALL accurately reflect
   * whether that email exists in the database without modifying any records
   */
  it("Property 2: Email availability check accuracy - should accurately reflect database state", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          // Mix of existing emails and random non-existing emails
          fc.constantFrom(...existingTestEmails),
          fc.emailAddress().filter((e) => !existingTestEmails.includes(e))
        ),
        async (email) => {
          // Check actual database state
          const userInDb = await getUserByEmail(email);
          const actuallyExists = userInDb !== null;

          // Execute: Check email availability
          const result = await checkEmailAvailability(email);

          // Verify: Result matches actual database state
          expect(result.available).toBe(!actuallyExists);
        }
      ),
      { numRuns: 10 }
    );
  }, 30000); // 30 second timeout
});

describe("Auth Service - Data Integrity Tests", () => {
  /**
   * Feature: signup-validation, Property 4: Data integrity preservation
   * Validates: Requirements 2.4
   *
   * For any email availability check operation, the database state SHALL remain
   * unchanged before and after the operation
   */
  it("Property 4: Data integrity preservation - should not modify database during checks", async () => {
    await fc.assert(
      fc.asyncProperty(fc.emailAddress(), async (email) => {
        // Capture user state before check (only for this specific email)
        const userBefore = await getUserByEmail(email);

        // Execute: Check email availability
        await checkEmailAvailability(email);

        // Verify: User state unchanged for this email
        const userAfter = await getUserByEmail(email);

        // User existence should remain the same
        expect(userAfter !== null).toBe(userBefore !== null);

        // If user existed, their data should be unchanged
        if (userBefore && userAfter) {
          expect(userAfter.id).toBe(userBefore.id);
          expect(userAfter.email).toBe(userBefore.email);
        }
      }),
      { numRuns: 10 }
    );
  }, 60000); // 60 second timeout
});
