import React from "react";
import { useToggle } from "../../hooks/useToggle";

export default function Dropdown(props) {
  const [show, setShow] = useToggle(false);
  return (
    <div className="z-30">
      <div className="" onClick={() => setShow(!show)}>{props.button}</div>
      {show && (
        <>
          <div
            onClick={() => setShow(!show)}
            className="fixed z-[120] cursor-default top-0 left-0 w-full h-[100vh] "
          ></div>
          <div onClick={() => setShow(!show)} className="z-[129] absolute right-2">
            {props.children}
          </div>
        </>
      )}
    </div>
  );
}
