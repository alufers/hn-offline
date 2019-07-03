import { h, render } from "preact";
import App from "./App";
import runtime from "serviceworker-webpack-plugin/lib/runtime";

if ("serviceWorker" in navigator) {
  const registration = runtime.register();
}

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

render(<App />, appRoot);
