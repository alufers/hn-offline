/**
 *
 * @param {Function} handler
 */
export function registerFrontendRequestHandler(handler: Function) {
  self.addEventListener("message", async function(event) {
    try {
      if (event.data.isSubscription) {
        const cancel = handler(event.data, data =>
          event.ports[0].postMessage(data)
        );
        if (typeof cancel !== "function") {
          throw new Error("Handler did not return a cancel function");
        }
        console.log("PIIPI",  event.ports[1], event)
        event.ports[1].addEventListener("message", ev => {
          console.log("CANCEL HANDLER", ev);
          ev.data === "cancel" && cancel();
        });
        return;
      }
      const returnValue = handler(event.data);
      if ("then" in returnValue) {
        event.ports[0].postMessage(await returnValue);
      }
    } catch (error) {
      event.ports[0].postMessage({ error: error.toString() });
    }
  });
}
