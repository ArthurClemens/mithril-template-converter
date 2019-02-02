
const testStorage = type => {
  try {
    var storage = window[type],
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

const hasStorage = testStorage("localStorage");

export const getStoredValue = ({ key, defaultValue }) => {
  if (!hasStorage) {
    return defaultValue;
  }
  const storeValue = localStorage.getItem(key);
  return storeValue === null
    ? defaultValue
    : storeValue;
};

export const setStoredValue = ({ key, value }) => {
  if (!hasStorage) {
    return;
  }
  const storeValue = value.toString();
  localStorage.setItem(key, storeValue);
};
