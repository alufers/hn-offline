import { Attributes } from "preact";
import { useMemo, useState } from "preact/hooks";
import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import timeAgoFromTimestamp from "../util/timeAgoFromTimestamp";
import "./style.less";

export default function Comment({
  item
}: { item: ItemWithPopulatedChildren } & Attributes) {
  const htmlData = useMemo(() => ({ __html: item.text }), [item.text]); // memoize the html to aid rendering
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
        <div styleName="meta">
          <span styleName="meta-item username">{item.by}</span>
          <span styleName="meta-item time">
            {timeAgoFromTimestamp(item.time)}
          </span>
          {collapsed ? (
            <span
              onMouseOver={() => setHighlightHint(true)}
              onMouseOut={() => setHighlightHint(false)}
              onClick={toggleCollapse}
              styleName="meta-item expand-button"
              title="Expand"
            />
          ) : (
            <span
              onMouseOver={() => setHighlightHint(true)}
              onMouseOut={() => setHighlightHint(false)}
              onClick={toggleCollapse}
              styleName="meta-item collapse-button"
              title="Collapse"
            />
          )}
        </div>
        {!collapsed && (
          <p styleName="text" dangerouslySetInnerHTML={htmlData} />
        )}
        {collapsed ? (
          <div styleName="children collapsed">{renderedChildren}</div>
        ) : (
          <div styleName="children">{renderedChildren}</div>
        )}
      </div>
    </div>
  );
}
