import Footer from "../Footer";
import Navbar from "../Navbar";
import ItemCommentsPage from "../pages/ItemCommentsPage";
import ItemsListPage from "../pages/ItemsListPage";
import ViewItemPage from "../pages/ViewItemPage";
import { Route } from "../router";
import "./style.less";

export default () => {
  return (
    <div>
      <Navbar />
      <div styleName="container">
        <Route path="/" component={ItemsListPage} exact />
        <Route path="/item/:id/comments" component={ItemCommentsPage} />
        <Route path="/item/:id/view" component={ViewItemPage} />
      </div>
      <Footer />
    </div>
  );
};
