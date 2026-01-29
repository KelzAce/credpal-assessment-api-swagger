import request from "supertest";
import { app } from "../app";

describe("GET /api/v1/health", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
