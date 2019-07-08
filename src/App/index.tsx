import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import MessageType from "../common/MessageType.enum";
import Footer from "../Footer";
import ItemHead from "../ItemHead";
import LoadingPlaceholder from "../ItemHead/LoadingPlaceholder";
import Navbar from "../Navbar";
import useServiceWorkerClient from "../ServiceWorkerClient/useServiceWorkerClient";
import Item from "../types/Item";
import "./style.less";

h;

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState(null);
  const serviceWorkerClient = useServiceWorkerClient();
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        setItems(
          await serviceWorkerClient.request<Item[]>(MessageType.GetItems, {})
        );
      } finally {
        setIsLoading(false); 
      }
    };
    loadItems();
  }, []);

  let content = null;
  if (isLoading) {
    content = [];
    for (let i = 0; i < 10; i++) {
      content.push(<LoadingPlaceholder key={i} />);
    }
  } else if (!!items) {
    content = items.map(item => <ItemHead item={item} key={item.id} />);
  }

  return (
    <div>
      <Navbar />
      <div styleName="container">
        {content}
        <Footer />
      </div>
    </div>
  );
};
