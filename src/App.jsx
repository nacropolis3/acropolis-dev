import { useEffect, useState } from "react";
import RouteApp from "./route/Route";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="min-h-[100vh] dark:bg-[#18191a] ">
      <RouteApp />
      <div id="menu-component-container" className=""></div>
      <div className="" id="modal"></div>
      <div id="PDFContainer"></div>
      <div className="w-full h-full relative pointer-events-none" id="contextmenu"></div>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="w-full h-full relative pointer-events-none" id="loader_full"></div>
    </div>
  );
}

export default App;
