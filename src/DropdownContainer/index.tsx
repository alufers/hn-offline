import "./style.less";
import { ComponentChildren } from "preact";

export default ({ children }: { children?: ComponentChildren }) => {
  return (
    <div styleName="wrapper">
      <div styleName="dropdown">
        <div styleName="content">{children}</div>
      </div>
    </div>
  );
};
