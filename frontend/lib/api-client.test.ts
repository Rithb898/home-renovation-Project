import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { apiClient } from "./api-client";

describe("ApiClient", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Request Header Configuration", () => {
    it("should set Content-Type header to application/json", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: { test: "data" }, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.post("/test", { key: "value" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("should use POST method for post requests", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.post("/test", {});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    it("should use GET method for get requests", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
        }),
      );
    });
  });

  describe("Request Body Formatting", () => {
    it("should stringify request body for POST requests", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const testData = { email: "test@example.com", password: "password123" };
      await apiClient.post("/auth/signin", testData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(testData),
        }),
      );
    });

    it("should not include body for GET requests", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: undefined,
        }),
      );
    });
  });

  describe("Response Transformation", () => {
    it("should transform successful response correctly", async () => {
      const mockData = { id: 1, name: "Test User" };
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: mockData, message: "User created" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await apiClient.post("/users", {});

      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: mockData,
        message: "User created",
      });
    });

    it("should use default message if not provided", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {} }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await apiClient.get("/test");

      expect(result.message).toBe("Success");
    });
  });

  describe("Error Response Handling", () => {
    it("should throw ApiError for 400 validation errors", async () => {
      const mockError = {
        message: "Validation Error",
        errors: [{ path: ["email"], message: "Invalid email" }],
      };
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => mockError,
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiClient.post("/test", {})).rejects.toEqual({
        success: false,
        statusCode: 400,
        message: "Validation Error",
        errors: mockError.errors,
      });
    });

    it("should throw ApiError for 409 conflict errors", async () => {
      const mockResponse = {
        ok: false,
        status: 409,
        json: async () => ({ message: "Email already registered" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiClient.post("/auth/signup", {})).rejects.toEqual({
        success: false,
        statusCode: 409,
        message: "Email already registered",
        errors: undefined,
      });
    });

    it("should throw ApiError for 500 server errors", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiClient.get("/test")).rejects.toEqual({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        errors: undefined,
      });
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new TypeError("Failed to fetch"),
      );

      await expect(apiClient.post("/test", {})).rejects.toEqual({
        success: false,
        statusCode: 0,
        message:
          "Unable to connect to the server. Please check your internet connection.",
        errors: [],
      });
    });

    it("should use default error message if not provided", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({}),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(apiClient.post("/test", {})).rejects.toEqual({
        success: false,
        statusCode: 400,
        message: "An error occurred",
        errors: undefined,
      });
    });
  });

  describe("Timeout Behavior", () => {
    it("should include abort signal in fetch call", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.post("/test", {});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("should handle abort errors as timeout", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      (global.fetch as any).mockRejectedValueOnce(abortError);

      await expect(apiClient.post("/test", {})).rejects.toEqual({
        success: false,
        statusCode: 408,
        message: "Request timeout. Please try again.",
        errors: [],
      });
    });
  });

  describe("URL Construction", () => {
    it("should construct correct URL with base URL and endpoint", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ data: {}, message: "Success" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await apiClient.post("/auth/signin", {});

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/auth/signin",
        expect.any(Object),
      );
    });
  });
});
