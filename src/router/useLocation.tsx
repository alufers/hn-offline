import { useEffect, useState } from "preact/hooks";
import useRouter from "./useRouter";

export default function useLocation() {
  const router = useRouter();
  const [location, setLocation] = useState(router.url);
  useEffect(() => {
    return router.subscribe(newLocation => {
      setLocation(newLocation);
    });
  }, [router]);
  return location;
}
