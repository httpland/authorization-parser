// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Authorization API. */
export interface Authorization {
  /** Authentication scheme. */
  readonly authScheme: string;

  /** token68 or auth-param. */
  readonly token: Token68 | AuthParam | null;
}

/** Representation of [token68](https://www.rfc-editor.org/rfc/rfc9110.html#auth.params). */
export type Token68 = string;

/** Pair of name and value.
 * Representation of [auth-param](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-5).
 */
export interface AuthParam {
  readonly [k: string]: string;
}
