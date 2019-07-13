/**
 * MessageType denotes the type of a message passed between the site and the service worker.
 */
const enum MessageType {
  GetItems,
  GetItemWithPopulatedChildren,
  GetItem,
  SubscribeJobQueueLength,
  Sync,
  CancelSubscription
}

export default MessageType;
