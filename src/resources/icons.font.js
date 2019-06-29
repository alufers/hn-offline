const path = require("path");

module.exports = {
  files: ["./*.svg"],
  fontName: "myfonticons",
  classPrefix: "myfonticon-",
  baseSelector: ".myfonticon",
  types: ["eot", "woff", "woff2", "ttf", "svg"],
  order: ["woff2", "woff", "eot", "ttf", "svg"],
  fileName: "app.[fontname].[hash].[ext]",
  emitCodepoints: path.join(__dirname, "src/resources/codepoints.js")
};
