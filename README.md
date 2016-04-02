# Mithril HTML to JavaScript converter

Version of Mithril's [template-converter](http://mithril.js.org/tools/template-converter.html) built with [Polythene](https://github.com/ArthurClemens/Polythene).

[Live version](http://arthurclemens.github.io/mithril-template-converter/index.html)


## Call from script

~~~javascript
import templateBuilder from "app/converter/template-builder"
const input = "<hr/>"
const output = templateBuilder(input)
~~~


## Updating code

Requires babel and uglifyjs.

es6 modules are transpiled to es5 using either:

* `npm run transpile`
* `npm run watch`


## Tests

Run `tests/testrunner.html` in a browser.

Update test code, transpile (see above), run test. 