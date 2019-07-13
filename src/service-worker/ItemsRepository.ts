import Item from "../types/Item";
import ItemWithPopulatedChildren from "../types/ItemWithPopulatedChildren";
import AppSyncManager, { ITEM_SYNC_TIME } from "./AppSyncManager";
import awaitIDBRequest from "./util/awaitIDBRequest";
import awaitIDBTransaction from "./util/awaitIDBTransaction";
import createAsyncThrottle from "./util/createAsyncThrottle";
import EventEmitter from "./util/EventEmitter";

export default class ItemsRepository extends EventEmitter<{
  itemUpsert: [Item];
}> {
  constructor(public asm: AppSyncManager) {
    super();
  }
  async upsertItem(item: Item) {
    const transaction = this.asm.db.transaction(["items"], "readwrite");
    const os = transaction.objectStore("items");
    os.put(item);
    await awaitIDBTransaction(transaction);
    this.emit("itemUpsert", item);
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
    if (!item) {
      throw new Error("Item is falsy");
    }
    item._lastSync = new Date();
    await this.upsertItem(item);
    return item;
  }

  async syncItemIfNeeded(id: number) {
    const cachedItem = await this.getItemById(id);
    if (
      !cachedItem ||
      new Date().getTime() - cachedItem._lastSync.getTime() >= ITEM_SYNC_TIME
    ) {
      return this.syncItem(id);
    }
    return cachedItem;
  }

  /**
   * Returns an item by id from indexedDB.
   * @param id number
   */
  async getItemById(id: number) {
    const transaction = this.asm.db.transaction(["items"], "readonly");
    const itemsOs = transaction.objectStore("items");
    return awaitIDBRequest(itemsOs.get(id)) as Promise<Item>;
  }

  async getItemsByIds(
    ids: number[],
    trans: IDBTransaction = this.asm.db.transaction(["items"], "readonly")
  ) {
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
  async syncItemRecursive(id: number, throttle = createAsyncThrottle(6)) {
    const item = (await throttle(() =>
      this.syncItemIfNeeded(id)
    )) as ItemWithPopulatedChildren;

    // populate the children only if it has any kids, the HN api omits the array if it is empty
    if (Array.isArray(item.kids)) {
      item.populatedChildren = await Promise.all(
        item.kids.map(kidId => this.syncItemRecursive(kidId, throttle))
      );
    }

    return item;
  }
}
