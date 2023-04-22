// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export interface Authorization {
  readonly authScheme: string;
  readonly token: string | Record<string, string> | null;
}

export interface AuthParam {
  readonly [k: string]: string;
}
