import Item from "../types/Item";
import AppSyncManager, { ITEM_SYNC_TIME } from "./AppSyncManager";
import awaitIDBRequest from "./util/awaitIDBRequest";
import awaitIDBTransaction from "./util/awaitIDBTransaction";
import createAsyncThrottle from "./util/createAsyncThrottle";
import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";

export default class ItemsRepository {
  constructor(public asm: AppSyncManager) {}
  async upsertItem(
    item: Item,
    transaction = this.asm.db.transaction(["items"], "readwrite")
  ) {
    const os = transaction.objectStore("items");
    os.put(item);
    await awaitIDBTransaction(transaction);
  }

  /**
   * Downloads an item form the Hackernews API by its id. Additionaly it saves the current time in _lastSync.
   * @param id the id of theitem
   */
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
    item._lastSync = new Date();
    await this.upsertItem(item);
    return item;
  }

  async syncItemIfNeeded(id: number, trans: IDBTransaction) {
    const cachedItem = await this.getItemById(id, trans);
    if (
      !cachedItem ||
      new Date().getTime() - cachedItem._lastSync.getTime() >= ITEM_SYNC_TIME
    ) {
      return this.syncItem(id);
    }
    return cachedItem;
  }

  async getItemById(id: number, trans: IDBTransaction) {
    const itemsOs = trans.objectStore("items");
    return awaitIDBRequest(itemsOs.get(id)) as Promise<Item>;
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

  /**
   * Syncs an item and all its descendants.
   * @param id
   */
  async syncItemRecursive(
    id: number,
    throttle = createAsyncThrottle(6),
    transaction = this.asm.db.transaction(["items"], "readwrite")
  ) {
    const item = (await throttle(() =>
      this.syncItemIfNeeded(id, transaction)
    )) as ItemWithPopulatedChildren;

    item.populatedChildren = await Promise.all(
      item.kids.map(kidId =>
        throttle(() => this.syncItemRecursive(kidId, throttle, transaction))
      )
    );

    return item;
  }
}
