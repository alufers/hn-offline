import MessageType from "../types/MessageType.enum";
import useServiceWorkerClient from "./useServiceWorkerClient";
import { useState, useEffect } from "preact/hooks";

export default function useSWSubscription<T>(
  msgType: MessageType,
  data?: any
): T {
  const client = useServiceWorkerClient();
  const [value, setValue] = useState<T>(null);
  useEffect(() => {
    console.log("SUBSCRIBING");
    return client.subscribe(msgType, data, setValue);
  }, [msgType, data, setValue]);
  return value;
}
