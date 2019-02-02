import m from "mithril";

import templateBuilder from "mithril-template-builder";
import { ButtonGroup, TextField, Dialog, IconButton } from "polythene-mithril";
import { settingsSVG } from "./svg";
import { SmallButton } from "./components/SmallButton";
import { states, actions } from "./state";
import settings from "./settings";
import { attrsAsObjectOptions } from "./state/attrsAsObject";

import "polythene-css/dist/polythene.css";               // Component CSS
import "polythene-css/dist/polythene-layout-styles.css"; // Help classes
import "polythene-css/dist/polythene-typography.css";    // Default Material Design styles including Roboto font
import "./index.css";

window.m = m; // for eval

const App = ({ state, actions }) => {
  
  const update = () => {
    const template = templateBuilder({
      source: state.source,
      indent: state.indent,
      attrsAsObject: state.attrsAsObject
    });
    actions.setOutput(template);
  };

  const setAttrsAsObject = value => {
    actions.setAttrsAsObject(value);
    update();
  };

  const setIndent = value => {
    actions.setIndent(value);
    update();
  };

  const showExample = () => {
    actions.nextExample();
    actions.setSource(state.example.code);
    update();
  };

  return {
    view: () => {
      let rendered;
      try {
        rendered = eval(state.output);
      }
      catch (e) {
        rendered = "Could not render Mithril code - please check the output for any errors.";
      }
      return [
        m(".mtc-form.layout.justified.horizontal", [
          m(".mtc-block.mtc-source", [
            m(".mtc-options",
              m(".mtc-options-inner.pe-dark-tone",
                m(SmallButton, {
                  label: "Insert random example",
                  events: {
                    onclick: e => (
                      e.preventDefault(),
                      showExample()
                    )
                  }
                })
              )
            ),
            m(TextField, {
              className: "mtc-editor",
              label: "Paste source HTML",
              tone: "dark",
              fullWidth: true,
              autofocus: true,
              onChange: ({ value }) => {
                const needsConvert = !!(state.source || value);
                actions.setSource(value);
                if (value === "") {
                  actions.setOutput("");
                } else if (needsConvert) {
                  update();
                }
              },
              multiLine: true,
              value: state.source
            }),
          ]),
          m(".mtc-block.mtc-result", [
            m(".mtc-options",
              m(".mtc-options-inner", 
                m(ButtonGroup, attrsAsObjectOptions.map(o =>
                  m(SmallButton, {
                    ink: false,
                    label: o.label,
                    selected: state.attrsAsObject === o.id,
                    events: {
                      onclick: e => (
                        e.preventDefault(),
                        setAttrsAsObject(o.id)
                      )
                    }
                  })
                )),
                m(IconButton, {
                  className: "mtc-settings",
                  icon: { svg: { content: m.trust(settingsSVG) } },
                  events: {
                    onclick: () => Dialog.show(() => settings({ indent: state.indent, setIndent }))
                  }
                })
              )
            ),
            m(TextField, {
              className: "mtc-editor",
              label: "Mithril template",
              multiLine: true,
              fullWidth: true,
              value: state.output,
              onChange: ({ value }) => actions.setOutput(value)
            }),
          ]),
          m(".mtc-block.mtc-rendered", [
            m(".mtc-options",
              m(".mtc-options-inner", 
                m(SmallButton, {
                  url: {
                    href: "https://github.com/ArthurClemens/mithril-template-converter",
                    target: "_blank"
                  },
                  label: "Github"
                }),
              ),
            ),
            m(".mtc-editor",
              rendered
                ? m(".mtc-viewer", { key: state.attrsAsObject + rendered.toString().replace(/[\s\W]/g, "").substr(0,100)}, rendered)
                : m(TextField, {
                  className: "mtc-editor",
                  label: "Rendered HTML",
                  multiLine: true,
                  fullWidth: true,
                  readonly: true
                })
            )
          ]),
        ]),
        m(Dialog)
      ];
    }
  };
};

m.mount(document.body, App({ state: states(), actions }));
