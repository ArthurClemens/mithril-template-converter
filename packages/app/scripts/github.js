/* global process */
const shell = require("shelljs");

shell.cp("-R", "dist/*", "../../../gh-pages/");