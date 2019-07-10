import { useEffect, useState } from "preact/hooks";
import { useParam } from "../router";
import useServiceWorkerClient from "../ServiceWorkerClient/useServiceWorkerClient";
import Item from "../types/Item";
import MessageType from "../types/MessageType.enum";

export default function ViewItemPage() {
  const id = useParam("id");
  const client = useServiceWorkerClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [articleData, setArticleData] = useState<any>(null);
  useEffect(() => {
    async function doFetch() {
      try {
        const item: Item = await client.request(MessageType.GetItem, {
          id: parseInt(id)
        });
        const resp = await fetch(
          `http://localhost:8089/?url=${encodeURIComponent(item.url)}`
        );
        const data = await resp.json();
        setArticleData(data);
      } finally {
        setLoading(false);
      }
    }
    doFetch();
  }, [id]);
  if (!loading) {
    return <div dangerouslySetInnerHTML={{ __html: articleData.content }} />;
  } else {
    return <div>Loading...</div>;
  }
}
