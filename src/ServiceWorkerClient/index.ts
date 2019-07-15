import MessageType from "../types/MessageType.enum";
import randomId from "../util/randomId";

const waitForSW = async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) {
    await new Promise(res =>
      navigator.serviceWorker.addEventListener("controllerchange", res)
    );
  }
};

export default class ServiceWorkerClient {
  async request<R = any>(type: MessageType, data?: any): Promise<R> {
    await waitForSW();
    return await new Promise(function(resolve, reject) {
      // Create a Message Channel
      var msgChan = new MessageChannel();

      // Handler for recieving message reply from service worker
      msgChan.port1.onmessage = function(event) {
        if (event.data && event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage({ type, data }, [
        msgChan.port2
      ]);
    });
  }

  /**
   * Sends a subscription message to the server and returns a cancellation function.
   * @param type
   * @param data
   * @param callback
   */
  subscribe<T>(type: MessageType, data: any, callback: (data: T) => void) {
    let cancelled = false;
    const subscriptionId = randomId();
    async function doSubscribe() {
      await waitForSW();
      const msgChan = new MessageChannel();

      // Handler for recieving message reply from service worker
      msgChan.port1.onmessage = function(event) {
        if (event.data && event.data.error) {
          console.error(event.data.error);
        } else {
          if (cancelled) {
            console.warn(
              "Recieved message from subscription when cancelled. Dropping. MessageType:",
              type,
              event.data
            );
            return;
          }
          callback(event.data);
        }
      };
      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage(
        { type, data, isSubscription: true, subscriptionId },
        [msgChan.port2]
      );
    }
    doSubscribe();

    return () => {
      cancelled = true;
      this.request(MessageType.CancelSubscription, { subscriptionId });
    };
  }
}
