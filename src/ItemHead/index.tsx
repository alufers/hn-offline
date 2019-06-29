import { h } from "preact";
import Item from "../types/Item";
import "./style.less";

export interface ItemHeadProps {
  item: Item;
}

export default ({ item }: ItemHeadProps) => {
  return (
    <div styleName="item">
      <div styleName="mainRow">
        <a href="#" styleName="title">
          {item.title}
        </a>
        <a href="#" styleName="domain">
          domain.com
        </a>
      </div>
      <div>
        <span>{item.score} points</span>
        <span>by {item.by}</span>
        <span>1 hour ago</span>
        <span>{item.descendants} comments</span>
      </div>
    </div>
  );
};
