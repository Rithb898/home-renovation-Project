import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./page";
import * as apiClient from "@/lib/api-client";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Property 1: Form submission API correctness", () => {
    // Feature: frontend-auth-integration, Property 1: Form submission API correctness
    // Validates: Requirements 1.1

    it("should send POST request to /auth/signup with form data", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockResolvedValue({
        success: true,
        statusCode: 201,
        data: { user: { id: "1", email: "test@example.com" } },
        message: "Success",
      });

      render(<Signup />);

      // Fill out the form
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/create password/i), "password123");
      await user.click(screen.getByRole("checkbox"));

      // Submit the form
      await user.click(screen.getByRole("button", { name: /create account/i }));

      // Wait for API call
      await waitFor(() => {
        expect(postSpy).toHaveBeenCalledWith("/auth/signup", {
          name: "John Doe",
          email: "test@example.com",
          password: "password123",
        });
      });
    });
  });

  describe("Property 5: Email availability check trigger", () => {
    // Feature: frontend-auth-integration, Property 5: Email availability check trigger
    // Validates: Requirements 2.1

    it("should trigger email availability check on blur", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockResolvedValue({
        success: true,
        statusCode: 200,
        data: { available: true },
        message: "Success",
      });

      render(<Signup />);

      const emailInput = screen.getByLabelText(/email address/i);

      // Type email and blur
      await user.type(emailInput, "test@example.com");
      await user.tab(); // Blur the field

      // Wait for debounced API call (500ms)
      await waitFor(
        () => {
          expect(postSpy).toHaveBeenCalledWith("/auth/check-email", {
            email: "test@example.com",
          });
        },
        { timeout: 1000 },
      );
    });
  });

  describe("Property 3: Validation error display", () => {
    // Feature: frontend-auth-integration, Property 3: Validation error display
    // Validates: Requirements 1.3

    it("should display validation errors from backend", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockRejectedValue({
        success: false,
        statusCode: 400,
        message: "Validation Error",
        errors: [
          { path: ["email"], message: "Invalid email format" },
          { path: ["password"], message: "Password too short" },
        ],
      });

      render(<Signup />);

      // Fill out form with invalid data
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(screen.getByLabelText(/email address/i), "invalid");
      await user.type(screen.getByLabelText(/create password/i), "123");
      await user.click(screen.getByRole("checkbox"));

      // Submit the form
      await user.click(screen.getByRole("button", { name: /create account/i }));

      // Wait for errors to be displayed
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        expect(
          screen.getByText(/password must be at least 6 characters/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Property 9: Invalid email validation", () => {
    // Feature: frontend-auth-integration, Property 9: Invalid email validation
    // Validates: Requirements 4.2

    it("should display error for invalid email format", async () => {
      const user = userEvent.setup();

      render(<Signup />);

      const emailInput = screen.getByLabelText(/email address/i);

      // Type invalid email and blur
      await user.type(emailInput, "notanemail");
      await user.tab();

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("should show error when name is empty", async () => {
      const user = userEvent.setup();

      render(<Signup />);

      const nameInput = screen.getByLabelText(/full name/i);

      // Focus and blur without entering anything
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it("should show error when password is too short", async () => {
      const user = userEvent.setup();

      render(<Signup />);

      const passwordInput = screen.getByLabelText(/create password/i);

      // Type short password and blur
      await user.type(passwordInput, "123");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("should show error when terms are not accepted", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");

      render(<Signup />);

      // Fill out form but don't check terms
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/create password/i), "password123");

      // Submit without checking terms
      await user.click(screen.getByRole("button", { name: /create account/i }));

      // Should not call API
      expect(postSpy).not.toHaveBeenCalled();

      // Should show terms error
      await waitFor(() => {
        expect(
          screen.getByText(/you must agree to the terms/i),
        ).toBeInTheDocument();
      });
    });

    it("should handle 409 conflict error for duplicate email", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockRejectedValue({
        success: false,
        statusCode: 409,
        message: "Email already registered",
        errors: [],
      });

      render(<Signup />);

      // Fill out form
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "existing@example.com",
      );
      await user.type(screen.getByLabelText(/create password/i), "password123");
      await user.click(screen.getByRole("checkbox"));

      // Submit the form
      await user.click(screen.getByRole("button", { name: /create account/i }));

      // Should show duplicate email error
      await waitFor(() => {
        expect(
          screen.getByText(/this email is already registered/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("should disable submit button while submitting", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");

      // Mock a slow API call
      postSpy.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  statusCode: 201,
                  data: {},
                  message: "Success",
                }),
              100,
            );
          }),
      );

      render(<Signup />);

      // Fill out form
      await user.type(screen.getByLabelText(/full name/i), "John Doe");
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/create password/i), "password123");
      await user.click(screen.getByRole("checkbox"));

      // Submit the form
      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
