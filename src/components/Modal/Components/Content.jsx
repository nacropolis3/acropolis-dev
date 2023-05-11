import React from "react";
import styled from "styled-components";

export default function ContentModal(props) {
  return (
    <StyledModal
      className="bg-[#fff] dark:bg-[#292a2b] rounded-xl overflow-hidden"
      style={{
        maxWidth: props.width,
      }}
    >
      {props.children}
    </StyledModal>
  );
}
export const StyledModal = styled.div`
  @media (max-width: 700px) {
    width: 100% !important;
  }
`;
