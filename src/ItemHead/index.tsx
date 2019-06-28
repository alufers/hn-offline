import { h } from "preact";
import Item from "../types/Item";
import style from "./style.less";

export interface ItemHeadProps {
  item: Item;
}

export default ({ item }: ItemHeadProps) => {
  return (
    <div class={style.item}>
      <div class={style.mainRow}>
        <a href="#" class={style.title}>
          {item.title}
        </a>
        <a href="#" class={style.domain}>domain.com</a>
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
