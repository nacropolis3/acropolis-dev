import ReactDom from "react-dom";
import styled from "styled-components";

const Modal = (props) => {
  return ReactDom.createPortal(
    <>
      {props.show && (
        <ModalContainer className="fixed inset-0 pointer-events-auto w-full h-full">
          <IframeContainer
            onClick={props.onClickIframe}
            className="fixed top-0 left-0 bg-[#ffffffc2] dark:bg-[#111111c2] w-full  "
          />
          <div className="contentmodal absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]  z-[101]">
            <ContentModal className="scrollbar-thin dark:scrollbar-thumb-[#737475bb] dark:scrollbar-track-[#318191a]  rounded-lg  overflow-y-auto ">
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
  z-index: 100;
  .contentmodal {
    @media (max-width: 700px) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transform: translateX(0);
      transform: translateY(0);
      height: 100vh;
      background: #fff;
    }
  }
`;
const IframeContainer = styled.div`
  z-index: 100;
  height: 100vh;

  @media (max-width: 700px) {
    /* background-color: #ffffff; */
  }
  /* backdrop-filter: blur(1px); */
`;
const ContentModal = styled.div`
  max-height: 95vh;
  max-width: 95vh;
  overflow: hidden;
  &:hover {
    overflow: overlay;
  }
  height: max-content;
  @media (max-width: 700px) {
    background-color: #fff;
    max-height: 100vh;
    height: 100vh;
  }
  @media (min-width: 700px) {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 100px 10px;
  }
`;

export default Modal;
