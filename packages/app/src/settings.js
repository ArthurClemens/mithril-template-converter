import m from "mithril";
import { Dialog, ToolbarTitle, List, SVG } from "polythene-mithril";
import { radioButtonCheckedSVG, radioButtonUncheckedSVG } from "./svg";
import { DialogFooter } from "./components/DialogFooter";

const CloseSVG = m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/></svg>");

export default ({ indent, setIndent, quotes, setQuotes }) => {
  
  const tileOptions = ({ title, value, test, update }) => {
    const events = {
      onclick: () => update(value)
    };
    return ({
      title,
      events,
      secondary: {
        icon: {
          svg: { content: m.trust(test(value) ? radioButtonCheckedSVG : radioButtonUncheckedSVG) }
        },
        events
      }
    });
  };

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
          content: m(SVG, { content: CloseSVG })
        })
      ]
    })
  };
};
