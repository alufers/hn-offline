import { useEffect, useMemo, useState } from "preact/hooks";
import ItemHead from "../../ItemHead";
import LoadingPlaceholder from "../../ItemHead/LoadingPlaceholder";
import useServiceWorkerClient from "../../ServiceWorkerClient/useServiceWorkerClient";
import useSWSubscription from "../../ServiceWorkerClient/useSWSubscription";
import Item from "../../types/Item";
import ItemList from "../../types/ItemList";
import ItemListKind from "../../types/ItemListKind.enum";
import MessageType from "../../types/MessageType.enum";

export default function ItemListPage() {
  const requestData = useMemo(
    () => ({
      kind: ItemListKind.TopStories
    }),
    []
  );
  const itemList = useSWSubscription<ItemList>(
    MessageType.SubscribeToItemList,
    requestData
  );

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>(null);
  const serviceWorkerClient = useServiceWorkerClient();
  useEffect(() => {
    serviceWorkerClient.request(MessageType.Sync, { omitCacheCheck: false });
  }, []);
  useEffect(() => {
    if (!itemList) {
      return;
    }
    const loadItems = async () => {
      setIsLoading(true);
      try {
        setItems(
          await serviceWorkerClient.request<Item[]>(
            MessageType.GetItemsWhenReady,
            { itemIds: itemList.itemIds }
          )
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, [itemList && itemList.itemIds]);

  let content = null;
  if (isLoading) {
    content = [];
    for (let i = 0; i < (itemList ? itemList.itemIds.length : 10); i++) {
      content.push(<LoadingPlaceholder key={i} />);
    }
  } else {
    content = items.map(item => <ItemHead item={item} key={item.id} />);
  }

  return content;
}
