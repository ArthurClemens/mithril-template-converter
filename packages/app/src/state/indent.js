import { getStoredValue, setStoredValue } from "../storage";

const INDENT_STORAGE_KEY = "mithril-template-converter__indent";
const DEFAULT_INDENT = "2";

const initialIndent = getStoredValue({
  key: INDENT_STORAGE_KEY,
  defaultValue: DEFAULT_INDENT
});

export const indent = {
  initialState: {
    indent: initialIndent
  },
  actions: update => {
    return {
      setIndent: value => {
        setStoredValue({
          key: INDENT_STORAGE_KEY,
          value
        });
        update({
          indent: value
        });
      },
    };
  }
};
