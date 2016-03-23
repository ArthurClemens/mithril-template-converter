import m from "mithril"
window.m = m // for eval
import textfield from "polythene/textfield/textfield"
import templateBuilder from "app/converter/template-builder"

const converter = {
    controller: function() {
        this.source = m.prop("")
        this.output = m.prop("")

        this.convert = function() {
            return this.output(templateBuilder(this.source()))
        }.bind(this)
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
            m("h2", "Paste source HTML"),
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
                value: ctrl.source()
            }),
            m("h2", "Copy Mithril code from here"),
            m.component(textfield, {
                class: "result",
                multiline: true,
                rows: 8,
                value: () => (ctrl.output())
            }),
            m("h2", "Rendered Mithril code"),
            m("div", {
                class: "render",
            }, rendered ? rendered : null)
        ]);
    }
};

export default converter;
