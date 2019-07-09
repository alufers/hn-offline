import { ComponentChildren, Attributes } from "preact";
import useRouter from "./useRouter";
import useCompiledPathRegexp from "./useCompiledPathRegexp";
import useLocation from "./useLocation";

export default ({
  to,
  exact,
  activeCx,
  children,
  ...props
}: {
  to: string;
  exact?: boolean;
  activeCx?: string;
  children?: ComponentChildren;
  [x: string]: any;
} & Attributes) => {
  const router = useRouter();
  const location = useLocation();
  const [pathRegexp] = useCompiledPathRegexp(to, exact);
  let active = !!location.pathname.match(pathRegexp);
  const handleClick = (ev: MouseEvent) => {
    ev.preventDefault();
    router.push(to);
  };
  let classN = (props as any).class as string;
  if (active) {
    classN += " " + activeCx;
  }
  return (
    <a onClick={handleClick} href={to} class={classN} {...props}>
      {children}
    </a>
  );
};
