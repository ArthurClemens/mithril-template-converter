import m from "mithril";

import { Button } from "polythene-mithril";
import { ButtonCSS } from "polythene-css";

export const SmallButton = {
  view: vnode =>
    m(Button, {
      ...vnode.attrs,
      className: "small-button",
    })
};

ButtonCSS.addStyle(".small-button", {
  contained: true,
  border: true,
  font_size: 13,
  padding_h: 9,
  padding_h_border: 9,
  label_padding_v: 8,
  color_light_text: "#333",
  color_dark_text: "#fff",
});
