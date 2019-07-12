import { ComponentChildren } from "preact";
import "./style.less";

export default function Button({
  children,
  loading,
  ...props
}: {
  children?: ComponentChildren;
  loading?: boolean;
  [x: string]: any;
}) {
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
}
