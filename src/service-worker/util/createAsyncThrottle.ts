/**
 * https://github.com/zeit/async-throttle
 * @param max
 */

export default function createAsyncThrottle(max: number) {
  let cur = 0;
  const queue = [];
  function throttle<T>(fn: () => Promise<T>) {
    return new Promise((resolve, reject) => {
      function handleFn() {
        if (cur < max) {
          throttle.current = ++cur;
          fn().then(
            val => {
              resolve(val);
              throttle.current = --cur;
              if (queue.length > 0) {
                queue.shift()();
              }
            },
            err => {
              reject(err);
              throttle.current = --cur;
              if (queue.length > 0) {
                queue.shift()();
              }
            }
          );
        } else {
          queue.push(handleFn);
        }
      }

      handleFn();
    });
  }

  // keep copies of the "state" for retrospection
  throttle.current = cur;
  throttle.queue = queue;

  return throttle;
}
