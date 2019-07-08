import { ComponentChildren } from "preact";
import "./style.less";

export default ({
  children,
  loading,
  ...props
}: {
  children?: ComponentChildren;
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div styleName="button loading" {...props}>
        {children}
      </div>
    );
  } else {
    return (
      <div styleName="button" {...props}>
        {children}
      </div>
    );
  }
};
