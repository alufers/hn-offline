type SubscriptionHandlerFunc = (newUrl?: URL, oldUrl?: URL) => void;
export default class Router {
  constructor() {
    window.addEventListener("popstate", ev => {
      this.notify(this.url, null);
    });
  }

  private _subscribers: SubscriptionHandlerFunc[] = [];
  get url() {
    return new URL(document.location.toString());
  }

  push(newLocation: string) {
    const oldUrl = this.url;
    history.pushState({}, newLocation, newLocation);
    const newUrl = this.url;
    this.notify(newUrl, oldUrl);
  }

  /**
   * Subscribes to location changes and returns an unsubscribe function.
   * @param handler
   */
  subscribe(handler: SubscriptionHandlerFunc): () => void {
    this._subscribers.push(handler);
    return () => {
      this._subscribers.splice(this._subscribers.indexOf(handler), 1);
    };
  }

  private notify(newUrl?: URL, oldUrl?: URL) {
    for (const handler of this._subscribers) {
      handler(newUrl, oldUrl);
    }
  }
}
