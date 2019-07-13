/**
 *
 * @param {Function} handler
 */
export function registerFrontendRequestHandler(handler: Function) {
  self.addEventListener("message", async function(event) {
    try {
      if (event.data.isSubscription) {
        handler(event.data, data => event.ports[0].postMessage(data));
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
