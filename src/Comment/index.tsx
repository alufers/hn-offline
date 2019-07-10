import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import { Attributes } from "preact";
import { useMemo, useState } from "preact/hooks";
import "./style.less";
import Score from "../Score";
import timeAgoFromTimestamp from "../util/timeAgoFromTimestamp";

export default function Comment({
  item
}: { item: ItemWithPopulatedChildren } & Attributes) {
  const htmlData = useMemo(() => ({ __html: item.text }), [item.text]); // memoize the html to aid rendering
  const [highlightHint, setHighlightHint] = useState(false);

  return (
    <div styleName="comment">
      {highlightHint ? (
        <div styleName="collapse-line highlight-hint" />
      ) : (
        <div styleName="collapse-line" />
      )}
      <div styleName="inside">
        <div styleName="meta">
          <span styleName="meta-item username">{item.by}</span>
          <span styleName="meta-item time">
            {timeAgoFromTimestamp(item.time)}
          </span>
          <span
            onMouseOver={() => setHighlightHint(true)}
            onMouseOut={() => setHighlightHint(false)}
            styleName="meta-item collapse-button"
            title="Collapse"
          />
        </div>
        <p dangerouslySetInnerHTML={htmlData} />
        <div className="children">
          {item.populatedChildren &&
            item.populatedChildren.map(child => (
              <Comment key={child.id} item={child} />
            ))}
        </div>
      </div>
    </div>
  );
}
