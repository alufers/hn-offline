import { ComponentType } from "preact";
import { Ref, useEffect, useRef } from "preact/hooks";

export default ({
  inside: Inside,
  onClickOutside,
  ...props
}: {
  inside: ComponentType<{ innerRef: Ref<HTMLElement> }>;
  onClickOutside?: (ev: MouseEvent) => void;
}) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    function handler(ev: MouseEvent) {
      if (!ref.current) {
        return;
      }

      let current = ev.target as Node;
      while (current) {
        if (current === ref.current || current.isSameNode(ref.current)) {
          return;
        }
        current = current.parentNode;
      }
      onClickOutside && onClickOutside(ev);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, null);
  return <Inside innerRef={ref} />;
};
