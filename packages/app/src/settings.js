import m from "mithril";
import { Dialog, ToolbarTitle, List } from "polythene-mithril";
import { radioButtonCheckedSVG, radioButtonUncheckedSVG } from "./svg";
import { DialogFooter } from "./components/DialogFooter";

export default ({ indent, setIndent, quotes, setQuotes }) => {
  
  const tileOptions = ({ title, value, test, update }) => ({
    title,
    key: value,
    secondary: test(value)
      ? {
        icon: {
          svg: { content: m.trust(radioButtonCheckedSVG) }
        },
      }
      : {
        icon: {
          svg: { content: m.trust(radioButtonUncheckedSVG) }
        },
      },
    events: {
      onclick: () => update(value)
    }
  });

  return {
    fullBleed: true,
    backdrop: true,
    borders: "always",
    body: [
      m(List, {
        compact: true,
        header: { title: "Indent" },
        all: {
          hoverable: true,
        },
        tiles: [
          tileOptions({
            title: "2 spaces",
            value: "2",
            test: value => indent === value,
            update: setIndent,
          }),
          tileOptions({
            title: "4 spaces",
            value: "4",
            test: value => indent === value,
            update: setIndent,
          }),
          tileOptions({
            title: "Tabs",
            value: "tab",
            test: value => indent === value,
            update: setIndent,
          })
        ]
      }),
      m(List, {
        compact: true,
        header: { title: "Quotes" },
        all: {
          hoverable: true,
        },
        tiles: [
          tileOptions({
            title: "Double",
            value: "double",
            test: value => quotes === value,
            update: setQuotes,
          }),
          tileOptions({
            title: "Single",
            value: "single",
            test: value => quotes === value,
            update: setQuotes,
          }),
        ]
      }),
    ], 
    footer: m(DialogFooter, {
      events: {
        onclick: Dialog.hide
      },
      content: [
        m(ToolbarTitle, {
          center: true,
          text: "Close"
        })
      ]
    })
  };
};
