import { either, namedCapture, sequence, suffix } from "npm:compose-regexp";
import { optimize } from "https://esm.sh/regexp-tree";

const tchar = /[!#$%&'*+.^_`|~\dA-Za-z-]/;
const token = suffix("+", tchar);
const SP = / /;

const OWS = /[ \t]*/;
const BWS = OWS;

const DQUOTE = /"/;
const obsText = /[\x80-\xFF]/;
const HTAB = /\t/;
const qdtext = either(HTAB, SP, "\x21", /[\x23-\x5B/, /[\x5D-\x7E]/, obsText);
const VCHAR = /[\x21-\x7E]/;
const quotedPair = sequence("\\", either(HTAB, SP, VCHAR, obsText));

const quotedString = sequence(
  DQUOTE,
  suffix("*", either(qdtext, quotedPair)),
  DQUOTE,
);

const authParam = sequence(
  namedCapture("key", token),
  BWS,
  "=",
  BWS,
  either(
    namedCapture("token", token),
    namedCapture("quotedString", quotedString),
  ),
);

if (import.meta.main) {
  console.log("authParam: ", optimize(authParam).toRegExp());
}
