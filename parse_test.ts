import { parseAuthorization, parseAuthParam } from "./parse.ts";
import {
  assertEquals,
  assertIsError,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";
import authParam from "./auth_param.json" assert { type: "json" };
import authorization from "./authorization.json" assert { type: "json" };

describe("parseAuthorization", () => {
  authorization.forEach((suite) => {
    it(suite.name, () => {
      if (suite.must_fail) {
        assertThrows(() => parseAuthorization(suite.header));
      } else {
        assertEquals<unknown>(parseAuthorization(suite.header), suite.expected);
      }
    });
  });

  it("should be syntax error if the input is invalid syntax", () => {
    let err;

    try {
      parseAuthorization("");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, "unexpected Authorization input");
    }
  });

  it("should be error if the auth param keys include duplication", () => {
    let err;

    try {
      parseAuthorization("test a=a, A=a");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        Error,
        "auth param keys should be case insensitive unique",
      );
    }
  });
});

describe("parseAuthParam", () => {
  authParam.forEach((v) => {
    it(v.name, () => {
      if (v.must_fail) {
        assertThrows(() => parseAuthParam(v.header));
      } else {
        assertEquals<Record<string, unknown>>(
          parseAuthParam(v.header),
          v.expected!,
        );
      }
    });
  });
});
