import MessageType from "../common/MessageType.enum";
import Item from "../types/Item";

/**
 * Returns a fucntion which responds to requests sent from the frontend.
 */
export default function makeRequestHandler() {
  const handlers = [];
  function registerTypeHandler(
    type: MessageType,
    handler: (data: any) => Promise<any>
  ) {
    handlers[type] = handler;
  }
  registerTypeHandler(MessageType.GetItems, async data => {
    const topStories: number[] = await fetch(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    ).then(resp => resp.json());
    let items: Item[] = [];
    for (let id of topStories.slice(0, 10)) {
      items.push(
        await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        ).then(resp => resp.json())
      );
    }
    return items;
  });

  return function({ type, data }) {
    return handlers[type](data);
  };
}
