import {
  AuthorizationLike,
  escapeOctet,
  isQuoted,
  stringifyAuthorization,
  stringifyAuthParams,
  trimChar,
} from "./stringify.ts";
import {
  assertEquals,
  assertThrows,
  Authorization,
  describe,
  it,
} from "./_dev_deps.ts";
import authorization from "./authorization.json" assert { type: "json" };
import authParam from "./auth_param.json" assert { type: "json" };

describe("stringifyAuthParams", () => {
  authParam.forEach((v) => {
    it(v.name, () => {
      if (!v.must_fail && v.expected) {
        const input = v.canonical ? v.canonical : v.header;

        assertEquals(
          stringifyAuthParams(v.expected as Record<string, string>),
          input,
        );
      }
    });
  });
});

describe("stringifyAuthorization", () => {
  it("should return string if the input is valid", () => {
    const table: [AuthorizationLike, string][] = [
      [{ authScheme: "a" }, "a"],
      [{ authScheme: "basic" }, "basic"],
      [{ authScheme: "basic", params: "abcde" }, "basic abcde"],
      [{ authScheme: "basic", params: "abcde==" }, "basic abcde=="],
      [{ authScheme: "basic", params: {} }, "basic"],
      [{ authScheme: "basic", params: { a: "a" } }, "basic a=a"],
      [
        { authScheme: "basic", params: { a: "a", b: `"test"` } },
        `basic a=a, b="test"`,
      ],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(stringifyAuthorization(input), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: AuthorizationLike[] = [
      { authScheme: "" },
      { authScheme: "<invalid>" },
      { authScheme: "a", params: "" },
      { authScheme: "a", params: "<invalid>" },
      { authScheme: "a", params: { "": "" } },
      { authScheme: "a", params: { "<invalid>": "" } },
      { authScheme: "a", params: { a: "" } },
      { authScheme: "a", params: { a: "<invalid>" } },
      { authScheme: "a", params: { a: `"\x00"` } },
      { authScheme: "a", params: { a: "test", A: "test" } },
    ];

    table.forEach((input) => {
      assertThrows(() => stringifyAuthorization(input));
    });
  });

  authorization.forEach((suite) => {
    it(suite.name, () => {
      if (!suite.must_fail) {
        const input = suite.normalize ?? suite.header;

        assertEquals(
          stringifyAuthorization(suite.expected as Authorization),
          input,
        );
      }
    });
  });
});

describe("escapeOctet", () => {
  it("should escape double quote and backslash", () => {
    const table: [string, string][] = [
      ["", ""],
      ["a", "a"],
      [`\\"`, `\\"`],
      [`""`, `\\"\\"`],
      [`"\\"`, `\\"\\"`],
      [`\\"\\"`, `\\"\\"`],
      [`"""`, `\\"\\"\\"`],
      [`""""`, `\\"\\"\\"\\"`],
      [`"`, `\\"`],
      [`"a"`, `\\"a\\"`],
      [`a\\`, `a\\\\`],
      [`a"`, `a\\"`],
      [`a\\"`, `a\\"`],
      [`\\\\`, `\\\\`],
      [`\\\\\\`, `\\\\\\\\`],
      [`\\\\\\\\`, `\\\\\\\\`],
      [`\\`, `\\\\`],
      ['"\\"', `\\"\\"`],
      ['\\\\\\"', `\\\\\\"`],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(escapeOctet(input), expected);
    });
  });
});

describe("escapeOctet", () => {
  it("should escape double quote and backslash", () => {
    const table: [string, string][] = [
      ["", ""],
      ["a", "a"],
      [`\\"`, `\\"`],
      [`""`, `\\"\\"`],
      [`"\\"`, `\\"\\"`],
      [`\\"\\"`, `\\"\\"`],
      [`"""`, `\\"\\"\\"`],
      [`""""`, `\\"\\"\\"\\"`],
      [`"`, `\\"`],
      [`"a"`, `\\"a\\"`],
      [`a\\`, `a\\\\`],
      [`a"`, `a\\"`],
      [`a\\"`, `a\\"`],
      [`\\\\`, `\\\\`],
      [`\\\\\\`, `\\\\\\\\`],
      [`\\\\\\\\`, `\\\\\\\\`],
      [`\\`, `\\\\`],
      ['"\\"', `\\"\\"`],
      ['\\\\\\"', `\\\\\\"`],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(escapeOctet(input), expected);
    });
  });
});

describe("isQuoted", () => {
  it("should pass", () => {
    const table: [string, boolean][] = [
      ["a", false],
      ["ab", false],
      [`"`, false],
      [` ""`, false],
      [`""`, true],
      [`"a"`, true],
      [`""""`, true],
      [`"""`, true],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(isQuoted(input), expected);
    });
  });
});

describe("trimChar", () => {
  it("should pass", () => {
    const table: [string, string][] = [
      ["a", ""],
      ["ab", ""],
      ["abc", "b"],
      ["abcd", "bc"],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(trimChar(input), expected);
    });
  });
});
