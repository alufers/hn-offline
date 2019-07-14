import BaseJob from "./BaseJob";
import AppSyncManager from "../AppSyncManager";
import encodeParams from "../util/encodeParams";
import CachedPage from "../../types/CachedPage";

export default class SyncPageJob extends BaseJob {
  constructor(asm: AppSyncManager, public url: string) {
    super(asm);
  }
  isSame(other: BaseJob): boolean {
    return other instanceof SyncPageJob && other.url === this.url;
  }
  async isCached(): Promise<boolean> {
    return !!(await this.asm.cachedPagesRepository.getPageByOriginalUrl(
      this.url
    ));
  }
  async performJob() {
    let resp;
    if (process.env.READABILITY_PROXY_URL) {
      resp = await fetch(
        process.env.READABILITY_PROXY_URL + encodeParams`?url=${this.url}`
      );
    } else {
      resp = await fetch(encodeParams`http://localhost:8089/?url=${this.url}`);
    }
    if (!resp.ok) {
      throw new Error(
        "Failed to download the cached page: " + (await resp.text())
      );
    }
    const data = (await resp.json()) as CachedPage;

    await this.asm.cachedPagesRepository.upsertCachedPage(data);
  }
}
