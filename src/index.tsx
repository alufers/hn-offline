import { render } from "preact";
import "preact/hooks";
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import App from "./App";
import { Router, RouterContext } from "./router";
import ServiceWorkerClient from "./ServiceWorkerClient";
import _ServiceWorkerClientContext from "./ServiceWorkerClient/ServiceWorkerClientContext";

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
