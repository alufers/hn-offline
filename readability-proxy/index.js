const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;
const url = require("url");
const { send } = require("micro");
const cors = require("micro-cors")();
const Readability = require("./Readability");

const handler = async (req, res) => {
  if (req.method === "OPTIONS") {
    return send(res, 200, "ok!");
  }
  const urlToFetch = url.parse(req.url, true).query.url;
  if (typeof urlToFetch !== "string") {
    send(res, 400, { error: "Bad URL type (not a string)" });
    return;
  }
  let resp;
  try {
    resp = await fetch(urlToFetch);
  } catch (e) {
    send(res, 502, { error: "Failed to request the article." });
    console.error(e);
  }
  const text = await resp.text();
  const dom = new JSDOM(text);
  dom.window.document.querySelectorAll("img").forEach(node => {
    const resolved = url.resolve(urlToFetch, node.src.toString());
    node.src = resolved; // make image urls absolute
    //TODO: Resolving of srcsets
    node.removeAttribute("srcset"); // disable srcsets
  });
  dom.window.document.querySelectorAll("a").forEach(node => {
    if (node.href.startsWith("javascript:")) {
      node.removeAttribute("href");
      return;
    }
    const resolved = url.resolve(urlToFetch, node.href.toString());
    node.href = resolved; // make link urls absolute
  });
  dom.window.document.querySelectorAll("script").forEach(node => node.remove);
  const article = new Readability(dom.window.document).parse();
  res.setHeader("Cache-Control", "s-maxage=31536000, max-age=0");
  return {
    title: article.title,
    byline: article.byline,
    content: article.content,
    excerpt: article.excerpt,
    length: article.length,
    scrapedOn: new Date(),
    originalURL: urlToFetch
  };
};

if (process.env.NODE_ENV === "development") {
  module.exports = cors(handler);
} else {
  module.exports = handler;
}
