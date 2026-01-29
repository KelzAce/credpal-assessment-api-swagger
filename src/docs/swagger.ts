import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi";

/**
 * Mounts Swagger UI + JSON spec endpoints.
 *
 * - GET  /api/v1/docs      => Swagger UI
 * - GET  /api/v1/docs.json => Raw OpenAPI JSON
 */
export function setupSwagger(app: Express) {
  app.get("/api/v1/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(openApiSpec);
  });

  app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
      customSiteTitle: "CredPal Assessment API Docs",
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
}
