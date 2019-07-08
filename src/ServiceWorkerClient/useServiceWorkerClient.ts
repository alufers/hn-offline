import { useContext } from "preact/hooks";
import ServiceWorkerClientContext from "./ServiceWorkerClientContext";
import ServiceWorkerClient from ".";

export default function useServiceWorkerClient(): ServiceWorkerClient {
  return useContext(ServiceWorkerClientContext);
}
