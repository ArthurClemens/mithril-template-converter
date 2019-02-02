import m from "mithril";

import { Button } from "polythene-mithril";
import { ButtonCSS } from "polythene-css";

export const SmallButton = {
  view: vnode =>
    m(Button, {
      ...vnode.attrs,
      className: "mtc-small-button",
    })
};

ButtonCSS.addStyle(".mtc-small-button", {
  contained: true,
  border: true,
  font_size: 13,
  padding_h: 8,
  padding_h_border: 8,
  label_padding_v: 8,
  color_light_text: "#333",
  color_dark_text: "#fff",
});
