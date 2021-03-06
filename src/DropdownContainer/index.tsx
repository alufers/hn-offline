import { ComponentChildren, ComponentType } from "preact";
import { Ref, useState } from "preact/hooks";
import ClickOutside from "../ClickOutside";
import "./style.less";

export default ({
  children,
  trigger: Trigger
}: {
  children?: ComponentChildren;
  trigger: ComponentType<{
    onClick?: Function;
  }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const inside = ({ innerRef }: { innerRef: Ref<HTMLElement> }) =>
    isOpen && (
      <div
        styleName="wrapper"
        ref={innerRef}
        onClick={(ev: MouseEvent) => ev.stopPropagation()}
      >
        <div styleName="dropdown">
          <div styleName="content">{children}</div>
        </div>
      </div>
    );
  return (
    <>
      <Trigger onClick={() => setTimeout(() => setIsOpen(!isOpen), 1)} />
      <ClickOutside inside={inside} onClickOutside={() => setIsOpen(false)} />
    </>
  );
};
