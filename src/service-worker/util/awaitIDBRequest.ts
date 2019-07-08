export default function awaitIDBRequest<T = any>(rq: IDBRequest<T>) {
  return new Promise<T>((res, rej) => {
    rq.addEventListener("success", ev => res(rq.result));
    rq.addEventListener("error", ev => rej(rq.error));
  });
}
