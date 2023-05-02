// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { divideWhile, duplicate, isToken68, trimStartBy } from "./utils.ts";
import {
  head,
  isString,
  isToken,
  parseListFields,
  toLowerCase,
} from "./deps.ts";
import { Msg } from "./constants.ts";
import type { Authorization, AuthParams } from "./types.ts";

/** Parse string into {@link Authorization}.
 *
 * @example
 * ```ts
 * import { parseAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/parse.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const result = parseAuthorization("Basic token68");
 *
 * assertEquals(parseAuthorization("Basic token68"), {
 *   authScheme: "Basic",
 *   params: "token68",
 * });
 * assertEquals(
 *   parseAuthorization(`Bearer realm="example", error="invalid_token"`),
 *   {
 *     authScheme: "Bearer",
 *     params: {
 *       realm: `"example"`,
 *       error: `"invalid_token"`,
 *     },
 *   },
 * );
 * ```
 *
 * @throws {SyntaxError} If the input is invalid.
 * @throws {Error} If the auth param key is duplicated.
 */
export function parseAuthorization(input: string): Authorization {
  const result = divideWhile(input, isToken);

  if (!result) throw new SyntaxError(Msg.InvalidSyntax);

  const [authScheme, rest] = result;

  // challenge = auth-scheme
  if (!rest) return { authScheme, params: null };
  if (!rest.startsWith(" ")) throw new SyntaxError(Msg.InvalidSyntax);

  const maybeToken68OrAuthParam = trimStartBy(rest, " ");

  // challenge = auth-scheme [ 1*SP ( token68 ) ]
  if (isToken68(maybeToken68OrAuthParam)) {
    return { authScheme, params: maybeToken68OrAuthParam };
  }

  // challenge = auth-scheme [ 1*SP ( #auth-param ) ]
  const params = parseAuthParams(maybeToken68OrAuthParam);

  return { authScheme, params };
}

/** Generate from _abnf.ts. */
const reAuthParam =
  /^(?<key>(?=([\w!#$%&'*+.^`|~-]+))\2)[\t ]*=[\t ]*(?:(?<token>(?=([\w!#$%&'*+.^`|~-]+))\4)|(?<quotedString>"(?=((?:\t| |!|[ \x23-\x5B\x5D-\x7E]|[\x80-\xFF]|\\(?:\t| |[\x21-\x7E]|[\x80-\xFF]))*))\6"))$/;

type AuthParamGroups =
  & { key: string }
  & ({ token: string; quotedString: never } | {
    token: never;
    quotedString: string;
  });

/** Parse string into {@link AuthParam}.
 * @throws {SyntaxError} It the input is invalid [auth-param](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-5).
 * @throws {Error} If the auth param key is duplicated.
 */
export function parseAuthParams(input: string): AuthParams {
  const list = parseListFields(input);

  const entries = list.map((el) => {
    const result = reAuthParam.exec(el);

    if (!result || !result.groups) throw new SyntaxError(Msg.InvalidSyntax);

    const groups = result.groups as AuthParamGroups;
    const value = isString(groups.token)
      ? groups.token
      : groups.quotedString.replace(/\\(.)/g, "$1");

    return [groups.key, value] as const;
  });

  const duplicates = duplicate(
    entries
      .map<string>(head)
      .map(toLowerCase),
  );

  if (duplicates.length) throw Error(Msg.DuplicatedKeys);

  return Object.fromEntries(entries);
}
