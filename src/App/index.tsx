import { h } from "preact";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./style.less";
import ItemsList from "../ItemsList";

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <ItemsList />

        <Footer />
      </div>
    </div>
  );
};
