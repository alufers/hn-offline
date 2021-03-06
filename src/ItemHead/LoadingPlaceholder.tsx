import Score from "../Score";
import "./style.less";

export default () => {
  return (
    <div styleName="item">
      <Score>
        <div styleName="loading-placeholder narrow" />
      </Score>
      <div styleName="info-column">
        <div styleName="main-row">
          <span href="#" styleName="title">
            <div styleName="loading-placeholder wide" />
          </span>
          <span href="#" styleName="domain">
            <div styleName="loading-placeholder" />
          </span>
        </div>
        <div styleName="meta">
          <span href="#" styleName="link">
            <i styleName="icon icon-comments" />
            <span>
              <div styleName="loading-placeholder" />
            </span>
          </span>
          <span href="#" styleName="link">
            <i styleName="icon icon-clock" />
            <span>
              <div styleName="loading-placeholder" />
            </span>
          </span>
          <span href="#" styleName="link">
            <i styleName="icon icon-user" />
            <span>
              <div styleName="loading-placeholder" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
