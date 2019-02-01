# Mithril HTML to JavaScript converter

## Online converter

[Open online converter](http://arthurclemens.github.io/mithril-template-converter/index.html)


## Template Builder

Helper function to create Mithril templates from HTML. Use the output text to copy-paste into your source code.


~~~javascript
/**
 * @param {object} opts 
 * @param {string} opts.source - String containing HTML markup
 * @param {("2" | "4" | "tab")} opts.indent - Indent spacing
 * @returns {string}
 */
const resultString = templateBuilder(opts)
~~~

Usage:

~~~javascript
import templateBuilder from "mithril-template-builder"

const source = "<hr/>"
const output = templateBuilder({
  source
})

// output:
// m("hr")
~~~


## App

Contains source code for the [online converter](http://arthurclemens.github.io/mithril-template-converter/index.html).

Helper patterns and libraries:
* [Meiosis](http://meiosis.js.org)
* [Patchinko](https://github.com/barneycarroll/patchinko)
* [Polythene](http://polythene.js.org)

