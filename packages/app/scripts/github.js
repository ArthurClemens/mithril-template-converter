const shell = require("shelljs");

shell.rm("-rf", "../../../gh-pages/*");
shell.cp("-R", "dist/*", "../../../gh-pages/");