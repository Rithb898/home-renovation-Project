
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ path?: string[]; message: string }>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private abortControllers: Map<string, AbortController>;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10);
    this.abortControllers = new Map();
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(
    endpoint: string,
    data: unknown,
    requestId?: string,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, requestId);
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, requestId?: string): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, requestId);
  }

  /**
   * Cancel a pending request by its ID
   */
  cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  /**
   * Internal request handler
   */
  private async request<T>(
    method: "GET" | "POST",
    endpoint: string,
    data?: unknown,
    requestId?: string,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();

    // Store controller for potential cancellation
    if (requestId) {
      this.abortControllers.set(requestId, controller);
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Clean up abort controller
      if (requestId) {
        this.abortControllers.delete(requestId);
      }

      const responseData = await response.json();

      // Handle error responses
      if (!response.ok) {
        const error: ApiError = {
          success: false,
          statusCode: response.status,
          message: responseData.message || "An error occurred",
          errors: responseData.errors,
        };
        throw error;
      }

      // Transform successful response
      return {
        success: true,
        statusCode: response.status,
        data: responseData.data,
        message: responseData.message || "Success",
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Clean up abort controller
      if (requestId) {
        this.abortControllers.delete(requestId);
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === "AbortError") {
        throw {
          success: false,
          statusCode: 408,
          message: "Request timeout. Please try again.",
          errors: [],
        } as ApiError;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw {
          success: false,
          statusCode: 0,
          message:
            "Unable to connect to the server. Please check your internet connection.",
          errors: [],
        } as ApiError;
      }

      // Re-throw API errors
      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error
      ) {
        throw error;
      }

      // Handle unexpected errors
      throw {
        success: false,
        statusCode: 500,
        message: "An unexpected error occurred. Please try again later.",
        errors: [],
      } as ApiError;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, ApiError };
