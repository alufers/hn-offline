import { h } from "preact";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./style.less";
import ItemsList from "../ItemsList";
import ItemCommentsPage from "../ItemCommentsPage";

import { Route } from "../router";

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <Route path="/" component={ItemsList} exact />
        <Route path="/item/:id/comments" component={ItemCommentsPage} />
        <Footer />
      </div>
    </div>
  );
};
