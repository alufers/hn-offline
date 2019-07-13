import { Attributes } from "preact";
import ItemHead from "../../ItemHead";
import LoadingPlaceholder from "../../ItemHead/LoadingPlaceholder";
import useSWSubscription from "../../ServiceWorkerClient/useSWSubscription";
import Item from "../../types/Item";
import MessageType from "../../types/MessageType.enum";

export default function ConnectedItem({ id }: { id: number } & Attributes) {
  const item = useSWSubscription<Item>(MessageType.SubscribeToItem, { id });
  if (!item) {
    return <LoadingPlaceholder />;
  }
  return <ItemHead item={item} />;
}
