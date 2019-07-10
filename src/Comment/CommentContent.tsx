import timeAgoFromTimestamp from "../util/timeAgoFromTimestamp";
import { useMemo } from "preact/hooks";
import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import { Attributes } from "preact";
import "./style.less";

export default function CommentContent({
  item,
  toggleCollapse,
  collapsed,
  setHighlightHint,
  ...props
}: {
  item: ItemWithPopulatedChildren;
  toggleCollapse: () => void;
  collapsed: boolean;
  setHighlightHint: (c: boolean) => void;
  [x: string]: any;
} & Attributes) {
  const htmlData = useMemo(() => ({ __html: item.text }), [item.text]); // memoize the html to aid rendering
  return (
    <div {...props}>
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
      {!collapsed && <p styleName="text" dangerouslySetInnerHTML={htmlData} />}
    </div>
  );
}
