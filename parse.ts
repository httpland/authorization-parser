// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { duplicate } from "./utils.ts";
import { head, isString, parseListFields, toLowerCase } from "./deps.ts";
import { Msg } from "./constants.ts";
import type { Authorization, AuthParams } from "./types.ts";

/** Generate from _abnf.ts. */
const reAuthorization =
  /^(?<authScheme>(?=([\w!#$%&'*+.^`|~-]+))\2)(?:(?=( +))\3(?:(?<token68>(?=((?:[A-Za-z]|\d|[+./_~-])+))\5(?=(=*))\6)|(?<authParam>(?=(.*))\8)))?$/;

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
  const result = reAuthorization.exec(input);

  if (!result || !result.groups) throw SyntaxError(Msg.InvalidSyntax);

  const groups = result.groups as ParsedGroups;
  const { authScheme } = groups;
  const params = isString(groups.authParam)
    ? parseAuthParams(groups.authParam)
    : groups.token68;

  return { authScheme, params: params ?? null };
}

type ParsedGroups = {
  readonly authScheme: string;
  readonly token68: string | undefined;
  readonly authParam: string | undefined;
};

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

    if (!result || !result.groups) throw SyntaxError(Msg.InvalidSyntax);

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
