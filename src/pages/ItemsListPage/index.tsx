import ConnectedItem from "../../connected/ConnectedItem";
import LoadingPlaceholder from "../../ItemHead/LoadingPlaceholder";
import useSWSubscription from "../../ServiceWorkerClient/useSWSubscription";
import ItemList from "../../types/ItemList";
import ItemListKind from "../../types/ItemListKind.enum";
import MessageType from "../../types/MessageType.enum";

export default function ItemListPage() {
  const itemList = useSWSubscription<ItemList>(
    MessageType.SubscribeToItemList,
    {
      kind: ItemListKind.TopStories
    }
  );

  let content = null;
  if (!itemList) {
    content = [];
    for (let i = 0; i < 10; i++) {
      content.push(<LoadingPlaceholder key={i} />);
    }
  } else {
    content = itemList.itemIds.map(itemId => (
      <ConnectedItem id={itemId} key={itemId} />
    ));
  }

  return content;
}
