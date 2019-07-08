import { h } from "preact";
import "./style.less";
import DropdownContainer from "../DropdownContainer";
import SyncDropdownContent from "./SyncDropdownContent";

h;
export default () => (
  <div styleName="navbar">
    <div styleName="brand">HN offline</div>
    <div styleName="spacer" />
    <div styleName="iconElem withIndicator reloadIcon">
      <DropdownContainer>
        <SyncDropdownContent />
      </DropdownContainer>
    </div>
  </div>
);
