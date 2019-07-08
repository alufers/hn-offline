import MessageType from "../common/MessageType.enum";
import Item from "../types/Item";
import AppSyncManager from "./AppSyncManager";

/**
 * Returns a fucntion which responds to requests sent from the frontend.
 */
export default function makeRequestHandler(asm: AppSyncManager) {
  const handlers = [];
  function registerTypeHandler(
    type: MessageType,
    handler: (data: any) => Promise<any>
  ) {
    handlers[type] = handler;
  }
  registerTypeHandler(MessageType.GetItems, async data => {
    try {
      await asm.itemListsRepository.syncTopStories();
    } catch (e) {
      console.error(e);
    }
    return await asm.itemListsRepository.getStructuredItems();
  });

  return function({ type, data }) {
    return handlers[type](data);
  };
}
