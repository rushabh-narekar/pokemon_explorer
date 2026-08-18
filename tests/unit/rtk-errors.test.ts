import { describe, expect, it } from "vitest";
import { isRtkNotFoundError } from "@/lib/rtk-errors";

describe("isRtkNotFoundError", () => {
  it("detects numeric 404 errors", () => {
    expect(isRtkNotFoundError({ status: 404, data: "Not found" })).toBe(true);
  });

  it("detects parsing errors that preserve original 404 status", () => {
    expect(
      isRtkNotFoundError({
        status: "PARSING_ERROR",
        originalStatus: 404,
        data: "Not found",
        error: "Invalid JSON",
      }),
    ).toBe(true);
  });

  it("returns false for server errors", () => {
    expect(isRtkNotFoundError({ status: 500, data: "Server error" })).toBe(false);
  });
});
