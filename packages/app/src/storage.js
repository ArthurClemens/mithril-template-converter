import { storageAvailable } from "./utils";

export const getStoredValue = ({ key, defaultValue }) => {
  if (!storageAvailable("localStorage")) {
    return defaultValue;
  }
  const storeValue = localStorage.getItem(key);
  return storeValue === null
    ? defaultValue
    : storeValue;
};

export const setStoredValue = ({ key, value }) => {
  if (!storageAvailable("localStorage")) {
    return;
  }
  const storeValue = value.toString();
  localStorage.setItem(key, storeValue);
};
