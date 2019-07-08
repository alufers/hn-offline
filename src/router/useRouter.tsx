import { useContext } from "preact/hooks";
import RouterContext from "./RouterContext";

export default function useRouter() {
  return useContext(RouterContext);
}
