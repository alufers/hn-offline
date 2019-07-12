import BaseJob from "./BaseJob";
import AppSyncManager, { ITEM_SYNC_TIME } from "../AppSyncManager";
import encodeParams from "../util/encodeParams";
import Item from "../../types/Item";

export default class SyncItemJob extends BaseJob {
  constructor(asm: AppSyncManager, public id: number) {
    super(asm);
  }
  isSame(other: BaseJob): boolean {
    return other instanceof SyncItemJob && other.id === this.id;
  }
  async isCached(): Promise<boolean> {
    const itemInDb = await this.asm.itemsRepository.getItemById(this.id);
    if (!itemInDb) {
      return false;
    }

    return new Date().getTime() - itemInDb._lastSync.getTime() < ITEM_SYNC_TIME;
  }
  async performJob() {
    const resp = await fetch(
      encodeParams`https://hacker-news.firebaseio.com/v0/item/${this.id.toString()}.json`
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
    await this.asm.itemsRepository.upsertItem(item);
    if (item.kids) {
      for (let kid of item.kids) {
        this.addChildJob(new SyncItemJob(this.asm, kid));
      }
    }
  }
}
