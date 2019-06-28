import { h, render } from "preact";
import App from "./App";

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

render(<App />, appRoot);
