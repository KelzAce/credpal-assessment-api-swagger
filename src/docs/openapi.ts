/*
  OpenAPI (Swagger) spec for the CredPal Assessment API.
  - Express + TypeScript + MongoDB/Mongoose
  - JWT Bearer auth for protected routes
*/

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "CredPal Assessment API",
    version: "1.0.0",
    description:
      "CRUD + Auth assessment API built with Node.js (Express), TypeScript and MongoDB. Includes JWT authentication and protected CRUD routes.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Base URL",
    },
  ],
  tags: [
    { name: "Health", description: "Health check" },
    { name: "Auth", description: "Authentication" },
    { name: "Transactions", description: "Protected CRUD endpoints" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste the JWT here (e.g. from /auth/login). Swagger UI will send it as `Authorization: Bearer <token>`.",
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "OK" },
        },
        required: ["success", "message"],
      },

      RegisterRequest: {
        type: "object",
        properties: {
          fullName: { type: "string", example: "Ada Lovelace" },
          email: { type: "string", format: "email", example: "ada@example.com" },
          password: { type: "string", example: "StrongPassword123!" },
        },
        required: ["fullName", "email", "password"],
      },

      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "ada@example.com" },
          password: { type: "string", example: "StrongPassword123!" },
        },
        required: ["email", "password"],
      },

      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "66f4e0d0f0c0a3c2b1a2b3c4" },
          fullName: { type: "string", example: "Ada Lovelace" },
          email: { type: "string", format: "email", example: "ada@example.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          __v: { type: "integer", example: 0 },
        },
        required: ["_id", "fullName", "email", "createdAt", "updatedAt"],
      },

      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful" },
          token: { type: "string", example: "<jwt>" },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["success", "message", "token", "user"],
      },

      Transaction: {
        type: "object",
        properties: {
          _id: { type: "string", example: "66f4e130f0c0a3c2b1a2b3d0" },
          user: { type: "string", example: "66f4e0d0f0c0a3c2b1a2b3c4" },
          type: { type: "string", enum: ["income", "expense"], example: "expense" },
          amount: { type: "number", example: 2500 },
          currency: { type: "string", example: "NGN" },
          description: { type: "string", nullable: true, example: "Lunch" },
          category: { type: "string", nullable: true, example: "Food" },
          occurredAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          __v: { type: "integer", example: 0 },
        },
        required: [
          "_id",
          "user",
          "type",
          "amount",
          "currency",
          "occurredAt",
          "createdAt",
          "updatedAt",
        ],
      },

      CreateTransactionRequest: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["income", "expense"], example: "expense" },
          amount: { type: "number", example: 2500 },
          currency: {
            type: "string",
            example: "NGN",
            description: "3-letter currency code. Defaults to NGN if omitted.",
          },
          description: { type: "string", example: "Lunch", nullable: true },
          category: { type: "string", example: "Food", nullable: true },
          occurredAt: {
            type: "string",
            format: "date-time",
            example: "2026-01-28T10:30:00.000Z",
            description: "ISO date-time string. Defaults to now if omitted.",
          },
        },
        required: ["type", "amount"],
      },

      UpdateTransactionRequest: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["income", "expense"], example: "income" },
          amount: { type: "number", example: 5000 },
          currency: { type: "string", example: "NGN" },
          description: { type: "string", example: "Salary", nullable: true },
          category: { type: "string", example: "Income", nullable: true },
          occurredAt: { type: "string", format: "date-time" },
        },
      },

      TransactionResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Transaction fetched" },
          data: { $ref: "#/components/schemas/Transaction" },
        },
        required: ["success", "message", "data"],
      },

      TransactionListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Transactions fetched" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Transaction" },
          },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 34 },
              pages: { type: "integer", example: 4 },
            },
            required: ["page", "limit", "total", "pages"],
          },
        },
        required: ["success", "message", "data", "meta"],
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error" },
          details: { description: "Optional error details", nullable: true },
          errors: { description: "Optional validation errors", nullable: true },
        },
        required: ["success", "message"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "409": {
            description: "Email already in use",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/transactions": {
      post: {
        tags: ["Transactions"],
        summary: "Create a transaction (protected)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTransactionRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Transaction created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      get: {
        tags: ["Transactions"],
        summary: "List transactions (protected)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (1-based)",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            description: "Items per page (max 100)",
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", default: "-occurredAt" },
            description:
              "Sort expression (e.g. -occurredAt for desc, occurredAt for asc).",
          },
        ],
        responses: {
          "200": {
            description: "Transactions fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionListResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/transactions/{id}": {
      get: {
        tags: ["Transactions"],
        summary: "Get a transaction by id (protected)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Transaction ID",
          },
        ],
        responses: {
          "200": {
            description: "Transaction fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Transaction not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Transactions"],
        summary: "Update a transaction (protected)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Transaction ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTransactionRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Transaction updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Transaction not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Transactions"],
        summary: "Delete a transaction (protected)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Transaction ID",
          },
        ],
        responses: {
          "200": {
            description: "Transaction deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Transaction not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
} as const;
