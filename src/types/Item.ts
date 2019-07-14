export default interface Item {
  /**
   * Added by the service worker to know when to cache an item.
   */
  _lastSync?: Date;

  by: string;
  descendants: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  type: "story" | "comment" | "job" | "poll" | "pollopt";
  url: string;
  text?: string;
}
