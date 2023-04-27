import { AuthorizationLike, stringifyAuthorization } from "./stringify.ts";
import {
  assertEquals,
  assertThrows,
  Authorization,
  describe,
  it,
} from "./_dev_deps.ts";

import authorization from "./authorization.json" assert { type: "json" };

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
