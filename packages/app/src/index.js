import m from "mithril";
import stream from "mithril/stream";
window.m = m; // for eval

import { ButtonGroup, TextField } from "polythene-mithril";
import templateBuilder from "mithril-template-builder";
import examples from "./examples";
import { getStoredValue, setStoredValue } from "./storage";
import { SmallButton } from "./SmallButton";

import "polythene-css/dist/polythene.css";               // Component CSS
import "polythene-css/dist/polythene-layout-styles.css"; // Help classes
import "polythene-css/dist/polythene-typography.css";    // Default Material Design styles including Roboto font
import "./index.css"; 

const ATTRS_AS_OBJECT_STORAGE_KEY = "mithril-template-converter__attrs-object";

const attrsAsObjectOptions = [
  {
    label: "Attributes",
    id: "1"
  },
  {
    label: "Selectors",
    id: "0"
  },
];
const DEFAULT_ATTRS_AS_OBJECT = "1";

const App = () => {

  const $source = stream("");
  const $output = stream("");

  const $attrsAsObject = stream(getStoredValue({
    key: ATTRS_AS_OBJECT_STORAGE_KEY,
    defaultValue: DEFAULT_ATTRS_AS_OBJECT
  }));

  const convert = () => {
    const built = templateBuilder({
      source: $source(),
      indent: "2",
      attrsAsObject: parseInt($attrsAsObject(), 10)
    });
    $output(built);
  };

  $attrsAsObject.map(value => {
    setStoredValue({
      key: ATTRS_AS_OBJECT_STORAGE_KEY,
      value
    });
    convert();
  });

  let exampleIndex = 0;
  const showExample = () => {
    const index = exampleIndex++ % examples.length;
    $source(examples[index]);
    convert();
  };

  return {
    view: () => {
      const output = $output();
      const attrsAsObject = $attrsAsObject().toString();
      let rendered;
      try {
        rendered = eval(output);
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
              const needsConvert = !!($source() || value);
              $source(value);
              if (value === "") {
                $output("");
              } else if (needsConvert) {
                convert();
              }
            },
            multiLine: true,
            value: $source()
          }),
        ]),
        m(".mtc-block.mtc-result", [
          m(".mtc-options",
            m(".mtc-options-inner", 
              m(ButtonGroup, attrsAsObjectOptions.map(o =>
                m(SmallButton, {
                  ink: false,
                  label: o.label,
                  selected: attrsAsObject === o.id,
                  events: {
                    onclick: e => (
                      e.preventDefault(),
                      $attrsAsObject(o.id)
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
            value: $output(),
            onChange: ({ value }) => $output(value)
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
              ? m(".mtc-viewer", { key: attrsAsObject + rendered.toString().replace(/[\s\W]/g, "").substr(0,100)}, rendered)
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

m.mount(document.body, App);
