import { Attributes, ComponentChildren } from "preact";
import "./style.less";

/**
 * The score indicator with a nice arrow.
 */
export default function Score({
  children
}: { children?: ComponentChildren } & Attributes) {
  return <div styleName="score">{children}</div>;
}
