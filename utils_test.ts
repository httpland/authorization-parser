import { assertToken, assertToken68, isToken68 } from "./utils.ts";
import {
  assert,
  assertFalse,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";

describe("isToken68", () => {
  it("should return true", () => {
    const table: string[] = [
      "a",
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "0123456789",
      "~",
      "+",
      "/",
      "-",
      "_",
      ".",
      "a=",
      "a===========",
    ];

    table.forEach((input) => {
      assert(isToken68(input));
    });
  });

  it("should return false", () => {
    const table: string[] = [
      "",
      " ",
      " a",
      "=",
      "あ",
      ":",
      "`",
      "a=a",
    ];

    table.forEach((input) => {
      assertFalse(isToken68(input));
    });
  });
});

describe("assertToken68", () => {
  it("should return void if the input is valid token68", () => {
    assertFalse(assertToken68("a=="));
  });

  it("should throw error if the input is invalid token68", () => {
    assertThrows(() => assertToken68(""));
    assertThrows(() => assertToken68("?"));
  });
});

describe("assertToken", () => {
  it("should return void if the input is valid token", () => {
    assertFalse(assertToken("a"));
  });

  it("should throw error if the input is invalid token", () => {
    assertThrows(() => assertToken(""));
    assertThrows(() => assertToken("a=="));
  });
});
