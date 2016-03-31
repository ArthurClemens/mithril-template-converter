/*
Usage:

import templateBuilder from "app/converter/template-builder"
const input = "<hr/>"
const output = templateBuilder(input)
*/

const svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];

const svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach((term) => {
    svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

function each(list, f) {
    for (let i = 0; i < list.length; i++) {
        f(list[i], i)
    }
}

function createFragment(markup) {
    if (markup.indexOf("<!doctype") >= 0) {
        return [
            new DOMParser()
            .parseFromString(markup, "text/html")
            .childNodes[1]
        ]
    }

    const container = document.createElement("div")
    container.insertAdjacentHTML("beforeend", markup)
    return container.childNodes
}

function createVirtual(fragment) {
    const list = []

    each(fragment, function(el) {
        if (el.nodeType === 3) {
            list.push(el.nodeValue)
        } else if (el.nodeType === 1) {
            const attrs = {}
            each(el.attributes, function(attr) {
                attrs[attr.name] = attr.value
            })

            const tag = el.nodeName.toLowerCase()
            const caseTag = svgCaseSensitiveTagNamesMap[tag] ? svgCaseSensitiveTagNamesMap[tag] : tag

            list.push({
                tag: caseTag,
                attrs,
                children: createVirtual(el.childNodes)
            })
        }
    })
    return list
}

function TemplateBuilder(virtual, level) {
    this.virtual = virtual
    this.level = level
    this.virtuals = []
}

TemplateBuilder.prototype = {
    addVirtualString: function(el) {
        this.virtuals.push('"' + el.replace(/(["\r\n])/g, "\\$1") + '"')
    },

    addVirtualAttrs: function(el) {
        let virtual = el.tag === "div" ? "" : el.tag

        if (el.attrs.class) {
            virtual += "." + el.attrs.class.replace(/\s+/g, ".")
            el.attrs.class = undefined
        }

        each(Object.keys(el.attrs).sort(), function(attrName) {
            if (attrName === "style") return
            if (el.attrs[attrName] === undefined) return
            virtual += "[" + attrName + "='"
            let attrs = el.attrs[attrName]
            attrs = attrs.replace(/[\n\r\t]/g, " ")
            attrs = attrs.replace(/\s+/g, " ")
            virtual += attrs.replace(/'/g, "\\'") + "']"
        })
        
        if (virtual === "") virtual = "div"
        virtual = '"' + virtual + '"'

        if (el.attrs.style) {
            const attrs = el.attrs.style.replace(/(^.*);\s*$/, "$1") // trim trailing semi-colon
            const attrs1 = attrs.replace(/[\n\r]/g, "") // remove newlines
            const attrs2 = attrs1.split(/\s*;\s*/) // ["color:#f00", "border: 1px solid red"]
            const attrs3 = attrs2.map((propValue) => {
                // "color:#f00"
                return propValue.split(/\s*:\s*/).map((part) => {
                    return `\"${part}\"`
                }).join(": ") // "\"color\": \"#f00\""
            });
            const attrs4 = attrs3.join(", ")
            const style = `{${attrs4}}`
            virtual += ", {style: " + style + "}"
        }

        if (el.children.length !== 0) {
            let builder = new TemplateBuilder(el.children, this.level + 1)
            virtual += ", " + builder.complete()
        }

        this.virtuals.push("m(" + virtual + ")")
    },

    complete: function() {
        each(this.virtual, function(el) {
            if (typeof el === "string") {
                // dimiss empty strings and characters with char code below SPACE

                if (!/^\s*$/.test(el) && el.charCodeAt() >= 32) {
                    this.addVirtualString(el)
                }
            } else {
                this.addVirtualAttrs(el)
            }
        }.bind(this))

        if (this.virtuals.length === 1 && this.virtuals[0][0] === "\"") {
            return this.virtuals.join(", ")
        } else {
            let body = this.virtuals.join(",")
            return "[" + body + "]"
        }
    }
}

const templateBuilder = (input) => {
    const source = createVirtual(createFragment(input))
    return new TemplateBuilder(source, 1).complete()
}

if (typeof module != "undefined" && module !== null && module.exports) module.exports = templateBuilder;
else if (typeof define === "function" && define.amd) define(function() {return templateBuilder});
