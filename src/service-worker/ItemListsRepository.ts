import ItemList from "../types/ItemList";
import AppSyncManager, { ITEM_SYNC_TIME } from "./AppSyncManager";
import awaitIDBRequest from "./util/awaitIDBRequest";
import awaitIDBTransaction from "./util/awaitIDBTransaction";
import createAsyncThrottle from "./util/createAsyncThrottle";
import ItemListKind from "../types/ItemListKind.enum";
import EventEmitter from "./util/EventEmitter";

export default class ItemListsRepository extends EventEmitter<{
  itemListUpserted: [ItemList];
}> {
  constructor(public asm: AppSyncManager) {
    super();
  }
  async upsertItemList(itemList: ItemList) {
    const transaction = this.asm.db.transaction(["itemLists"], "readwrite");
    const os = transaction.objectStore("itemLists");
    os.put(itemList);
    await awaitIDBTransaction(transaction);
    this.emit("itemListUpserted", itemList);
  }

  /**
   * Returns an item list by the kind from indexedDB.
   */
  async getItemList(kind: ItemListKind) {
    const trans = this.asm.db.transaction(["itemLists"], "readonly");
    const itemListsStore = trans.objectStore("itemLists");
    const itemList = (await awaitIDBRequest(
      itemListsStore.get(kind)
    )) as ItemList;
    return itemList || null;
  }

  async getStructuredItems() {
    const trans = this.asm.db.transaction(["itemLists", "items"], "readonly");
    const itemListsStore = trans.objectStore("itemLists");
    const topStories = (await awaitIDBRequest(
      itemListsStore.get("topstories")
    )) as ItemList;
    if (!topStories) {
      return [];
    }
    return await this.asm.itemsRepository.getItemsByIds(
      topStories.itemIds,
      trans
    );
  }
}
