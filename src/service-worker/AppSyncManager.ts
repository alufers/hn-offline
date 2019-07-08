import ItemsRepository from "./ItemsRepository";
import ItemListsRepository from "./ItemListsRepository";

export default class AppSyncManager {
  db: IDBDatabase;

  itemsRepository = new ItemsRepository(this);
  itemListsRepository = new ItemListsRepository(this);
  constructor() {}

  async init() {
    const openRequest = self.indexedDB.open("HnOffline", 1);
    this.db = await new Promise<IDBDatabase>((res, rej) => {
      openRequest.addEventListener("upgradeneeded", () => {
        const db = openRequest.result;
        db.createObjectStore("items", {
          keyPath: "id"
        });
        db.createObjectStore("itemLists", {
          keyPath: "kind"
        });
      });
      openRequest.addEventListener("success", () => res(openRequest.result));
      openRequest.addEventListener("error", () => rej(openRequest.error));
    });
  }
 
}
