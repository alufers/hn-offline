import { h, render } from "preact";
import App from "./App";
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import ServiceWorkerClient from "./ServiceWorkerClient";
import MessageType from "./common/MessageType.enum";

if ("serviceWorker" in navigator) {
  const registration = runtime.register();
}

const cl = new ServiceWorkerClient()
cl.request(MessageType.GetItems, "XD").then(console.log)

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

render(<App />, appRoot);
