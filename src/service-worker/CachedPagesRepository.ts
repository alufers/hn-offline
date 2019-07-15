import CachedPage from "../types/CachedPage";
import AppSyncManager from "./AppSyncManager";
import awaitIDBRequest from "./util/awaitIDBRequest";
import awaitIDBTransaction from "./util/awaitIDBTransaction";
import EventEmitter from "./util/EventEmitter";

export default class CachedPagesRepository extends EventEmitter<{
  pageUpsert: [CachedPage];
}> {
  constructor(public asm: AppSyncManager) {
    super();
  }
  async upsertCachedPage(page: CachedPage) {
    const transaction = this.asm.db.transaction(["cachedPages"], "readwrite");
    const os = transaction.objectStore("cachedPages");
    os.put(page);
    await awaitIDBTransaction(transaction);
    this.emit("pageUpsert", page);
  }

  async getPageByOriginalUrl(originalUrl: string) {
    const transaction = this.asm.db.transaction(["cachedPages"], "readonly");
    const os = transaction.objectStore("cachedPages");
    return awaitIDBRequest(os.get(originalUrl)) as Promise<CachedPage>;
  }

  async getPageByOriginalUrlWhenReady(originalUrl: string) {
    let page = await this.getPageByOriginalUrl(originalUrl);
    if (!page) {
      page = await new Promise(res => {
        const handler = (p: CachedPage) => {
          if (p.originalURL === originalUrl) {
            this.off("pageUpsert", handler);
            res(p);
          }
        };
        this.on("pageUpsert", handler);
      });
    }
    return page;
  }
}
