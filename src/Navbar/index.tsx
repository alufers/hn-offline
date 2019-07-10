import { h } from "preact";
import "./style.less";
import DropdownContainer from "../DropdownContainer";
import SyncDropdownContent from "./SyncDropdownContent";
import { Link } from "../router";
h;
export default () => {
  return (
    <div styleName="navbar">
      <div styleName="brand">
        <Link to="/">HN offline</Link>
      </div>
      <div styleName="spacer" />

      <DropdownContainer
        trigger={({ children, ...props }) => (
          <div styleName="iconElem withIndicator reloadIcon" {...props}>
            {children}
          </div>
        )}
      >
        <SyncDropdownContent />
      </DropdownContainer>
    </div>
  );
};
