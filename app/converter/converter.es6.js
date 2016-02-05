import m from 'mithril';
import button from 'polythene/button/button';
import textfield from 'polythene/textfield/textfield';

function each(list, f) {
    for (var i = 0; i < list.length; i++) {
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

    var container = document.createElement("div")
    container.insertAdjacentHTML("beforeend", markup)
    return container.childNodes
}

function createVirtual(fragment) {
    var list = []

    each(fragment, function(el) {
        if (el.nodeType === 3) {
            list.push(el.nodeValue)
        } else if (el.nodeType === 1) {
            var attrs = {}

            each(el.attributes, function(attr) {
                attrs[attr.name] = attr.value
            })

            list.push({
                tag: el.nodeName.toLowerCase(),
                attrs: attrs,
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
    this.indented = false
}

TemplateBuilder.prototype = {
    addVirtualString: function(el) {
        if (/\t| {2,}/.test(el) && /^\s*/.test(el)) {
            this.indented = true
        } else {
            this.virtuals.push('"' + el.replace(/(["\r\n])/g, "\\$1") + '"')
        }
    },

    addVirtualAttrs: function(el) {
        var virtual = el.tag === "div" ? "" : el.tag

        if (el.attrs.class) {
            virtual += "." + el.attrs.class.replace(/\s+/g, ".")
            el.attrs.class = undefined
        }

        each(Object.keys(el.attrs).sort(), function(attrName) {
            if (attrName === "style") return
            if (el.attrs[attrName]===undefined) return
            virtual += "[" + attrName + "='"
            virtual += el.attrs[attrName].replace(/'/g, "\\'") + "']"
        })

        if (virtual === "") virtual = "div"
        virtual = '"' + virtual + '"'

        if (el.attrs.style) {
            var style = "{\"" + el.attrs.style
                .replace(/:/g, "\": \"")
                .replace(/;/g, "\", \"") + "}"
            virtual += ", {style: " + style.replace(/(, )"}/, "}") + "}"
        }

        if (el.children.length !== 0) {
            var builder = new TemplateBuilder(el.children, this.level + 1)
            virtual += ", " + builder.complete()
        }

        this.virtuals.push("m(" + virtual + ")")
    },

    complete: function() {
        var tab = "\n"
        for (var i = 0; i <= this.level; i++) tab += "\t"

        each(this.virtual, function(el) {
            if (typeof el === "string") {
                this.addVirtualString(el)
            } else {
                this.addVirtualAttrs(el)
            }
        }.bind(this))

        if (!this.indented) tab = ""

        if (this.virtuals.length === 1 && this.virtuals[0][0] === "\"") {
            return this.virtuals.join(", ")
        } else {
            var body = this.virtuals.join("," + tab)
            return "[" + tab + body + tab.slice(0, -1) + "]"
        }
    }
}

const converter = {
    controller: function() {
        this.source = m.prop("")
        this.output = m.prop("")

        this.convert = function() {
            var source = createVirtual(createFragment(this.source()))
            return this.output(new TemplateBuilder(source, 1).complete())
        }.bind(this)
    },
    view: function(ctrl) {
        return m("div", [
            m.component(textfield, {
                class: 'source',
                autofocus: true,
                label: 'Paste source HTML',
                getState: (state) => {
                    const needsConvert = !!(ctrl.source() || state.value);
                    ctrl.source(state.value);
                    if (needsConvert) {
                        ctrl.convert();
                    }
                },
                multiline: true,
                rows: 8,
                value: ctrl.source()
            }),
            m.component(textfield, {
                class: 'result',
                multiline: true,
                readonly: true,
                label: 'Copy result from here',
                rows: 8,
                value: () => (ctrl.output())
            })
        ])
    }
};

export default converter;
