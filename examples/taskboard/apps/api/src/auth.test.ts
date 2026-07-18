import { describe, expect, it } from "vitest";
import { issueToken, verifyToken } from "./auth.js";

describe("issueToken / verifyToken", () => {
  it("round-trips a subject", () => {
    const token = issueToken("member-1", "secret");
    const claims = verifyToken(token, "secret");
    expect(claims?.sub).toBe("member-1");
  });

  it("rejects a tampered token", () => {
    const token = issueToken("member-1", "secret");
    const tampered = `${token}x`;
    expect(verifyToken(tampered, "secret")).toBeNull();
  });

  it("rejects the wrong secret", () => {
    const token = issueToken("member-1", "secret");
    expect(verifyToken(token, "other")).toBeNull();
  });
});
