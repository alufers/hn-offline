import Button from "../Button";
import useServiceWorkerClient from "../ServiceWorkerClient/useServiceWorkerClient";
import MessageType from "../types/MessageType.enum";

export default () => {
  const client = useServiceWorkerClient();
  const doSync = () => {
    client.request(MessageType.Sync);
  };
  return (
    <div>
      <Button onClick={doSync}>Sync now</Button>
    </div>
  );
};
