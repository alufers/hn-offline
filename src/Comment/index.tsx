import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import { Attributes } from "preact";
import { useMemo } from "preact/hooks";
import "./style.less";

export default function Comment({
  item
}: { item: ItemWithPopulatedChildren } & Attributes) {
  const htmlData = useMemo(() => ({ __html: item.text }), [item.text]); // memoize the html to aid rendering
  return (
    <div styleName="comment">
      <strong>{item.by}</strong>
      <p dangerouslySetInnerHTML={htmlData}>{item.text}</p>
      {item.populatedChildren &&
        item.populatedChildren.map(child => (
          <Comment key={child.id} item={child} />
        ))}
    </div>
  );
}
