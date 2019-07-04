
/**
 * 
 * @param {Function} handler 
 */
export function registerFrontendRequestHandler(handler) {
  self.addEventListener("message", function(event) {
    handler(event.data).then(
      response => {
        event.ports[0].postMessage(response);
      },
      error => {
        event.ports[0].postMessage(error);
      }
    );
  });
}
