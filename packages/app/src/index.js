import m from "mithril";
import stream from "mithril/stream";
window.m = m; // for eval

import { TextField } from "polythene-mithril";
import { templateBuilder } from "mithril-template-builder";
import examples from "./examples";
import { storageAvailable } from "./utils";

import "polythene-css/dist/polythene.css";               // Component CSS
import "polythene-css/dist/polythene-layout-styles.css"; // Help classes
import "polythene-css/dist/polythene-typography.css";    // Default Material Design styles including Roboto font
import "./index.css"; 

const INDENT_STORAGE_KEY = "mithril-template-converter__indent-index";

const indentOptions = [
  {
    label: "2",
    id: "2"
  },
  {
    label: "4",
    id: "4",
  },
  {
    label: "Tab",
    id: "tab"
  }
];
const DEFAULT_INDENT_ID = "2";

const App = () => {

  const convert = () => {
    const built = templateBuilder({
      source: $source(),
      indent: $indentId()
    });
    $output(built);
  };

  const $source = stream("");
  const $output = stream("");

  const defaultIndentId = storageAvailable("localStorage")
    ? localStorage.getItem(INDENT_STORAGE_KEY)
    : DEFAULT_INDENT_ID;
  const $indentId = stream(defaultIndentId);
  $indentId.map(id => {
    if (storageAvailable("localStorage")) {
      localStorage.setItem(INDENT_STORAGE_KEY, id);
    }
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
      const indentId = $indentId();
      let rendered;
      try {
        rendered = eval(output);
      }
      catch (e) {
        rendered = "Could not render Mithril code - please check the output for any errors.";
      }
      return m(".form.layout.justified.horizontal", [
        m(".block.source", [
          m(".options",
            m("a", {
              href: "#",
              onclick: e => (
                e.preventDefault(),
                showExample()
              )
            }, "Insert random example")
          ),
          m(TextField, {
            className: "editor",
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
        m(".block.result", [
          m(".options",
            m(".indents", indentOptions.map(o =>
              m("a", {
                href: "#",
                className: indentId === o.id ? "selected" : null,
                onclick: e => (
                  e.preventDefault(),
                  $indentId(o.id)
                )
              }, o.label),
            ))
          ),
          m(TextField, {
            className: "editor",
            label: "Mithril template",
            multiLine: true,
            fullWidth: true,
            value: $output(),
            onChange: ({ value }) => $output(value)
          }),
        ]),
        m(".block.rendered", [
          m(".options",
            m("a",
              {
                href: "https://github.com/ArthurClemens/mithril-template-converter",
                target: "_blank"
              },
              "Github"
            ),
          ),
          m(".editor",
            rendered
              ? m(".viewer", rendered)
              : m(TextField, {
                className: "editor",
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
