// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { duplicate, parseList } from "./utils.ts";
import { head, toLowerCase } from "./deps.ts";
import type { Authorization, AuthParam } from "./types.ts";

const enum Msg {
  InvalidSyntax = "unexpected Authorization input",
  DuplicatedKeys = "auth param keys should be case insensitive unique",
}

const reAuthorization =
  /^(?<authScheme>[!#$%&'*+.^_`|~\dA-Za-z-]+)(?: +(?:(?<token68>(?:[A-Za-z]|\d|[-._~+/])+=*)|(?<authParam>.+)))?$/;

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
 *   token: "token68",
 * });
 * assertEquals(
 *   parseAuthorization(`Bearer realm="example", error="invalid_token"`),
 *   {
 *     authScheme: "Bearer",
 *     token: {
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

  const { authScheme, token68, authParam: authParamStr } = result.groups;
  const token = authParamStr ? parseAuthParam(authParamStr) : token68 ?? null;

  return { authScheme: authScheme!, token };
}

const reAuthParam =
  /^(?<key>[!#$%&'*+.^_`|~\dA-Za-z-]+)[ \t]*=[ \t]*(?<value>[!#$%&'*+.^_`|~\dA-Za-z-]+|"(?:\t| |!|[\x23-\x5B/, /[\x5D-\x7E]|[\x80-\xFF]|\\(?:\t| |[\x21-\x7E])[\x80-\xFF])*")$/;

/** Parse string into {@link AuthParam}.
 * @throws {Error} If the auth param key is duplicated.
 */
export function parseAuthParam(input: string): AuthParam {
  const list = parseList(input);

  const entries = list.map((el) => {
    const result = reAuthParam.exec(el);

    if (!result || !result.groups) throw SyntaxError(Msg.InvalidSyntax);

    return [result.groups.key, result.groups.value] as const;
  });

  const duplicates = duplicate(
    entries
      .map<string>(head)
      .map(toLowerCase),
  );

  if (duplicates.length) throw Error(Msg.DuplicatedKeys);

  return Object.fromEntries(entries);
}
