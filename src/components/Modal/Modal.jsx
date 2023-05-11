import { useEffect } from "react";
import ReactDom from "react-dom";
import styled from "styled-components";
import { disabledScroll, enabledScroll } from "../../utils/scrollbar";

const Modal = (props) => {
  useEffect(() => {
    if (props.show) {
      disabledScroll();
    } else {
      enabledScroll();
    }
  }, [props.show]);
  return ReactDom.createPortal(
    <>
      {props.show && (
        <ModalContainer className="z-40">
          <IframeContainer
            onClick={props.onClickIframe}
            className="fixed top-0 left-0  bg-[#dedede76] dark:bg-[#11111170] w-full z-30"
          />
          <div className="contentmodal fixed overflow-y-auto top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-30">
            <ContentModal className="shadow-2xl  overflow-hidden rounded-xl hover:scrollbar-thin dark:scrollbar-thumb-[#737475bb] dark:scrollbar-track-[#318191a] overflow-y-auto ">
              {props.children}
            </ContentModal>
          </div>
        </ModalContainer>
      )}
    </>,
    document.getElementById("modal")
  );
};

const ModalContainer = styled.div`
  .contentmodal {
    @media (max-width: 700px) {
      top: 0;
      left: 0;
      width: 100%;
      transform: translateX(0);
      transform: translateY(0);
      background: #fff;
    }
  }
`;
const IframeContainer = styled.div`
  height: 100vh;
  @media (max-width: 700px) {
    /* background-color: #ffffff; */
  }
`;
const ContentModal = styled.div`
  max-height: 95vh;
  overflow: hidden;
  &:hover {
    overflow: overlay;
  }
  height: max-content;
  @media (max-width: 700px) {
    background-color: #fff;
    max-height: 100%;
  }
`;

export default Modal;
