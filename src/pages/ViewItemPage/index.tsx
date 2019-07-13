import { useEffect, useState, useMemo } from "preact/hooks";
import { useParam } from "../../router";
import useServiceWorkerClient from "../../ServiceWorkerClient/useServiceWorkerClient";
import Item from "../../types/Item";
import MessageType from "../../types/MessageType.enum";
import "./style.less";

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
          `${process.env.READABILITY_PROXY_URL ||
            "http://localhost:8089/"}?url=${encodeURIComponent(item.url)}`
        );
        const data = await resp.json();
        setArticleData(data);
      } finally {
        setLoading(false);
      }
    }
    doFetch();
  }, [id]);
  const html = useMemo(() => articleData && { __html: articleData.content }, [
    articleData ? articleData.content : null
  ]);
  if (!loading) {
    return (
      <div styleName="article-content">
        <h1>{articleData.title}</h1>
        <div dangerouslySetInnerHTML={html} />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
