import BaseJob from "./BaseJob";
import AppSyncManager, { ITEM_SYNC_TIME } from "../AppSyncManager";
import ItemListKind from "../../types/ItemListKind.enum";
import SyncItemJob from "./SyncItemJob";

export default class SyncItemListJob extends BaseJob {
  constructor(asm: AppSyncManager, public itemListKind: ItemListKind) {
    super(asm);
  }
  isSame(other: BaseJob): boolean {
    return (
      other instanceof SyncItemListJob &&
      other.itemListKind === this.itemListKind
    );
  }
  async isCached() {
    const listInDb = await this.asm.itemListsRepository.getItemList(
      this.itemListKind
    );
    if (!listInDb) {
      return false;
    }

    return new Date().getTime() - listInDb.lastSync.getTime() < ITEM_SYNC_TIME;
  }
  async performJob() {
    const resp = await fetch(
      `https://hacker-news.firebaseio.com/v0/${this.itemListKind}.json`
    );
    if (!resp.ok) {
      throw new Error(
        `Server did not return a successfull reply - ${
          resp.statusText
        }. Additional information: ${await resp.text()} `
      );
    }
    let itemIds: number[] = await resp.json();
    if (!Array.isArray(itemIds)) {
      throw new Error("itemIds is not an array");
    }
    await this.asm.itemListsRepository.upsertItemList({
      kind: this.itemListKind,
      itemIds,
      lastSync: new Date()
    });
    for (const itemId of itemIds.slice(0, 10)) {
      this.addChildJob(new SyncItemJob(this.asm, itemId));
    }
  }
}
