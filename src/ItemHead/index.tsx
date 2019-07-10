import { Attributes } from "preact";
import { Link } from "../router";
import Score from "../Score";
import Item from "../types/Item";
import timeAgoFromTimestamp from "../util/timeAgoFromTimestamp";
import "./style.less";

export interface ItemHeadProps extends Attributes {
  item: Item;
}

export default ({ item }: ItemHeadProps) => {
  return (
    <div styleName="item">
      {/* <div styleName="rank">1.</div> */}
      <Score>{item.score}</Score>
      <div styleName="info-column">
        <div styleName="main-row">
          <Link to={`/item/${item.id}/view`} styleName="title">
            {item.title}
          </Link>
          <a href="#" styleName="domain">
            {item.url && new URL(item.url).host}
          </a>
        </div>
        <div styleName="meta">
          <Link to={`/item/${item.id}/comments`} styleName="link">
            <i styleName="icon icon-comments" />
            <span>{item.descendants} comments</span>
          </Link>
          <span href="#" styleName="link">
            <i styleName="icon icon-clock" />
            <span>{timeAgoFromTimestamp(item.time)}</span>
          </span>
          <a href="#" styleName="link">
            <i styleName="icon icon-user" />
            <span>{item.by}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
