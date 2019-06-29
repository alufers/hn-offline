import { h } from "preact";
import "./style.less";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ItemHead from "../ItemHead";
h;

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <ItemHead
          item={
            {
              title: "Asdf",
              descendants: 123,
              by: "somebody",
              score: 789
            } as any
          }
        />
        <Footer />
      </div>
    </div>
  );
};
