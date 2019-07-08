export default (trans: IDBTransaction) => {
  return new Promise((res, rej) => {
    trans.addEventListener("complete", ev => res());
    trans.addEventListener("error", ev => rej(trans.error));
  });
};
