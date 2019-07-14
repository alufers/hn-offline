import CachedPagesRepository from "./CachedPagesRepository";
import ItemListsRepository from "./ItemListsRepository";
import ItemsRepository from "./ItemsRepository";
import BaseJob from "./jobs/BaseJob";
import createAsyncThrottle from "./util/createAsyncThrottle";
import EventEmitter from "./util/EventEmitter";

// Five minutes of caching
export const ITEM_SYNC_TIME = 1000 * 60 * 5;
export const MAX_SYNC_CONCURRENCY = 30;

export default class AppSyncManager extends EventEmitter<{
  jobQueueLengthChange: [number];
  dbReady: [];
}> {
  db: IDBDatabase;

  itemsRepository = new ItemsRepository(this);
  itemListsRepository = new ItemListsRepository(this);
  cachedPagesRepository = new CachedPagesRepository(this);

  jobQueue: BaseJob[] = [];
  jobThrottle = createAsyncThrottle(MAX_SYNC_CONCURRENCY);

  async addJob(job: BaseJob) {
    for (const otherJob of this.jobQueue) {
      if (job.isSame(otherJob)) {
        return;
      }
    }
    if (!job.omitCacheCheck && (await job.isCached())) {
      return;
    }
    this.jobQueue.push(job);
    this.emit("jobQueueLengthChange", this.jobQueue.length);
    this.jobThrottle(async () => {
      try {
        await job.performJob();
      } catch (e) {
        console.error(e);
      } finally {
        this.jobQueue.splice(this.jobQueue.indexOf(job), 1);
        this.emit("jobQueueLengthChange", this.jobQueue.length);
      }
    });
  }

  async init() {
    const openRequest = self.indexedDB.open("HnOffline", 2);
    this.db = await new Promise<IDBDatabase>((res, rej) => {
      openRequest.addEventListener("upgradeneeded", () => {
        const db = openRequest.result;
        const stores = Array.from(db.objectStoreNames);
        if (!stores.includes("items")) {
          db.createObjectStore("items", {
            keyPath: "id"
          });
        }
        if (!stores.includes("itemLists")) {
          db.createObjectStore("itemLists", {
            keyPath: "kind"
          });
        }
        if (!stores.includes("cachedPages")) {
          db.createObjectStore("cachedPages", {
            keyPath: "originalURL"
          });
        }
      });
      openRequest.addEventListener("success", () => res(openRequest.result));
      openRequest.addEventListener("error", () => rej(openRequest.error));
    });
    this.emit("dbReady");
  }
  awaitDbReady() {
    return new Promise<void>(res => {
      if (this.db) {
        res();
      }
      this.on("dbReady", res);
    });
  }
}
