import m from "mithril";

import { ButtonGroup, TextField } from "polythene-mithril";
import templateBuilder from "mithril-template-builder";
import examples from "./examples";
import { getStoredValue, setStoredValue } from "./storage";
import { SmallButton } from "./SmallButton";
import { states, actions } from "./state";

import "polythene-css/dist/polythene.css";               // Component CSS
import "polythene-css/dist/polythene-layout-styles.css"; // Help classes
import "polythene-css/dist/polythene-typography.css";    // Default Material Design styles including Roboto font
import "./index.css"; 

window.m = m; // for eval
const ATTRS_AS_OBJECT_STORAGE_KEY = "mithril-template-converter__attrs-object";

const attrsAsObjectOptions = [
  {
    label: "Attributes",
    id: 1
  },
  {
    label: "Selectors",
    id: 0
  },
];
const DEFAULT_ATTRS_AS_OBJECT = "1";

const App = ({ attrs: { state, actions } }) => {

  const storedRenderAttrsAsObject = parseInt(getStoredValue({
    key: ATTRS_AS_OBJECT_STORAGE_KEY,
    defaultValue: DEFAULT_ATTRS_AS_OBJECT
  }), 10);
  actions.setRenderAttrsAsObject(storedRenderAttrsAsObject);

  const convert = () => {
    const built = templateBuilder({
      source: state.source,
      indent: "2",
      attrsAsObject: state.renderAttrsAsObject
    });
    actions.setOutput(built);
  };

  const setRenderAttrsAsObject = value => {
    actions.setRenderAttrsAsObject(value);
    setStoredValue({
      key: ATTRS_AS_OBJECT_STORAGE_KEY,
      value
    });
    convert();
  };

  let exampleIndex = 0;
  const showExample = () => {
    const index = exampleIndex++ % examples.length;
    actions.setSource(examples[index]);
    convert();
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
      return m(".mtc-form.layout.justified.horizontal", [
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
                convert();
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
                  selected: state.renderAttrsAsObject === o.id,
                  events: {
                    onclick: e => (
                      e.preventDefault(),
                      setRenderAttrsAsObject(o.id)
                    )
                  }
                })
              )),
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
              ? m(".mtc-viewer", { key: state.renderAttrsAsObject + rendered.toString().replace(/[\s\W]/g, "").substr(0,100)}, rendered)
              : m(TextField, {
                className: "mtc-editor",
                label: "Rendered HTML",
                multiLine: true,
                fullWidth: true,
                readonly: true
              })
          )
        ])
      ]);
    }
  };
};

m.mount(document.body, {
  view: () => m(App, { state: states(), actions })
});
