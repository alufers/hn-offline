import useLocation from "./useLocation";
import useRouter from "./useRouter";
import { ComponentType } from "preact";
import { useMemo, useContext } from "preact/hooks";
import ParamsContext from "./ParamsContext";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export default ({
  path,
  component: Component,
  exact = false
}: {
  path: string;
  component: ComponentType;
  exact?: boolean;
}) => {
  const location = useLocation();
  const [pathRegexp, paramMapping] = useMemo(() => {
    const mapping = {};
    let groupIndex = 1;
    let pattern = path
      .split("/")
      .map(segment => {
        if (segment.startsWith(":")) {
          mapping[segment.substr(1)] = groupIndex;
          groupIndex++;
          // is a parameter
          return "([A-Za-z0-9\\-_]+)";
        }
        return escapeRegExp(segment);
      })
      .join("\\/");
    if (exact) {
      pattern += "$";
    }
    return [new RegExp(pattern, "i"), mapping];
  }, [path, exact]);
  const match = useMemo(() => location.pathname.match(pathRegexp), [location]);
  const previousParams = useContext(ParamsContext);
  const params = useMemo(() => {
    if (!match) {
      return previousParams;
    }
    const newParams = { ...previousParams };
    for (let key of Object.keys(paramMapping)) {
      newParams[key] = match[paramMapping[key]];
    }
    return newParams;
  }, [match, paramMapping, previousParams]);
  if (!match) {
    return null;
  }
  return (
    // @ts-ignore
    <ParamsContext.Provider value={params}>
      <Component />
    </ParamsContext.Provider>
  );
};
