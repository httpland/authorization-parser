// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export const enum Msg {
  InvalidSyntax = "unexpected Authorization input",
  DuplicatedKeys = "auth param keys should be case insensitive unique",
  InvalidToken = "should be <token> format",
  InvalidToken68 = "should be <token68> format",
}
