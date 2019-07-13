import { useEffect, useState } from "preact/hooks";
import Comment from "../../Comment";
import ItemHead from "../../ItemHead";
import LoadingPlaceholder from "../../ItemHead/LoadingPlaceholder";
import { useParam } from "../../router";
import useServiceWorkerClient from "../../ServiceWorkerClient/useServiceWorkerClient";
import ItemWithPopulatedChildren from "../../types/ItemWithPopulatedChildren";
import MessageType from "../../types/MessageType.enum";
import "./style.less";

export default function ItemCommentsPage() {
  const id = useParam("id");
  const [item, setItem] = useState<ItemWithPopulatedChildren>(null);
  const [loading, setLoading] = useState(true);
  const client = useServiceWorkerClient();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        console.log("BEFRORE");
        const loadedItem = await client.request<ItemWithPopulatedChildren>(
          MessageType.GetItemWithPopulatedChildrenWhenReady,
          { id: parseInt(id) }
        );
        console.log({ loadedItem });
        setItem(loadedItem);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <LoadingPlaceholder />
      </div>
    );
  } else {
    return (
      <div>
        <ItemHead item={item} />
        <div styleName="comments-container">
          {item.populatedChildren.map(child => (
            <Comment key={child.id} item={child} />
          ))}
        </div>
      </div>
    );
  }
}
