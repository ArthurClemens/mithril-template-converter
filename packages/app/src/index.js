import m from "mithril";
import Form from "./form";

import "polythene-css/dist/polythene.css";               // Component CSS
import "polythene-css/dist/polythene-layout-styles.css"; // Help classes
import "polythene-css/dist/polythene-typography.css";    // Default Material Design styles including Roboto font
import "./index.css"; 

const App = {
  view: () =>
    m(".converter", [
      m("h1", "Mithril HTML to JavaScript converter"),
      m(Form),
      m("div",
        { class: "footer" },
        [
          m("a",
            { href: "https://github.com/ArthurClemens/mithril-template-converter" },
            "Code on Github"
          ),
          m("span", ". "),
          m("span", "Built for "),
          m("a",
            { href: "https://mithril.js.org" },
            "Mithril"
          ),
          m("span", " with "),
          m("a",
            { href: "https://github.com/ArthurClemens/Polythene" },
            "Polythene"
          ),
          m("span", ".")
        ]
      )
    ])
};

m.mount(document.body, App);
