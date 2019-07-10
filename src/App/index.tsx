import Footer from "../Footer";
import ItemCommentsPage from "../ItemCommentsPage";
import ItemsList from "../ItemsList";
import Navbar from "../Navbar";
import { Route } from "../router";
import "./style.less";
import ViewItemPage from "../ViewItemPage";

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <Route path="/" component={ItemsList} exact />
        <Route path="/item/:id/comments" component={ItemCommentsPage} />
        <Route path="/item/:id/view" component={ViewItemPage} />

        <Footer />
      </div>
    </div>
  );
};
