import useLocation from "./useLocation";
import useRouter from "./useRouter";
import { ComponentType, Attributes } from "preact";
import { useMemo, useContext } from "preact/hooks";
import ParamsContext from "./ParamsContext";
import useCompiledPathRegexp from "./useCompiledPathRegexp";

export default ({
  path,
  component: Component,
  exact = false
}: {
  path: string;
  component: ComponentType;
  exact?: boolean;
} & Attributes) => {
  const location = useLocation();
  const [pathRegexp, paramMapping] = useCompiledPathRegexp(path, exact);
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
