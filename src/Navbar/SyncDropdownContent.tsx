import Button from "../Button";
import useServiceWorkerClient from "../ServiceWorkerClient/useServiceWorkerClient";
import useSWSubscription from "../ServiceWorkerClient/useSWSubscription";
import MessageType from "../types/MessageType.enum";

export default () => {
  const client = useServiceWorkerClient();
  const doSync = () => {
    client.request(MessageType.Sync);
  };
  const jobQueueLength = useSWSubscription(MessageType.SubscribeJobQueueLength);
  return (
    <div>
      <Button onClick={doSync}>Sync now</Button>
      <div>Job queue: {jobQueueLength}</div>
    </div>
  );
};
