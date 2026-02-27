import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { createApp } from "../server/index";
import request from "supertest";

describe("Security: API Route Protection", () => {
    let app: any;
    let server: any;

    beforeAll(async () => {
        const result = await createApp();
        app = result.app;
        server = result.server;
    });

    afterAll((done) => {
        server.close(done);
    });

    it("should return 401 for /api/rides without auth", async () => {
        const response = await request(app).post("/api/rides").send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Missing or invalid authorization header");
    });

    it("should return 401 for /api/orders without auth", async () => {
        const response = await request(app).get("/api/orders/user/123");
        expect(response.status).toBe(401);
    });

    it("should return 401 for /api/analytics/overview without auth", async () => {
        const response = await request(app).get("/api/analytics/overview");
        expect(response.status).toBe(401);
    });

    it("should allow public access to /api/health", async () => {
        const response = await request(app).get("/api/health");
        expect(response.status).toBe(200);
    });

    it("should allow public access to /api/spots", async () => {
        const response = await request(app).get("/api/spots");
        expect(response.status).toBe(200);
    });
});
