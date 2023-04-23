// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isNullable, isString, toLowerCase } from "./deps.ts";
import { duplicate } from "./utils.ts";
import { Msg } from "./constants.ts";
import type { Authorization, AuthParams } from "./types.ts";

export interface AuthorizationLike
  extends
    Pick<Authorization, "authScheme">,
    Partial<Pick<Authorization, "params">> {
}

/** Serialize {@link AuthorizationLike} into string.
 *
 * @example
 * ```ts
 * import { stringifyAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/stringify.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals(
 *   stringifyAuthorization({ authScheme: "Basic", params: "token68==" }),
 *   "Basic token68",
 * );
 * assertEquals(
 *   stringifyAuthorization({
 *     authScheme: "Bearer",
 *     params: { realm: `"Secure area"`, error: `"invalid_token"` },
 *   }),
 *   `Bearer realm="Secure area", error="invalid_token"`,
 * );
 * ```
 *
 * @throws {Error} If the input is invalid {@link AuthorizationLike}.
 */
export function stringifyAuthorization(input: AuthorizationLike): string {
  assertToken(input.authScheme, `authScheme ${Msg.InvalidToken}`);

  if (isNullable(input.params)) return input.authScheme;

  const data = isString(input.params)
    ? (assertToken68(input.params, `token ${Msg.InvalidToken68}`), input.params)
    : stringifyAuthParams(input.params);

  return [input.authScheme, data].filter(Boolean).join(" ");
}

const reToken = /^[\w!#$%&'*+.^`|~-]+$/;

export function assertToken(
  input: string,
  msg?: string,
  constructor: ErrorConstructor = Error,
): asserts input {
  if (!isToken(input)) throw new constructor(msg);
}

export function isToken(input: string): boolean {
  return reToken.test(input);
}

const reToken68 = /^[A-Za-z\d+./_~-]+=*$/;

export function isToken68(input: string): boolean {
  return reToken68.test(input);
}

export function assertToken68(
  input: string,
  msg?: string,
  constructor: ErrorConstructor = Error,
): asserts input {
  if (!isToken68(input)) throw new constructor(msg);
}

const reQuotedString =
  /^"(?:\t| |!|[ \x23-\x5B\x5D-\x7E]|[\x80-\xFF]|\\(?:\t| |[\x21-\x7E])[\x80-\xFF])*"$/;

export function isQuotedString(input: string): boolean {
  return reQuotedString.test(input);
}

function assertAuthParam(input: AuthParams): asserts input {
  for (const key in input) {
    assertToken(key, `token key ${Msg.InvalidToken}`);

    const value = input[key]!;

    if (isToken(value) || isQuotedString(value)) continue;

    throw Error(`token value should be <token> or <quoted-string> format`);
  }

  const duplicates = duplicate(Object.keys(input).map(toLowerCase));

  if (duplicates.length) throw Error(Msg.DuplicatedKeys);
}

export function stringifyAuthParams(input: AuthParams): string {
  assertAuthParam(input);

  return Object
    .entries(input)
    .map(joinEntry)
    .join(", ");
}

function joinEntry(
  entry: readonly [string, string],
): string {
  return entry[0] + "=" + entry[1];
}
