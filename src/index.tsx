import { h, render } from "preact";
import "preact/hooks";
import App from "./App";
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import ServiceWorkerClient from "./ServiceWorkerClient";
import MessageType from "./common/MessageType.enum";
import ServiceWorkerClientContext from "./ServiceWorkerClient/ServiceWorkerClientContext";

if ("serviceWorker" in navigator) {
  const registration = runtime.register();
}

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

render(
  // @ts-ignore
  <ServiceWorkerClientContext.Provider value={new ServiceWorkerClient()}>
    <App />
  </ServiceWorkerClientContext.Provider>,
  appRoot
);
