import useLocation from "./useLocation";
import useRouter from "./useRouter";

export default () => {
  const location = useLocation();
  const router = useRouter();
  return (
    <button onClick={() => router.push("/" + Math.random())}>
      {" "}
      LOC:{location.pathname}
    </button>
  );
};
