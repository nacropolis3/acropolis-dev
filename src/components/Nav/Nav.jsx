import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";
import { ChangeMenu } from "../../helpers/Other";
import useDarkMode from "../../hooks/useDarkMode";
import Dropdown from "../Dropdown/Dropdown";
import ButtonNav from "./Components/ButtonNav";

export default function Nav() {
  const { logout } = useAuth();
  const { userData } = useUser();

  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  const navigate = useNavigate();

  const traduction = {
    Owner: {
      spanish: "Dueño",
    },
    Admin: {
      spanish: "Administrador",
    },
    EconomyArea: {
      spanish: "Area de Economia",
    },
    Member: {
      spanish: "Miembro",
    },
  };

  const logoutHandle = () => {
    navigate("/");
    logout();
  };

  const handleOpenCloseMenu = () => {
    ChangeMenu();
  };

  return (
    <Container className="w-full z-30 top-0 border-b bg-[#ffffff] dark:border-b-[#353636] px-[9px] py-[7px]  dark:bg-[#242526] sticky">
      <div className="">
        <div className="flex w-full gap-5">
          <Left>
            <div
              id="menu-id"
              onClick={handleOpenCloseMenu}
              className="w-7 hidden cursor-pointer"
            >
              <svg viewBox="0 0 48 48" fill="#000000">
                <g>
                  <circle cx="24" cy="24" r="5"></circle>
                  <circle cx="9" cy="24" r="5"></circle>
                  <circle cx="39" cy="24" r="5"></circle>
                  <circle cx="24" cy="39" r="5"></circle>
                  <circle cx="9" cy="39" r="5"></circle>
                  <circle cx="39" cy="39" r="5"></circle>
                  <circle cx="24" cy="9" r="5"></circle>
                  <circle cx="9" cy="9" r="5"></circle>
                  <circle cx="39" cy="9" r="5"></circle>
                </g>
              </svg>
            </div>
            <Link className="flex items-center gap-2" to="/">
              <img
                style={{
                  filter: "brightness(1.1)",
                  mixBlendMode: "multiply",
                }}
                src="assets/banner.png"
                width={280}
                alt=""
              />

            </Link>
          </Left>
          <Center>
            <div>{/* <SearshButton /> */}</div>
          </Center>
          <Rigth>
            <Dropdown
              button={
                <div className="relative mr-1">
                  <ButtonNav
                    // onClick={logoutHandle}
                    tooltip="Cuenta"
                    type="default"
                    // public_id={userData && userData.images.public_id}
                    image={userData.photoUrl}
                  />
                  <div className="pointer-events-none absolute bottom-0 right-0 w-4 bg-black rounded-full text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="icon-stroke"
                    >
                      <g id="SVGRepo_iconCarrier">
                        <path
                          strokeWidth="4"
                          d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                </div>
              }
            >
              <div className="p-2 w-[320px] border dark:border-neutral-700 mt-2 bg-white dark:bg-neutral-800 dark:text-neutral-50 shadow-sm rounded-lg flex flex-col gap-[2px]">
                <div className="mb-1">
                  <div className="p-2 shadow-sm border dark:border-neutral-700 rounded-lg flex gap-2 items-center">
                    <div className="border rounded-full border-neutral-300">
                      <img
                        src={userData.photoUrl}
                        width="40"
                        className="rounded-full"
                        height="40"
                        alt=""
                      />
                    </div>
                    <div>
                      <h1 className="font-semibold text-base tracking-tight leading-4 ">
                        {userData.name}
                      </h1>
                      <span className="flex leading-4 text-xs text-neutral-500">
                        {traduction[userData.role].spanish}
                      </span>
                    </div>
                  </div>
                </div>
                <div tooltip="Disponible pronto">
                  <div className="opacity-50 cursor-default hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg py-[6px] px-1 font-semibold text-sm flex items-center gap-2">
                    <div className="w-8  p-[5px] bg-neutral-200 rounded-full">
                      <svg viewBox="0 0 24 24" fill="none">
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                            fill="#292D32"
                          ></path>
                          <path
                            d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                            fill="#292D32"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <span>Mi perfil</span>
                  </div>
                </div>
                <div>
                  <div
                    tabIndex="0"
                    role="button"
                    onClick={() => toggleDarkMode(false)}
                    className=" hover:bg-neutral-100 dark:hover:bg-neutral-700   rounded-lg py-[6px] px-1 font-semibold cursor-pointer text-sm flex items-center gap-2"
                  >
                    <div className="w-8  p-[5px] bg-neutral-200 rounded-full dark:bg-neutral-700 dark:text-neutral-300 ">
                      <svg viewBox="0 0 24 24" fill="none">
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M21.5287 15.9294C21.3687 15.6594 20.9187 15.2394 19.7987 15.4394C19.1787 15.5494 18.5487 15.5994 17.9187 15.5694C15.5887 15.4694 13.4787 14.3994 12.0087 12.7494C10.7087 11.2994 9.90873 9.40938 9.89873 7.36938C9.89873 6.22938 10.1187 5.12938 10.5687 4.08938C11.0087 3.07938 10.6987 2.54938 10.4787 2.32938C10.2487 2.09938 9.70873 1.77938 8.64873 2.21938C4.55873 3.93938 2.02873 8.03938 2.32873 12.4294C2.62873 16.5594 5.52873 20.0894 9.36873 21.4194C10.2887 21.7394 11.2587 21.9294 12.2587 21.9694C12.4187 21.9794 12.5787 21.9894 12.7387 21.9894C16.0887 21.9894 19.2287 20.4094 21.2087 17.7194C21.8787 16.7894 21.6987 16.1994 21.5287 15.9294Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <span>
                      Modo Oscuro{" "}
                      {colorTheme === "dark" ? "(Desactivado)" : "(Activado)"}
                    </span>
                  </div>
                </div>
                <div
                  onClick={logoutHandle}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-700  rounded-lg py-[6px] px-1 font-semibold cursor-pointer text-sm flex items-center gap-2"
                >
                  <div className="w-8  p-[2px] bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 rounded-full">
                    <svg viewBox="0 0 24 24" fill="none">
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M7.87828 12.07C7.87828 11.66 8.21828 11.32 8.62828 11.32H14.1083V2.86C14.0983 2.38 13.7183 2 13.2383 2C7.34828 2 3.23828 6.11 3.23828 12C3.23828 17.89 7.34828 22 13.2383 22C13.7083 22 14.0983 21.62 14.0983 21.14V12.81H8.62828C8.20828 12.82 7.87828 12.48 7.87828 12.07Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M20.5416 11.5402L17.7016 8.69016C17.4116 8.40016 16.9316 8.40016 16.6416 8.69016C16.3516 8.98016 16.3516 9.46016 16.6416 9.75016L18.2016 11.3102H14.1016V12.8102H18.1916L16.6316 14.3702C16.3416 14.6602 16.3416 15.1402 16.6316 15.4302C16.7816 15.5802 16.9716 15.6502 17.1616 15.6502C17.3516 15.6502 17.5416 15.5802 17.6916 15.4302L20.5316 12.5802C20.8316 12.3002 20.8316 11.8302 20.5416 11.5402Z"
                          fill="currentColor"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <span>Cerrar Sesión</span>
                </div>
                <div className="text-xs py-1 ml-2 text-neutral-500">
                  Power by Univercel
                </div>
              </div>
            </Dropdown>
          </Rigth>
        </div>
      </div>
    </Container>
  );
}


const H1LogoName = styled.h1`
  letter-spacing: -1px;
  font-size: 25px;
`;
const ContainerSearsh = styled.div``;
const Content = styled.div`
  input {
    padding-left: 35px;
    transition: 0.2s;
    &::placeholder {
      color: #5e5e5e;
    }
    &:focus ~ .icnser {
      width: 0px;
      opacity: 0;
      overflow: hidden;
    }
  }
`;
const IconSearsh = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.2s;
  opacity: 1;
  svg {
    width: 17px;
    height: 17px;
  }
`;
const Container = styled.div`
  backdrop-filter: blur(10px);
`;
const Left = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1000px) {
    #menu-id {
      display: block;
    }
  }
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Rigth = styled.div`
  margin-left: auto;
  display: flex;
  align-self: center;
  gap: 7px;
`;
const SpanVerfify = styled.div`
  width: 25px;
  height: 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 100%;
    height: 100%;
    color: #080808;
  }
`;
