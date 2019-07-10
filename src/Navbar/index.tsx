import DropdownContainer from "../DropdownContainer";
import { Link } from "../router";
import "./style.less";
import SyncDropdownContent from "./SyncDropdownContent";

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
