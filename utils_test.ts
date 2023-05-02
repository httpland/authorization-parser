import {
  assertToken,
  assertToken68,
  divideWhile,
  isToken68,
  trimStartBy,
} from "./utils.ts";
import {
  assert,
  assertEquals,
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

describe("divideWhile", () => {
  it("should return null if the input does not match", () => {
    assertEquals(divideWhile("", () => false), null);
    assertEquals(divideWhile("a", () => false), null);
    assertEquals(divideWhile("abc", (str) => str === "b"), null);
  });

  it("should return null if the input does not match", () => {
    assertEquals(divideWhile("abc", (str) => str === "a"), ["a", "bc"]);
    assertEquals(divideWhile("abcCBA", (str) => /[a-z]/.test(str)), [
      "abc",
      "CBA",
    ]);
    assertEquals(
      divideWhile("あabc亜", (str) => /[a-z]/.test(str) || str === "あ"),
      [
        "あabc",
        "亜",
      ],
    );
    assertEquals(divideWhile("abcCBA", (str) => /.*/.test(str)), [
      "abcCBA",
      "",
    ]);
  });
});

describe("trimStartBy", () => {
  it("should return trimmed string", () => {
    const table: [string, string, string][] = [
      ["abc", "a", "bc"],
      ["abcdefg", "abc", "defg"],
      ["abcdefg", "aaa", "abcdefg"],
      ["\\\\abc", "\\", "abc"],
    ];

    table.forEach(([input, separator, expected]) => {
      assertEquals(trimStartBy(input, separator), expected);
    });
  });
});
