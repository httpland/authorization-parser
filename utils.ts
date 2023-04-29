// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isToken, trim } from "./deps.ts";

export function duplicate<T>(list: readonly T[]): T[] {
  const duplicates = new Set<T>();

  list.forEach((value, index) => {
    if (list.indexOf(value) !== index) {
      duplicates.add(value);
    }
  });

  return [...duplicates];
}

const reCommaSplitWithoutDQuote = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

/** Parse string into list-based field. */
export function parseList(input: string): string[] {
  return input
    .split(reCommaSplitWithoutDQuote)
    .map(trim)
    .filter(Boolean);
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
