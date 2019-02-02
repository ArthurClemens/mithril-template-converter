import { getStoredValue, setStoredValue } from "../storage";

export const attrsAsObjectOptions = [
  {
    label: "Attributes",
    id: 1
  },
  {
    label: "Selectors",
    id: 0
  },
];
const ATTRS_AS_OBJECT_STORAGE_KEY = "mithril-template-converter__attrs-object";
const DEFAULT_ATTRS_AS_OBJECT = 1;

const initialAttrsAsObject = parseInt(getStoredValue({
  key: ATTRS_AS_OBJECT_STORAGE_KEY,
  defaultValue: DEFAULT_ATTRS_AS_OBJECT
}), 10);

export const attrsAsObject = {
  initialState: {
    attrsAsObject: initialAttrsAsObject
  },
  actions: update => {
    return {
      setAttrsAsObject: value => {
        setStoredValue({
          key: ATTRS_AS_OBJECT_STORAGE_KEY,
          value
        });
        update({
          attrsAsObject: value
        });
      },
    };
  }
};
