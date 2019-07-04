import MessageType from "../common/MessageType.enum";

export default class ServiceWorkerClient {
  async request(type: MessageType, data: any) {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise(res =>
        navigator.serviceWorker.addEventListener("controllerchange", res)
      );
    }
    return await new Promise(function(resolve, reject) {
      // Create a Message Channel
      var msg_chan = new MessageChannel();

      // Handler for recieving message reply from service worker
      msg_chan.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };

      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage({ type, data }, [
        msg_chan.port2
      ]);
    });
  }
}
