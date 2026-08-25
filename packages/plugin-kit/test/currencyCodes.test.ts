import { CurrencyCodes } from "../src/currencyCodes.js";
import { describe, expect, it } from "vitest";

/**
 * The enum types required fields in five plugins, so a wrong member is a wrong
 * amount on a wire that moves money — see docs/currency-codes.md for what
 * shipped broken and why this is worth five lines of test.
 */
describe("CurrencyCodes", () => {
  const members = Object.keys(CurrencyCodes) as Array<
    keyof typeof CurrencyCodes
  >;

  it("uses the code as both member name and value", () => {
    for (const name of members) expect(CurrencyCodes[name]).toBe(name);
  });

  it("holds only three-letter alphabetic codes", () => {
    for (const name of members) expect(name).toMatch(/^[A-Z]{3}$/);
  });

  it("carries the codes that plugins in this repo actually need", () => {
    for (const code of ["CNY", "USD", "EUR", "GBP", "CAD", "MXN", "JPY"]) {
      expect(members).toContain(code);
    }
  });

  it("omits codes ISO 4217 has withdrawn", () => {
    for (const code of [
      "ANG",
      "BYR",
      "GWP",
      "HRK",
      "MRO",
      "SDD",
      "SLL",
      "STD",
      "TMM",
      "VEB",
      "ZMK",
      "ZWD",
    ]) {
      expect(members).not.toContain(code);
    }
  });

  it("omits RMB, which is a currency's name and not a code", () => {
    expect(members).not.toContain("RMB");
  });

  it("carries each withdrawn code's live successor", () => {
    for (const code of [
      "BYN",
      "MRU",
      "SDG",
      "SLE",
      "STN",
      "TMT",
      "VES",
      "ZMW",
      "ZWG",
      "XCG",
    ]) {
      expect(members).toContain(code);
    }
  });

  it("carries the fund, metal and special codes settlement APIs return", () => {
    for (const code of ["USN", "UYW", "XAU", "XAG", "XDR", "XXX", "XTS"]) {
      expect(members).toContain(code);
    }
  });
});
