import { h } from "preact";
import "./style.less";
h;
export default () => (
  <div styleName="navbar">
    <div styleName="brand">HN offline</div>
    <div styleName="spacer" />
    <div styleName="iconElem withIndicator reloadIcon">
      {/* <img src={require("../resources/reload_black.svg")} /> */}
    </div>
  </div>
);
