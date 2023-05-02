// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { escapeStringRegExp, isToken } from "./deps.ts";

export function duplicate<T>(list: readonly T[]): T[] {
  const duplicates = new Set<T>();

  list.forEach((value, index) => {
    if (list.indexOf(value) !== index) {
      duplicates.add(value);
    }
  });

  return [...duplicates];
}

/**
 * ```abnf
 * token68 = 1*( ALPHA / DIGIT /
 *           "-" / "." / "_" / "~" / "+" / "/" ) *"="
 * ```
 */
const reToken68 = /^[\w.~+/-]+?=*?$/;

/** Whether the input is [token68](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-2) or not. */
export function isToken68(input: string): boolean {
  return reToken68.test(input);
}

/** Assert the input is [token68](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-2). */
export function assertToken68(
  input: string,
  msg?: string,
  constructor: ErrorConstructor = Error,
): asserts input {
  if (!isToken68(input)) throw new constructor(msg);
}

/** Assert the input is [token](https://www.rfc-editor.org/rfc/rfc9110.html#section-5.6.2-2). */
export function assertToken(
  input: string,
  msg?: string,
  constructor: ErrorConstructor = Error,
): asserts input {
  if (!isToken(input)) throw new constructor(msg);
}

/** Divide two string. The first string is matched, second string is rest. */
export function divideWhile(
  input: string,
  match: (input: string) => boolean,
): [matched: string, rest: string] | null {
  let matched = "";

  for (const str of input) {
    if (!match(str)) break;

    matched += str;
  }

  if (!matched) return null;

  const rest = input.slice(matched.length);

  return [matched, rest];
}

/** Trim start by something. */
export function trimStartBy(input: string, separator: string): string {
  return input.replace(new RegExp(`^${escapeStringRegExp(separator)}+`), "");
}
