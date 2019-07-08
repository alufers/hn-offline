import Item from "../types/Item";
import AppSyncManager from "./AppSyncManager";
import awaitIDBRequest from "./util/awaitIDBRequest";
import awaitIDBTransaction from "./util/awaitIDBTransaction";

export default class ItemsRepository {
  constructor(public asm: AppSyncManager) {}
  async upsertItem(item: Item) {
    const transaction = this.asm.db.transaction(["items"], "readwrite");
    const os = transaction.objectStore("items");
    os.put(item);
    await awaitIDBTransaction(transaction);
  }

  async syncItem(id: number) {
    const resp = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    if (!resp.ok) {
      throw new Error(
        `Server did not return a successfull reply - ${
          resp.statusText
        }. Additional information: ${await resp.text()} `
      );
    }
    const item: Item = await resp.json();
    await this.upsertItem(item);
    return item;
  }

  async getItemsByIds(ids: number[], trans: IDBTransaction) {
    const itemsOs = trans.objectStore("items");
    let items = await Promise.all(
      ids.map(id => {
        return awaitIDBRequest(itemsOs.get(id)) as Promise<Item>;
      })
    );

    items = items.filter(itm => !!itm);

    return items;
  }
}
