import m from "mithril";
import { Dialog, ToolbarTitle, List } from "polythene-mithril";
import { radioButtonCheckedSVG, radioButtonUncheckedSVG } from "./svg";
import { DialogFooter } from "./components/DialogFooter";

export default ({ indent, setIndent }) => {

  const tileOptions = ({ title, value, update }) => ({
    title,
    key: value,
    secondary: indent === value
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
            update: setIndent,
          }),
          tileOptions({
            title: "4 spaces",
            value: "4",
            update: setIndent,
          }),
          tileOptions({
            title: "Tabs",
            value: "tab",
            update: setIndent,
          })
        ]
      }),
      // m(List, {
      //   compact: true,
      //   header: { title: "Quotes" },
      //   all: {
      //     hoverable: true,
      //   },
      //   tiles: [
      //     {
      //       title: "Single quotes",
      //       secondary: {
      //         icon: {
      //           svg: { content: m.trust(radioButtonUncheckedSVG) }
      //         },
      //       }
      //     },
      //     {
      //       title: "Double quotes",
      //       secondary: {
      //         icon: {
      //           svg: { content: m.trust(radioButtonUncheckedSVG) }
      //         },
      //       }
      //     },
      //   ]
      // }),
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
