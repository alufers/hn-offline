type SubscriptionHandlerFunc = (newUrl?: URL, oldUrl?: URL) => void;
export default class Router {
  private _subscribers: SubscriptionHandlerFunc[] = [];
  get url() {
    return new URL(document.location.toString());
  }

  push(newLocation: string) {
    const oldUrl = this.url;
    history.pushState({}, newLocation, newLocation);
    const newUrl = this.url;
    for (const handler of this._subscribers) {
      handler(newUrl, oldUrl);
    }
  }

  /**
   * Subscribes to location changes and returns an unsubscribe function.
   * @param handler
   */
  subscribe(handler: SubscriptionHandlerFunc): () => void {
    this._subscribers.push(handler);
    return () => {
      this._subscribers.splice(this._subscribers.indexOf(handler));
    };
  }
}
