import { getStoredValue, setStoredValue } from "../storage";
import { indentOptions } from "mithril-template-builder";

const storageKey = "mithril-template-converter__indent";

const initialIndent = getStoredValue({
  key: storageKey,
  defaultValue: Object.keys(indentOptions)[0]
});

export const indent = {
  initialState: {
    indent: initialIndent
  },
  actions: update => {
    return {
      setIndent: value => {
        setStoredValue({
          key: storageKey,
          value
        });
        update({
          indent: value
        });
      },
    };
  }
};
