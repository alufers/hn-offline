import AppSyncManager from "./AppSyncManager";
import ItemList from "../types/ItemList";
import awaitIDBTransaction from "./util/awaitIDBTransaction";
import awaitIDBRequest from "./util/awaitIDBRequest";

export default class ItemListsRepository {
  constructor(public asm: AppSyncManager) {}
  async upsertItemList(itemList: ItemList) {
    const transaction = this.asm.db.transaction(["itemLists"], "readwrite");
    const os = transaction.objectStore("itemLists");
    os.put(itemList);
    await awaitIDBTransaction(transaction);
  }

  async syncTopStories() {
    const resp = await fetch(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    );
    if (!resp.ok) {
      throw new Error(
        `Server did not return a successfull reply - ${
          resp.statusText
        }. Additional information: ${await resp.text()} `
      );
    }
    const itemIds: number[] = await resp.json();
    if (!Array.isArray(itemIds)) {
      throw new Error("itemIds is not an array");
    }
    await this.upsertItemList({
      kind: "topstories",
      itemIds
    });
    for (const id of itemIds.slice(0, 30)) {
      await this.asm.itemsRepository.syncItem(id);
    }
  }

  async getStructuredItems() {
    const trans = this.asm.db.transaction(["itemLists", "items"], "readonly");
    const itemListsStore = trans.objectStore("itemLists");
    const topStories = (await awaitIDBRequest(
      itemListsStore.get("topstories")
    )) as ItemList;
    return await this.asm.itemsRepository.getItemsByIds(
      topStories.itemIds,
      trans
    );
  }
}
