// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Credentials API.
 * @see [RFC 9110, 11.4. Credentials](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.4)
 */
export interface Credentials {
  /** Authentication scheme. */
  readonly authScheme: string;

  /** Authentication parameters. */
  readonly params: Token68 | AuthParams | null;
}

/** Representation of [token68](https://www.rfc-editor.org/rfc/rfc9110.html#auth.params). */
export type Token68 = string;

/** Pair of name and value.
 * Representation of [auth-param](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-5).
 */
export interface AuthParams {
  readonly [k: string]: string;
}

/** Authorization API.
 * @see [RFC 9110, 11.6.2. Authorization](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.6.2)
 */
export type Authorization = Credentials;
