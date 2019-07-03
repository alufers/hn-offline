import { h } from "preact";
import Item from "../types/Item";
import "./style.less";

export interface ItemHeadProps {
  item: Item;
}

export default ({ item }: ItemHeadProps) => {
  return (
    <div styleName="item">
      {/* <div styleName="rank">1.</div> */}
      <div styleName="score">{item.score}</div>
      <div styleName="info-column">
        <div styleName="main-row">
          <a href="#" styleName="title">
            {item.title}
          </a>
          <a href="#" styleName="domain">
            domain.com
          </a>
        </div>
        <div styleName="meta">
          <a href="#" styleName="link">
            <i styleName="icon icon-comments" />
            <span className="text">{item.descendants} comments</span>
          </a>
          <a href="#" styleName="link">
            <i styleName="icon icon-clock" />
            <span className="text">1h ago</span>
          </a>
          <a href="#" styleName="link">
            <i styleName="icon icon-user" />
            <span className="text">{item.by}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
