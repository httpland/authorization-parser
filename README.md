# authorization-parser

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/authorization_parser)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/authorization_parser/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/httpland/authorization-parser)](https://github.com/httpland/authorization-parser/releases)
[![codecov](https://codecov.io/github/httpland/authorization-parser/branch/main/graph/badge.svg)](https://codecov.io/gh/httpland/authorization-parser)
[![GitHub](https://img.shields.io/github/license/httpland/authorization-parser)](https://github.com/httpland/authorization-parser/blob/main/LICENSE)

[![test](https://github.com/httpland/authorization-parser/actions/workflows/test.yaml/badge.svg)](https://github.com/httpland/authorization-parser/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@httpland/authorization-parser.png?mini=true)](https://nodei.co/npm/@httpland/authorization-parser/)

HTTP Authentication and Authorization `Authorization` field parser and
serializer.

Compliant with
[RFC 9110, 11.6.2. Authorization](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.6.2).

## Parsing

Parse string into [Authorization](#authorization).

```ts
import { parseAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/parse.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const result = parseAuthorization("Basic token68");

assertEquals(parseAuthorization("Basic token68"), {
  authScheme: "Basic",
  params: "token68",
});
assertEquals(
  parseAuthorization(`Bearer realm="example", error="invalid_token"`),
  {
    authScheme: "Bearer",
    params: {
      realm: `"example"`,
      error: `"invalid_token"`,
    },
  },
);
```

### Throwing error

In the following cases, throws an error.

- Syntax error
- Semantic error

#### Syntax error

If field value has an invalid syntax, it may throw a `SyntaxError`.

The syntax follows
[Authorization ABNF](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.6.2-2).

```ts
import { parseAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/parse.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parseAuthorization("<invalid>"));
```

#### Semantic error

In case of semantic errors, throw an `Error`.

- If there is a duplicate key(case insensitive) in
  [auth-param](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-5)

```ts
import { parseAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/parse.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() =>
  parseAuthorization("scheme duplicate=value, Duplicate=value")
);
```

## Serialization

Serialize [Authorization](#authorization) into string.

```ts
import { stringifyAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/stringify.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(
  stringifyAuthorization({ authScheme: "Basic", params: "token68==" }),
  "Basic token68",
);
assertEquals(
  stringifyAuthorization({
    authScheme: "Bearer",
    params: { realm: `"Secure area"`, error: `"invalid_token"` },
  }),
  `Bearer realm="Secure area", error="invalid_token"`,
);
```

### Error

Throws an error in the following cases:

- `authScheme` is invalid
  [auth-scheme](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.1-2)
- `params` is invalid
  [token68](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.2-2)
- `params` key is invalid
  [token](https://www.rfc-editor.org/rfc/rfc9110.html#section-5.6.2-2)
- `params` value is invalid
  [token](https://www.rfc-editor.org/rfc/rfc9110.html#section-5.6.2-2) or
  [quoted-string](https://www.rfc-editor.org/rfc/rfc9110.html#section-5.6.4-2)
- There is a duplication in `params` keys(case-insensitive)

```ts
import { stringifyAuthorization } from "https://deno.land/x/authorization_parser@$VERSION/stringify.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() =>
  stringifyAuthorization({ authScheme: "<invalid:auth-scheme>" })
);
assertThrows(() =>
  stringifyAuthorization({ authScheme: "<valid>", params: "<invalid:token68>" })
);
assertThrows(() =>
  stringifyAuthorization({
    authScheme: "<valid>",
    params: { "<invalid:token>": "<valid>" },
  })
);
assertThrows(() =>
  stringifyAuthorization({
    authScheme: "<valid>",
    params: { "<valid>": "<invalid:token|quoted-string>" },
  })
);
assertThrows(() =>
  stringifyAuthorization({
    authScheme: "<valid>",
    params: { "<duplicate>": "<valid>", "<DUPLICATE>": "<valid>" },
  })
);
```

## Authorization

`Authorization` is following structure:

| Name       | Type                                        | Description            |
| ---------- | ------------------------------------------- | ---------------------- |
| authScheme | `string`                                    | Authentication scheme. |
| params     | `Token68` &#124; `AuthParams` &#124; `null` | token68 or auth-param. |

### Token68

It is the same as `string`.

The token68 syntax allows the 66 unreserved URI characters, plus a few others,
so that it can hold a base64, base64url (URL and filename safe alphabet),
base32, or base16 (hex) encoding, with or without padding, but excluding
whitespace.

### AuthParams

It is name/value pairs.

```ts
interface AuthParams {
  readonly [k: string]: string;
}
```

## Compatibility

[parser](#parsing) is compatible with
[RFC 9110, 11.3. Challenge and Response](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.3)
and
[RFC 9110, 11.4. Credentials](https://www.rfc-editor.org/rfc/rfc9110.html#section-11.4)
syntax and can be used in the same way.

## API

All APIs can be found in the
[deno doc](https://doc.deno.land/https/deno.land/x/authorization_parser/mod.ts).

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
