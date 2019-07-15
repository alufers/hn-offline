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

  registerTypeHandler(
    MessageType.Sync,
    async ({ omitCacheCheck = true }: { omitCacheCheck: boolean }) => {
      const job = new SyncItemListJob(asm, ItemListKind.TopStories);
      job.omitCacheCheck = omitCacheCheck;
      asm.addJob(job);
      return {};
    }
  );

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
    MessageType.SubscribeToManyItems,
    ({ itemIds }: { itemIds: number[] }, cb) => {
      function eventHandler(item: Item) {
        if (itemIds.includes(item.id)) {
          cb(item);
        }
      }
      asm.itemsRepository.getItemsByIds(itemIds).then(items => {
        items.forEach(item => cb(item));
      }, console.error);
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
      asm.itemListsRepository.getItemList(kind).then(il => {
        if (!didSendBeforeInitial) {
          return cb(il);
        }
      }, console.error);
      asm.itemListsRepository.on("itemListUpserted", eventHandler);
      return () => {
        asm.itemListsRepository.off("itemListUpserted", eventHandler);
      };
    }
  );
  registerTypeHandler(
    MessageType.GetItemsWhenReady,
    async ({ itemIds }: { itemIds: number[] }) => {
      let readyItemsCount = 0;
      let itemsToSend: Item[] = [];
      const readyItems = await asm.itemsRepository.getItemsByIds(itemIds);
      readyItems.forEach((item, i) => {
        if (item) {
          readyItemsCount++;
          itemsToSend[i] = item;
        }
      });
      if (readyItemsCount < itemIds.length) {
        await new Promise(res => {
          function eventHandler(item: Item) {
            const index = itemIds.indexOf(item.id);
            if (index !== -1) {
              if (!itemsToSend[index]) {
                readyItemsCount++;
                if (readyItemsCount >= itemIds.length) {
                  asm.itemsRepository.off("itemUpsert", eventHandler);
                  res();
                }
              }
              itemsToSend[index] = item;
            }
          }
          asm.itemsRepository.on("itemUpsert", eventHandler);
        });
      }
      return itemsToSend;
    }
  );

  registerTypeHandler(
    MessageType.GetItemWithPopulatedChildrenWhenReady,
    ({ id }: { id: number }) => {
      return asm.itemsRepository.getItemWithPopulatedChildrenWhenReady(id);
    }
  );

  registerTypeHandler(
    MessageType.GetItemWhenReady,
    ({ id }: { id: number }) => {
      return asm.itemsRepository.getItemWhenReady(id);
    }
  );

  registerTypeHandler(
    MessageType.GetCachedPageWhenReady,
    ({ originalUrl }: { originalUrl: string }) => {
      return asm.cachedPagesRepository.getPageByOriginalUrlWhenReady(
        originalUrl
      );
    }
  );

  return async function(
    {
      type,
      data,
      subscriptionId
    }: { type: MessageType; data: any; subscriptionId: number },
    subscriptionCallback
  ) {
    await asm.awaitDbReady();
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
