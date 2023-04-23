// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { duplicate, parseList } from "./utils.ts";
import { head, isString, toLowerCase } from "./deps.ts";
import { Msg } from "./constants.ts";
import type { Authorization, AuthParams } from "./types.ts";

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

const reAuthParam =
  /^(?<key>[!#$%&'*+.^_`|~\dA-Za-z-]+)[ \t]*=[ \t]*(?<value>[!#$%&'*+.^_`|~\dA-Za-z-]+|"(?:\t| |!|[\x23-\x5B/, /[\x5D-\x7E]|[\x80-\xFF]|\\(?:\t| |[\x21-\x7E])[\x80-\xFF])*")$/;

/** Parse string into {@link AuthParam}.
 * @throws {Error} If the auth param key is duplicated.
 */
export function parseAuthParams(input: string): AuthParams {
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
