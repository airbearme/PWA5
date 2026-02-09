import { describe, expect, it } from "@jest/globals";
import { rideUpdateSchema, updateProfileSchema } from "../shared/schema";

describe("Security Schemas", () => {
    describe("rideUpdateSchema", () => {
        it("should allow valid updates", () => {
            const validUpdate = {
                status: "accepted",
                driverId: "driver-123"
            };
            expect(() => rideUpdateSchema.parse(validUpdate)).not.toThrow();
        });

        it("should reject malicious updates with sensitive fields like fare", () => {
            const maliciousUpdate = {
                status: "completed",
                fare: "0.00"
            };
            expect(() => rideUpdateSchema.parse(maliciousUpdate)).toThrow();
        });

        it("should reject updates to userId", () => {
            const maliciousUpdate = {
                userId: "other-user-id"
            };
            expect(() => rideUpdateSchema.parse(maliciousUpdate)).toThrow();
        });
    });

    describe("updateProfileSchema", () => {
        it("should allow valid profile updates", () => {
            const validUpdate = {
                fullName: "New Name",
                username: "newusername"
            };
            expect(() => updateProfileSchema.parse(validUpdate)).not.toThrow();
        });

        it("should reject role escalation", () => {
            const maliciousUpdate = {
                role: "admin"
            };
            expect(() => updateProfileSchema.parse(maliciousUpdate)).toThrow();
        });
    });
});
