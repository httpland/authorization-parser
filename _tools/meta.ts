import { BuildOptions } from "https://deno.land/x/dnt@0.34.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/authorization-parser",
    version,
    description: "HTTP Authorization field parser and serializer",
    keywords: [
      "http",
      "authorization",
      "parse",
      "parser",
      "header",
      "serializer",
      "serialize",
      "stringify",
      "field",
      "rfc-9110",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/authorization-parser",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/authorization-parser.git",
    },
    bugs: {
      url: "https://github.com/httpland/authorization-parser/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/prelude_js@1.2.0/to_lower_case.ts": {
      name: "@miyauci/prelude",
      version: "1.2.0",
      subPath: "to_lower_case.js",
    },
    "https://deno.land/x/prelude_js@1.2.0/trim.ts": {
      name: "@miyauci/prelude",
      version: "1.2.0",
      subPath: "trim.js",
    },
    "https://deno.land/x/prelude_js@1.2.0/head.ts": {
      name: "@miyauci/prelude",
      version: "1.2.0",
      subPath: "head.js",
    },
    "https://deno.land/x/isx@1.3.1/is_string.ts": {
      name: "@miyauci/isx",
      version: "1.3.1",
      subPath: "is_string.js",
    },
    "https://deno.land/x/isx@1.3.1/is_nullable.ts": {
      name: "@miyauci/isx",
      version: "1.3.1",
      subPath: "is_nullable.js",
    },
    "https://deno.land/x/http_utils@1.1.0/quoted_string.ts": {
      name: "@httpland/http-utils",
      version: "1.1.0",
      subPath: "quoted_string.js",
    },
    "https://deno.land/x/http_utils@1.1.0/token.ts": {
      name: "@httpland/http-utils",
      version: "1.1.0",
      subPath: "token.js",
    },
  },
});
