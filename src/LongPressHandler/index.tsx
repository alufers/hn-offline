import { Attributes, ComponentType } from "preact";
import { useState } from "preact/hooks";

const LONGPRESS_DURATION = 500;

interface WithTouchEvents {
  onTouchStart: (ev: TouchEvent) => void;
  onTouchMove: (ev: TouchEvent) => void;
  onTouchEnd: (ev: TouchEvent) => void;
}

interface LongPressHandlerProps {
  [k: string]: any;
  component: ComponentType<WithTouchEvents>;
  onLongPress: (ev: TouchEvent) => void;
}
/**
 * Detects longpresses on mobile devices.
 * @param param0 props
 */
export default function LongPressHandler<CP extends WithTouchEvents>({
  component: Component,
  onLongPress,
  ...props
}: LongPressHandlerProps) {
  const [timer, setTimer] = useState<any>(null);
  const [shouldEmitAfterEnd, setShouldEmitAfterEnd] = useState<boolean>(false);
  const onTouchStart = (ev: TouchEvent) => {
    setTimer(
      setTimeout(() => {
        setShouldEmitAfterEnd(true);
      }, LONGPRESS_DURATION)
    );
  };
  const onTouchMove = (ev: TouchEvent) => {};
  const onTouchEnd = (ev: TouchEvent) => {
    if (shouldEmitAfterEnd) {
      setShouldEmitAfterEnd(false);
      onLongPress && onLongPress(ev);
    }
    clearTimeout(timer);
  };
  return (
    <Component
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...props}
    />
  );
}
