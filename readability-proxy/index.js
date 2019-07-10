const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;
const Readability = require("./Readability");
const url = require("url");
const { send } = require("micro");

module.exports = async (req, res) => {
  const urlToFetch = url.parse(req.url, true).query.url;
  if (typeof urlToFetch !== "string") {
    send(res, 400, { error: "Bad URL type (not a string)" });
    return;
  }
  const resp = await fetch(urlToFetch);
  const test = await resp.text();
  const dom = new JSDOM(test);
  const article = new Readability(dom.window.document).parse();
  return article;
};
