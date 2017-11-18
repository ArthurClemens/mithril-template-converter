import m from "mithril";
import Stream from "mithril/stream";
window.m = m; // for eval
import { TextField } from "polythene-mithril";
import templateBuilder from "mithril-template-builder";
import Settings from "./settings";
import examples from "./examples";

const Form = {
  oninit: vnode => {
    const source = Stream("");
    const output = Stream("");
    const indentId = Stream();
    let exampleIndex = 0;

    const convert = () => {
      const built = templateBuilder({
        source: source(),
        indent: indentId()
      });
      output(built);
    };

    const showExample = () => {
      const index = exampleIndex++ % examples.length;
      source(examples[index]);
      convert();
    };

    vnode.state = {
      convert,
      source,
      output,
      indentId: index => {
        indentId(index);
        convert();
      },
      showExample
    };
  },
  view: vnode => {
    const output = vnode.state.output();
    let rendered;
    try {
      rendered = eval(output);
    }
    catch (e) {
      rendered = "Could not render Mithril code - please check the output for any errors.";
    }
    return m("div", [
      m(".group", [
        m("div.layout.justified.horizontal", [
          m("h2", "Paste source HTML"),
          m("a", {
            href: "#",
            onclick: (e) => (e.preventDefault(), vnode.state.showExample())
          }, "Insert random example")
        ]),
        m(TextField, {
          className: "source",
          autofocus: true,
          onChange: ({ value }) => {
            const needsConvert = !!(vnode.state.source() || value);
            vnode.state.source(value);
            if (value === "") {
              vnode.state.output("");
            } else if (needsConvert) {
              vnode.state.convert();
            }
          },
          multiLine: true,
          rows: 8,
          value: vnode.state.source()
        })
      ]),
      m(".group", [
        m("h2", "Mithril template"),
        m(TextField, {
          className: "result",
          multiLine: true,
          rows: 8,
          value: vnode.state.output(),
          onChange: ({ value }) => vnode.state.output(value)
        }),
        m(Settings,
          { indentId: vnode.state.indentId }
        )
      ]),
      m(".group", [
        m("h2", "Rendered Mithril template"),
        m("div",
          { class: "render" },
          rendered ? rendered : null
        )
      ])
    ]);
  }
};

export default Form;
