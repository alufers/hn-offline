import { useParam } from "../router";
import LoadingPlaceholder from "../ItemHead/LoadingPlaceholder";

export default () => {
  const id = useParam("id");
  return (
    <div>
      <LoadingPlaceholder />
    </div>
  );
};
