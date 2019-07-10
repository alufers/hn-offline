import { useContext } from "preact/hooks";
import ServiceWorkerClient from ".";
import ServiceWorkerClientContext from "./ServiceWorkerClientContext";

export default function useServiceWorkerClient(): ServiceWorkerClient {
  return useContext(ServiceWorkerClientContext);
}
