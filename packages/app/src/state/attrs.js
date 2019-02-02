import { getStoredValue, setStoredValue } from "../storage";
import { attrsOptions } from "mithril-template-builder";

const storageKey = "mithril-template-converter__attrs";

const initialAttrs = getStoredValue({
  key: storageKey,
  defaultValue: attrsOptions["attributes"].value
});

export const attrs = {
  initialState: {
    attrs: initialAttrs
  },
  actions: update => {
    return {
      setAttrs: value => {
        setStoredValue({
          key: storageKey,
          value
        });
        update({
          attrs: value
        });
      },
    };
  }
};
