import { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";

const MenuComponent = (props) => {

  const [left, setLeft] = useState(null);
  const [top, setTop] = useState(null);
  const [bott, setbott] = useState(null);

  const [width, setWidth] = useState(null);
  const [heigth, setHeigth] = useState(null);

  const [position, setPosition] = useState("bottom");

  const [heigthMenu, setHeigthMenu] = useState(null);

  const menuRef = useRef();

  const handleResize = () => {
    const position = props.inputRef?.current?.getBoundingClientRect();
    const positionOffse = props.inputRef?.current;
    setLeft(position?.left);
    setTop(position?.top);
    setbott(position?.bottom);
    setWidth(positionOffse?.offsetWidth);
    setHeigth(positionOffse?.offsetHeight);
  };

  useEffect(() => {
    if (bott) {
      const Heigth = document?.documentElement.clientHeight - bott;
      setHeigthMenu(Heigth);
      if (Heigth < 300) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [bott]);

  useEffect(() => {
    if (props.inputRef) {
      handleResize();
    }
  }, [props.inputRef?.current?.getBoundingClientRect()]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    const modalContainer = document.getElementById("modal");
    modalContainer?.addEventListener("scroll", function (e) {
      handleResize();
    });
  }, []);

  return ReactDom.createPortal(
    props.show && (
      <div
        ref={menuRef}
        style={{
          top: position === "bottom" ? top + heigth + 5 : "auto",
          bottom: position === "top" ? heigthMenu + heigth + 5 : 0,
          left,
          width,
          maxHeight: position === "top" ? 280 : 280,
        }}
        className="absolute h-max rounded-lg shadow-black/50 dark:bg-[#373737]/80 bg-[#fffdfd]/50 border border-neutral-600/10 backdrop-blur-xl z-40 shadow-2xl"
      >
        <div
          style={{
            height: "inherit",
            maxHeight: "inherit",
            overflow: "overlay",
          }}
          className='hover:scrollbar-thin overflow-y-auto '
        >
          {props.children}
        </div>
      </div>
    ),
    document.getElementById("menu-component-container")
  );
};

export default MenuComponent;
