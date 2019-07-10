import MessageType from "../types/MessageType.enum";
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

  registerTypeHandler(
    MessageType.GetItemWithPopulatedChildren,
    async ({ id }: { id: number }) => {
      try {
        return await asm.itemsRepository.syncItemRecursive(id);
      } catch (e) {
        console.error(e);
      }
    }
  );
  registerTypeHandler(MessageType.GetItem, async ({ id }: { id: number }) => {
    try {
      return await asm.itemsRepository.syncItemIfNeeded(id);
    } catch (e) {
      console.error(e);
    }
  });
  return function({ type, data }) {
    return handlers[type](data);
  };
}
