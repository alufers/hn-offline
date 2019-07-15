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
        const item: Item = await client.request(MessageType.GetItemWhenReady, {
          id: parseInt(id)
        });

        setArticleData(
          await client.request(MessageType.GetCachedPageWhenReady, {
            originalUrl: item.url
          })
        );
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
    return (
      <div styleName="article-content">
        <h1>
          <span styleName="loading-placeholder title" />
        </h1>
        <div>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />

            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
          <p>
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder" />
            <span styleName="loading-placeholder shorter" />
          </p>
        </div>
      </div>
    );
  }
}
