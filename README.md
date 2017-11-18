# Mithril HTML to JavaScript converter

Mithril Template Converter built with [Polythene](https://github.com/ArthurClemens/Polythene).

[Live converter](http://arthurclemens.github.io/mithril-template-converter/index.html)


## Template Builder

Helper function to create Mithril templates from HTML.

~~~javascript
import templateBuilder from "mithril-template-builder"

const source = "<hr/>"
const output = templateBuilder({
	source
})
~~~


## App

Contains source code for the [live converter](http://arthurclemens.github.io/mithril-template-converter/index.html).