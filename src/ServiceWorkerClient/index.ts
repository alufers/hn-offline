import MessageType from "../types/MessageType.enum";

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
        if (event.data.error) {
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
    waitForSW();
    const msgChan = new MessageChannel();
    const cancelChan = new MessageChannel();

    // Handler for recieving message reply from service worker
    msgChan.port1.onmessage = function(event) {
      if (event.data.error) {
        console.error(event.data.error);
      } else {
        callback(event.data);
      }
    };
    // Send message to service worker along with port for reply
    navigator.serviceWorker.controller.postMessage(
      { type, data, isSubscription: true },
      [msgChan.port2, cancelChan.port1]
    );

    return () => {
      console.log("SENDING CANCEL");
      cancelChan.port2.postMessage("cancel");
    };
  }
}
