import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { emailSchema, validateField } from "./validation";

describe("Validation", () => {
  describe("Property 7: Client-side validation prevents API calls", () => {
    // Feature: frontend-auth-integration, Property 7: Client-side validation prevents API calls
    // Validates: Requirements 2.4

    it("should reject invalid email formats without making API calls", () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(""), // Empty string
            fc.constant("   "), // Whitespace only
            fc.constant("notanemail"), // No @ symbol
            fc.constant("@example.com"), // Missing local part
            fc.constant("user@"), // Missing domain
            fc.constant("user @example.com"), // Space in email
            fc.constant("user@.com"), // Invalid domain
            fc.string().filter((s) => !s.includes("@") && s.length > 0), // Random strings without @
          ),
          (invalidEmail) => {
            // Validate the email
            const result = validateField(emailSchema, invalidEmail);

            // Should fail validation - this prevents API calls
            return !result.success;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should accept properly formatted email addresses", () => {
      fc.assert(
        fc.property(
          fc
            .tuple(
              fc.stringMatching(/^[a-z0-9]+$/), // local part
              fc.stringMatching(/^[a-z0-9]+$/), // domain name
              fc.stringMatching(/^[a-z]{2,}$/), // TLD
            )
            .map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
          (validEmail) => {
            const result = validateField(emailSchema, validEmail);

            // Should pass validation
            return result.success;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should consistently validate email format", () => {
      // Test that validation is deterministic
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result1 = validateField(emailSchema, input);
          const result2 = validateField(emailSchema, input);

          // Same input should always produce same result
          return result1.success === result2.success;
        }),
        { numRuns: 100 },
      );
    });
  });
});
