import { useContext } from "preact/hooks";
import ParamsContext from "./ParamsContext";

export default (paramName: string) => {
  const paramsContext = useContext(ParamsContext);
  if (!paramsContext) {
    return null;
  }
  return paramsContext[paramName] || null;
};
