import { useMemo } from "preact/hooks";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export default (
  path: string,
  exact: boolean
): [RegExp, { [key: string]: string }] => {
  return useMemo(() => {
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
};
