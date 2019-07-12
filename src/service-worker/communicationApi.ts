/**
 *
 * @param {Function} handler
 */
export function registerFrontendRequestHandler(handler: Function) {
  self.addEventListener("message", async function(event) {
    try {
      const returnValue = handler(event.data);
      if ("then" in returnValue) {
        event.ports[0].postMessage(await returnValue);
      }
    } catch (error) {
      event.ports[0].postMessage(error.toString());
    }
  });
}
