import Footer from "../Footer";
import ItemCommentsPage from "../ItemCommentsPage";
import ItemsList from "../ItemsList";
import Navbar from "../Navbar";
import { Route } from "../router";
import "./style.less";


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
