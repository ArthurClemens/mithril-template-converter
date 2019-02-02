import { getStoredValue, setStoredValue } from "../storage";
import { quotesOptions } from "mithril-template-builder";

const storageKey = "mithril-template-converter__quotes";

const initialQuotes = getStoredValue({
  key: storageKey,
  defaultValue: Object.keys(quotesOptions)[0]
});

export const quotes = {
  initialState: {
    quotes: initialQuotes
  },
  actions: update => {
    return {
      setQuotes: value => {
        setStoredValue({
          key: storageKey,
          value
        });
        update({
          quotes: value
        });
      },
    };
  }
};
