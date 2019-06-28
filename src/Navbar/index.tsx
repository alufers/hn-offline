import { h } from "preact";
import style from "./style.less";
h;

export default () => (
  <div class={style.navbar}>
    <div class={style.brand}>HN offline</div>
    <div class={style.spacer} />
    <div class={style.iconElem + " " + style.withIndicator}>
      <img src={require("../resources/reload_black.svg")} />
    </div>
  </div>
);
