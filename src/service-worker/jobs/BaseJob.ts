import AppSyncManager from "../AppSyncManager";

export default abstract class BaseJob {
  public omitCacheCheck = false;
  constructor(protected asm: AppSyncManager) {}
  addChildJob(child: BaseJob) {
    child.omitCacheCheck = this.omitCacheCheck;
    this.asm.addJob(child);
  }
  abstract isSame(other: BaseJob): boolean;
  abstract async isCached(): Promise<boolean>;
  abstract async performJob();
}
