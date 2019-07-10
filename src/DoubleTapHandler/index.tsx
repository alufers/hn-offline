import { Attributes, ComponentType } from "preact";
import { useState } from "preact/hooks";

const DOUBLE_TAP_DURATION = 500;

interface WithTouchEvents {
  onTouchEnd: (ev: TouchEvent) => void;
}

interface DoubleTapHandlerProps {
  [k: string]: any;
  component: ComponentType<WithTouchEvents>;
  onDoubleTap: (ev: TouchEvent) => void;
}
/**
 * Detects double taps on mobile devices.
 * @param param0 props
 */
export default function DoubleTapHandler({
  component: Component,
  onDoubleTap,
  ...props
}: DoubleTapHandlerProps) {
  const [lastTap, setLastTap] = useState<number>(null);

  const onTouchEnd = (ev: TouchEvent) => {
    if (lastTap && new Date().getTime() - lastTap < DOUBLE_TAP_DURATION) {
      setLastTap(null);
      onDoubleTap && onDoubleTap(ev);
    }
    setLastTap(new Date().getTime());
  };
  return <Component onTouchEnd={onTouchEnd} {...props} />;
}
