import React from "react";
import styled from "styled-components";
import { ChangeMenu } from "../../helpers/Other";
import Aside from "../Aside/Aside";
import Nav from "../Nav/Nav";

export default function IncludeNav(props) {
  return (
    <div>
      <Nav />
      <div className="flex">
        <AsideContainer
          onClick={ChangeMenu}
          id="containerMenuAside"
          className="border-r dark:border-r-[#353636] bg-white dark:bg-[#242526] w-[300px] fixed top-[54px] z-30"
        >
          <Aside />
        </AsideContainer>
        <IframeCLose
          id="iframeCloseMenu"
          onClick={ChangeMenu}
          className="inset-2 fixed bg-transparent pointer-events-none z-[1] h-[100vh] w-full"
        />
        <Main className="pl-[300px] w-full">{props.children}</Main>
      </div>
    </div>
  );
}

const AsideContainer = styled.div`
  min-width: 300px;
  max-width: 300px;
  bottom: 0;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px !important;
    transition: 0.2s;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    transition: 0.2s;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: #bcc0c4;
  }
  @media (max-width: 1000px) {
    width: 0px;
    display: none;
    position: fixed;
  }
  &.openMenu {
    width: 100% !important;
    display: block !important;
    position: fixed !important;
    z-index: 100;
  }
`;

const Main = styled.div`
  min-height: max-content;
  @media (max-width: 1000px) {
    padding-left: 0px;
  }
`;

const IframeCLose = styled.div`
  display: none;
  @media (max-width: 1000px) {
    pointer-events: visible;
  }
  &.open {
    display: block;
  }
`;
