# Mithril HTML to JavaScript converter

## Online converter

[Open online converter](http://arthurclemens.github.io/mithril-template-converter/index.html)


## Template Builder

Helper function to create Mithril templates from HTML. Use the output text to copy-paste into your source code.


```javascript
/**
 * @param {object} opts 
 * @param {string} opts.source - String containing HTML markup
 * @param {("2" | "4" | "tab")} opts.indent - Indent spacing
 * @param {("double" | "single")} opts.quotes - Quotes
 * @param {("attributes" | "selectors")} opts.attrs - Display of attributes
 * @returns {string}
 */
const resultString = templateBuilder(opts)
```

### Usage in modules

```javascript
import { templateBuilder } from "mithril-template-builder"

const source = `
<p>Mithril website: <a href="http://mithril.js.org">Mithril website</a></p>
`
const output = templateBuilder({
  source
})
```

Output:
```javascript
m("p",
  [
    "Mithril website: ",
    m("a", {"href":"http://mithril.js.org"}, 
      "Mithril website"
    )
  ]
)
```

```javascript
import { templateBuilder } from "mithril-template-builder"

const source = `
<a href="http://mithril.js.org">Mithril</a>
`
const output = templateBuilder({
  source,
  indent: "4",
  attrs: "selectors",
  quotes: "single",
})
```

Output:

```javascript
m('a[href="http://mithril.js.org"]', 
    'Mithril'
)
```



## App

Contains source code for the [online converter](http://arthurclemens.github.io/mithril-template-converter/index.html).

Helper patterns and libraries:
* [Meiosis](http://meiosis.js.org)
* [Patchinko](https://github.com/barneycarroll/patchinko)
* [Polythene](http://polythene.js.org)

