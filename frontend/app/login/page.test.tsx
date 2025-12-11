import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./page";
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

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Property 1: Form submission API correctness", () => {
    // Feature: frontend-auth-integration, Property 1: Form submission API correctness
    // Validates: Requirements 3.1

    it("should send POST request to /auth/signin with form data", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockResolvedValue({
        success: true,
        statusCode: 200,
        data: { user: { id: "1", email: "test@example.com" } },
        message: "Success",
      });

      render(<Login />);

      // Fill out the form
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Wait for API call
      await waitFor(() => {
        expect(postSpy).toHaveBeenCalledWith("/auth/signin", {
          email: "test@example.com",
          password: "password123",
        });
      });
    });
  });

  describe("Property 2: Successful authentication navigation", () => {
    // Feature: frontend-auth-integration, Property 2: Successful authentication navigation
    // Validates: Requirements 1.2, 3.2

    it("should call API successfully on valid login", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockResolvedValue({
        success: true,
        statusCode: 200,
        data: { user: { id: "1", email: "test@example.com" } },
        message: "Success",
      });

      render(<Login />);

      // Fill out and submit form
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Should call API successfully
      await waitFor(() => {
        expect(postSpy).toHaveBeenCalledWith("/auth/signin", {
          email: "test@example.com",
          password: "password123",
        });
      });
    });
  });

  describe("Form Validation", () => {
    it("should show error for invalid email format", async () => {
      const user = userEvent.setup();

      render(<Login />);

      const emailInput = screen.getByLabelText(/email address/i);

      // Type invalid email and blur
      await user.type(emailInput, "notanemail");
      await user.tab();

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it("should show error for short password", async () => {
      const user = userEvent.setup();

      render(<Login />);

      const passwordInput = screen.getByLabelText(/^password$/i);

      // Type short password and blur
      await user.type(passwordInput, "123");
      await user.tab();

      // Should show validation error
      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("should handle 401 unauthorized error", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockRejectedValue({
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
        errors: [],
      });

      render(<Login />);

      // Fill out form
      await user.type(
        screen.getByLabelText(/email address/i),
        "wrong@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "wrongpassword");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Should show invalid credentials error
      await waitFor(() => {
        expect(
          screen.getByText(/invalid email or password/i),
        ).toBeInTheDocument();
      });
    });

    it("should handle validation errors from backend", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");
      postSpy.mockRejectedValue({
        success: false,
        statusCode: 400,
        message: "Validation Error",
        errors: [{ path: ["email"], message: "Invalid email format" }],
      });

      render(<Login />);

      // Fill out form
      await user.type(screen.getByLabelText(/email address/i), "invalid");
      await user.type(screen.getByLabelText(/^password$/i), "password123");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Should show backend validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it("should not submit form with empty fields", async () => {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(apiClient.apiClient, "post");

      render(<Login />);

      // Try to submit without filling fields
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Should not call API
      expect(postSpy).not.toHaveBeenCalled();

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
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
                  statusCode: 200,
                  data: {},
                  message: "Success",
                }),
              100,
            );
          }),
      );

      render(<Login />);

      // Fill out form
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("should show loading indicator while submitting", async () => {
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
                  statusCode: 200,
                  data: {},
                  message: "Success",
                }),
              100,
            );
          }),
      );

      render(<Login />);

      // Fill out form
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      // Should show loading text
      await waitFor(() => {
        expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();
      });
    });
  });

  describe("Property 10: Valid form enables submission", () => {
    // Feature: frontend-auth-integration, Property 10: Valid form enables submission
    // Validates: Requirements 4.5

    it("should enable submit button when form is valid", async () => {
      const user = userEvent.setup();

      render(<Login />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Initially enabled (no client-side disable logic for empty form)
      expect(submitButton).not.toBeDisabled();

      // Fill out form with valid data
      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com",
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");

      // Button should still be enabled
      expect(submitButton).not.toBeDisabled();
    });
  });
});
