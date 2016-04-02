import m from "mithril"
window.m = m // for eval
import textfield from "polythene/textfield/textfield"
import templateBuilder from "app/converter/template-builder"
import indentSelector from "app/converter/indent-selector"
import examples from "app/converter/examples"
import "polythene/layout/theme/theme"

const converter = {
    controller: () => {
        const source = m.prop("")
        const output = m.prop("")
        const indentId = m.prop()
        let exampleIndex = 0;

        const convert = () => {
            const built = templateBuilder({
                source: source(),
                indent: indentId()
            })
            output(built)
        }

        const showExample = () => {
            const index = exampleIndex++ % examples.length
            source(examples[index])
            convert()
        }

        return {
            convert,
            source,
            output,
            indentId: (index) => {
                indentId(index)
                convert()
            },
            showExample
        }
    },
    view: function(ctrl) {
        const output = ctrl.output()
        let rendered;
        try {
            rendered = eval(output)
        }
        catch (e) {
            rendered = "Could not render Mithril code - please check the output for any errors."
        }
        return m("div", [
            m(".group", [
                m("div.layout.justified.horizontal", [
                    m("h2", "Paste source HTML"),
                    m("a", {
                        href: "#",
                        onclick: (e) => (e.preventDefault(), ctrl.showExample())
                    }, "Insert random example")
                ]),
                m.component(textfield, {
                    class: "source",
                    autofocus: true,
                    getState: (state) => {
                        const needsConvert = !!(ctrl.source() || state.value);
                        ctrl.source(state.value);
                        if (state.value === "") {
                            ctrl.output("");
                        } else if (needsConvert) {
                            ctrl.convert();
                        }
                    },
                    multiline: true,
                    rows: 8,
                    value: () => (ctrl.source())
                })
            ]),
            m(".group", [
                m("h2", "Copy Mithril code from here"),
                m.component(textfield, {
                    class: "result",
                    multiline: true,
                    rows: 8,
                    value: () => (ctrl.output())
                }),
                m.component(indentSelector, {
                    indentId: ctrl.indentId
                })
            ]),
            m(".group", [
                m("h2", "Rendered Mithril code"),
                m("div", {
                    class: "render",
                }, rendered ? rendered : null)
            ])
        ]);
    }
};

export default converter;
