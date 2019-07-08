import useRouter from "./useRouter";
import { useEffect, useState } from "preact/hooks";

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
