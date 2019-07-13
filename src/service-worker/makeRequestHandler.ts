import Item from "../types/Item";
import ItemListKind from "../types/ItemListKind.enum";
import MessageType from "../types/MessageType.enum";
import AppSyncManager from "./AppSyncManager";
import SyncItemListJob from "./jobs/SyncItemListJob";
import ItemList from "../types/ItemList";

/**
 * Returns a fucntion which responds to requests sent from the frontend.
 */
export default function makeRequestHandler(asm: AppSyncManager) {
  const handlers = [];
  const subscriptionCancellations: { [x: string]: Function } = {};
  function registerTypeHandler(
    type: MessageType,
    handler: (data: any, subscriptionCallback?: Function) => Promise<any> | any
  ) {
    handlers[type] = handler;
  }

  registerTypeHandler(MessageType.CancelSubscription, async data => {
    if (subscriptionCancellations[data.subscriptionId]) {
      subscriptionCancellations[data.subscriptionId]();
      delete subscriptionCancellations[data.subscriptionId];
    }
    return {};
  });

  registerTypeHandler(MessageType.GetItems, async data => {
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
  registerTypeHandler(MessageType.Sync, async () => {
    const job = new SyncItemListJob(asm, ItemListKind.TopStories);
    job.omitCacheCheck = true;
    asm.addJob(job);
    return {};
  });

  registerTypeHandler(MessageType.SubscribeJobQueueLength, (_, cb) => {
    function eventHandler(newLength: number) {
      cb(newLength);
    }
    cb(asm.jobQueue.length);
    asm.on("jobQueueLengthChange", eventHandler);
    return () => {
      asm.off("jobQueueLengthChange", eventHandler);
    };
  });
  registerTypeHandler(
    MessageType.SubscribeToItem,
    ({ id }: { id: number }, cb) => {
      let didSendBeforeInitial = false;
      function eventHandler(item: Item) {
        console.log("RECIEVED ITEM UPSERT");
        if (item.id === id) {
          cb(item);
          didSendBeforeInitial = true;
        }
      }
      // asm.itemsRepository.getItemById(id).then(item => {
      //   if (!didSendBeforeInitial) {
      //     return cb(item);
      //   }
      // }, console.error);
      asm.itemsRepository.on("itemUpsert", eventHandler);
      return () => {
        console.log("subscription cancelled");
        asm.itemsRepository.off("itemUpsert", eventHandler);
      };
    }
  );
  registerTypeHandler(
    MessageType.SubscribeToItemList,
    ({ kind }: { kind: ItemListKind }, cb) => {
      let didSendBeforeInitial = false;
      function eventHandler(il: ItemList) {
        if (il.kind === kind) {
          cb(il);
          didSendBeforeInitial = true;
        }
      }
      // asm.itemListsRepository.getItemList(kind).then(il => {
      //   if (!didSendBeforeInitial) {
      //     return cb(il);
      //   }
      // }, console.error);
      asm.itemListsRepository.on("itemListUpserted", eventHandler);
      return () => {
        asm.itemListsRepository.off("itemListUpserted", eventHandler);
      };
    }
  );
  return function(
    {
      type,
      data,
      subscriptionId
    }: { type: MessageType; data: any; subscriptionId: number },
    subscriptionCallback
  ) {
    if (subscriptionId && subscriptionCallback) {
      subscriptionCancellations[subscriptionId] = handlers[type](
        data,
        subscriptionCallback
      );
      return;
    }
    return handlers[type](data, subscriptionCallback);
  };
}
