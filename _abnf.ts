import {
  either,
  maybe,
  namedCapture,
  sequence,
  suffix,
} from "npm:compose-regexp";
import { optimize } from "https://esm.sh/regexp-tree";

const tchar = /[!#$%&'*+.^_`|~\dA-Za-z-]/;
const token = suffix("+", tchar);
const authScheme = namedCapture("authScheme", token);
const SP = / /;
const ALPHA = /[A-Za-z]/;
const DIGIT = /\d/;
const token68 = sequence(
  suffix("+", either(ALPHA, DIGIT, /[-._~+/]/)),
  suffix("*", "="),
);

const challenge = sequence(
  authScheme,
  maybe(
    suffix("+", SP),
    either(
      namedCapture("token68", token68),
      namedCapture("authParam", /.+/),
    ),
  ),
);

const OWS = /[ \t]*/;
const BWS = OWS;

const element = sequence(
  maybe(/.*?/, suffix("*", OWS, ",", OWS, maybe(/.*?/))),
);

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
  console.log("challenge:", challenge);
  console.log("element: ", element);
  console.log("authParam: ", optimize(authParam).toRegExp());
  console.log("token: ", optimize(token).toRegExp());
  console.log("token68: ", optimize(token68).toRegExp());
  console.log(
    "quoted-string: ",
    optimize(quotedString).toRegExp(),
  );
}
