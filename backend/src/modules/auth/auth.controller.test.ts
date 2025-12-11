import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import request from "supertest";
import express from "express";
import { checkEmail, signup } from "./auth.controller.js";
import { prisma } from "../../lib/db.js";

// Create a test Express app
const app = express();
app.use(express.json());
app.post("/check-email", checkEmail);
app.post("/signup", signup);

describe("Auth Controller - Input Validation Tests", () => {
  /**
   * Feature: signup-validation, Property 3: Input validation consistency
   * Validates: Requirements 3.1, 3.2
   *
   * For any invalid email format (empty, malformed, or missing), both the signup
   * and check-email endpoints SHALL reject the request with a 400 status code
   * and validation error details
   */
  it("Property 3: Input validation consistency - should reject invalid emails with 400", async () => {
    // Generator for invalid email formats
    const invalidEmailGen = fc.oneof(
      fc.constant(""), // Empty string
      fc.constant("   "), // Whitespace only
      fc.constant("notanemail"), // Missing @
      fc.constant("@example.com"), // Missing local part
      fc.constant("user@"), // Missing domain
      fc.constant("user @example.com"), // Space in email
      fc.constant("user@.com"), // Invalid domain
      fc.string().filter((s) => !s.includes("@")) // No @ symbol
    );

    await fc.assert(
      fc.asyncProperty(invalidEmailGen, async (invalidEmail) => {
        // Test check-email endpoint
        const checkEmailResponse = await request(app)
          .post("/check-email")
          .send({ email: invalidEmail });

        // Verify 400 status code
        expect(checkEmailResponse.status).toBe(400);

        // Verify error response structure
        const checkBody = checkEmailResponse.body;
        expect(checkBody.success).toBe(false);
        expect(checkBody.statusCode).toBe(400);
        expect(checkBody).toHaveProperty("data");
        expect(Array.isArray(checkBody.errors)).toBe(true);

        // Test signup endpoint with invalid email
        const signupResponse = await request(app).post("/signup").send({
          name: "Test User",
          email: invalidEmail,
          password: "password123",
        });

        // Verify 400 status code
        expect(signupResponse.status).toBe(400);

        // Verify error response structure
        const signupBody = signupResponse.body;
        expect(signupBody.success).toBe(false);
        expect(signupBody.statusCode).toBe(400);
        expect(signupBody).toHaveProperty("data");
        expect(Array.isArray(signupBody.errors)).toBe(true);
      }),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout

  it("should reject missing email field with 400", async () => {
    // Test check-email endpoint without email field
    const checkEmailResponse = await request(app).post("/check-email").send({});

    expect(checkEmailResponse.status).toBe(400);
    expect(checkEmailResponse.body).toHaveProperty("success", false);

    // Test signup endpoint without email field
    const signupResponse = await request(app).post("/signup").send({
      name: "Test User",
      password: "password123",
    });

    expect(signupResponse.status).toBe(400);
    expect(signupResponse.body).toHaveProperty("success", false);
  });
});

describe("Auth Controller - Email Uniqueness Tests", () => {
  // Store created test users for cleanup
  const testUserIds: string[] = [];

  afterEach(async () => {
    // Cleanup test users
    if (testUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: testUserIds,
          },
        },
      });
      testUserIds.length = 0;
    }
  });

  /**
   * Feature: signup-validation, Property 1: Email uniqueness enforcement
   * Validates: Requirements 1.1, 1.2, 1.3
   *
   * For any signup request with an email address, if that email already exists
   * in the database, the signup SHALL be rejected with a 409 status code
   */
  it("Property 1: Email uniqueness enforcement - should reject duplicate emails with 409", async () => {
    // Use a custom email generator that produces valid emails
    const validEmailGen = fc
      .tuple(
        fc.stringMatching(/^[a-z0-9]+$/),
        fc.stringMatching(/^[a-z0-9]+$/),
        fc.stringMatching(/^[a-z]{2,4}$/)
      )
      .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    await fc.assert(
      fc.asyncProperty(validEmailGen, async (email) => {
        // Setup: Check if user already exists, if so skip this iteration
        const existingCheck = await prisma.user.findUnique({
          where: { email },
        });

        if (existingCheck) {
          // User already exists, just use it for the test
          testUserIds.push(existingCheck.id);
        } else {
          // Create a user with this email
          const existingUser = await prisma.user.create({
            data: {
              id: `test-user-${Date.now()}-${Math.random()}`,
              email: email,
              name: "Existing User",
              emailVerified: false,
            },
          });
          testUserIds.push(existingUser.id);
        }

        // Get user count before signup attempt
        const userCountBefore = await prisma.user.count({
          where: { email: email },
        });

        // Execute: Attempt to signup with existing email
        const signupResponse = await request(app).post("/signup").send({
          name: "New User",
          email: email,
          password: "password123",
        });

        // Verify: Signup rejected with 409 status
        expect(signupResponse.status).toBe(409);

        // Verify: Error response structure
        const body = signupResponse.body;
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(409);
        expect(body).toHaveProperty("data");

        // Verify: No duplicate records created
        const userCountAfter = await prisma.user.count({
          where: { email: email },
        });
        expect(userCountAfter).toBe(userCountBefore);
      }),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout
});
