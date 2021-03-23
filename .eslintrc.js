const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: "eslint:recommended",
  plugins: ["prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    indent: ERROR,
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": WARN,
    "prettier/prettier": ERROR,
    "arrow-parens": [ERROR, "as-needed"],
  },
};
