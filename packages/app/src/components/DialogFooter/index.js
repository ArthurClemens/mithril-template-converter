import m from "mithril";

import { Toolbar } from "polythene-mithril";
import { ToolbarCSS } from "polythene-css";
import "./style.css";

export const DialogFooter = {
  view: vnode =>
    m(Toolbar, {
      ...vnode.attrs,
      tone: "dark",
      compact: true,
      className: "mtc-dialog-footer",
    })
};

ToolbarCSS.addStyle(".mtc-dialog-footer", {
  color_dark_background: "#2196f3",
});
