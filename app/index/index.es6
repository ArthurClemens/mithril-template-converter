import m from "mithril";
import converter from "app/converter/converter";
import "polythene/theme/theme";

const app = {};
app.view = function() {
    return m(".converter", [
        m("h1", "Mithril HTML to JavaScript converter"),
        m.component(converter),
        m("div", {
            class: "footer"
        }, [
            m("a", {
                href: "https://github.com/ArthurClemens/mithril-template-converter"
            }, "Code on Github"),
            m("span", ". "),
            m("span", "Built for "),
            m("a", {
                href: "https://github.com/lhorie/mithril.js"
            }, "Mithril"),
            m("span", " with "),
            m("a", {
                href: "https://github.com/ArthurClemens/Polythene"
            }, "Polythene"),
            m("span", ".")
        ])
    ])
}

m.mount(document.body, app)
