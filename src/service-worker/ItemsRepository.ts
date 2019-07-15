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

  async getItemWithPopulatedChildrenWhenReady(id: number) {
    let item = (await this.getItemById(id)) as ItemWithPopulatedChildren;
    if (!item) {
      item = await new Promise(res => {
        const handler = i => {
          this.off("itemUpsert", handler);
          res(i as ItemWithPopulatedChildren);
        };
        this.on("itemUpsert", handler);
      });
    }
    // populate the children only if it has any kids, the HN api omits the array if it is empty
    if (Array.isArray(item.kids)) {
      item.populatedChildren = await Promise.all(
        item.kids.map(kid => this.getItemWithPopulatedChildrenWhenReady(kid))
      );
    }
    return item;
  }

  async getItemWhenReady(id: number) {
    let item = (await this.getItemById(id)) as ItemWithPopulatedChildren;
    if (!item) {
      item = await new Promise(res => {
        const handler = i => {
          this.off("itemUpsert", handler);
          res(i as ItemWithPopulatedChildren);
        };
        this.on("itemUpsert", handler);
      });
    }
    return item;
  }
}
