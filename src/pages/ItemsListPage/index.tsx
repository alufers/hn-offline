import { useEffect, useState } from "preact/hooks";
import ItemHead from "../../ItemHead";
import LoadingPlaceholder from "../../ItemHead/LoadingPlaceholder";
import useServiceWorkerClient from "../../ServiceWorkerClient/useServiceWorkerClient";
import Item from "../../types/Item";
import MessageType from "../../types/MessageType.enum";

export default function ItemListPage() {
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

  return content;
}
