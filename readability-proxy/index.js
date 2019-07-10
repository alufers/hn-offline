const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;
const Readability = require("./Readability");

module.exports = async (req, res) => {
  const resp = await fetch("https://github.com/jsdom/jsdom");
  const test = await resp.text();
  const dom = new JSDOM(test);
  const article = new Readability(dom.window.document).parse();
  return article;
  //   //   return {
  //   //     content: article.content
  //   //   };
  //   res.end(article.content);
};
