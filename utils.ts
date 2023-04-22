// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { trim } from "./deps.ts";

export function duplicate<T>(list: readonly T[]): T[] {
  const duplicates = new Set<T>();

  list.forEach((value, index) => {
    if (list.indexOf(value) !== index) {
      duplicates.add(value);
    }
  });

  return [...duplicates];
}

export function parseListField(input: string): string[] {
  return input
    .split(",")
    .map(trim)
    .filter(Boolean);
}
