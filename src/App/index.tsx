import { h } from "preact";
import "./style.less";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ItemHead from "../ItemHead";
import LoadingPlaceholder from "../ItemHead/LoadingPlaceholder";
h;

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <ItemHead
          item={
            {
              title:
                "Why did moving the mouse cursor cause Windows 95 to run more quickly?",
              descendants: 23,
              by: "folli",
              score: 153
            } as any
          }
        />
        <LoadingPlaceholder />
        <Footer />
      </div>
    </div>
  );
};
