import { Attributes } from "preact";
import { useMemo, useState } from "preact/hooks";
import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import CommentContent from "./CommentContent";
import DoubleTapHandler from "../DoubleTapHandler";

import "./style.less";

export default function Comment({
  item
}: { item: ItemWithPopulatedChildren } & Attributes) {
  const [highlightHint, setHighlightHint] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const renderedChildren = useMemo(
    () =>
      item.populatedChildren &&
      item.populatedChildren.map(child => (
        <Comment key={child.id} item={child} />
      )),
    [item.populatedChildren]
  );
  const toggleCollapse = () => setCollapsed(!collapsed);
  return (
    <div styleName="comment">
      {highlightHint ? (
        <div styleName="collapse-line highlight-hint" />
      ) : (
        <div styleName="collapse-line" onClick={toggleCollapse} />
      )}
      <div styleName="inside">
        <DoubleTapHandler
          component={CommentContent as any}
          collapsed={collapsed}
          item={item}
          setHighlightHint={setHighlightHint}
          toggleCollapse={toggleCollapse}
          onDoubleTap={ev => {
            ev.preventDefault();
            setCollapsed(true);
          }}
        />

        {collapsed ? (
          <div styleName="children collapsed">{renderedChildren}</div>
        ) : (
          <div styleName="children">{renderedChildren}</div>
        )}
      </div>
    </div>
  );
}
