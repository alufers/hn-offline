import { h, render } from "preact";
import "preact/hooks";
import App from "./App";
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import ServiceWorkerClient from "./ServiceWorkerClient";
import MessageType from "./common/MessageType.enum";
import _ServiceWorkerClientContext from "./ServiceWorkerClient/ServiceWorkerClientContext";
import { Router, RouterContext, Route } from "./router";

if (process.env.NODE_ENV === "development") {
  console.log("Runnning in development mode!");
}

const ServiceWorkerClientContext = _ServiceWorkerClientContext as any;

if ("serviceWorker" in navigator) {
  const registration = runtime.register();
}

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

const router = new Router();

render(
  // @ts-ignore
  <RouterContext.Provider value={router}>
    <ServiceWorkerClientContext.Provider value={new ServiceWorkerClient()}>
      <App />
    </ServiceWorkerClientContext.Provider>
  </RouterContext.Provider>,
  appRoot
);
