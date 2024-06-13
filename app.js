const {
  writeFileSync,
  appendFileSync,
  createReadStream,
  readFileSync,
} = require("fs");
const { resolve } = require("path");
const readline = require("readline");

const PATHS = {
  distMeta: resolve(__dirname, "dist", "index.meta.js"),
  distUser: resolve(__dirname, "dist", "index.user.js"),
  indexUser: resolve(__dirname, "src", "index.user.js"),
};

const copySrcMeta = () => {
  let closed = false;

  writeFileSync(PATHS.distMeta, "");

  const inputStream = createReadStream(PATHS.indexUser);
  const rl = readline.createInterface({
    input: inputStream,
    terminal: false,
  });

  const handleOnLine = (line) => {
    if (closed) return;

    appendFileSync(PATHS.distMeta, line + "\n");

    if (line.includes("==/UserScript==") && !closed) {
      rl.close();
      closed = true;
    }
  };

  rl.on("line", handleOnLine);
};

const copyToDist = () => {
  const userText = readFileSync(PATHS.indexUser, "utf8");

  writeFileSync(PATHS.distUser, userText);
};

const init = () => {
  copySrcMeta();
  copyToDist();
};

init();
