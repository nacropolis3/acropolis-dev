import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ShadowRolling from "../Loader/ShadowRolling";

export default function PrimaryButton(props) {
  const { type, disabled, size, children, onClick, to, iconLeft, iconRigth } =
    props;

  const Container = ({ children }) => {
    if (to) {
      return <Link to={to}>{children}</Link>;
    } else {
      return <>{children}</>;
    }
  };

  return (
    <ContainerButton>
      <Container>
        <div
          role="button"
          tabIndex="0"
          style={{
            boxShadow: props.shadow && "0px 2px 10px .5px #182c2e13",
            width: props.width ? props.width : "auto",
            borderRadius: props.rounded ? props.rounded : "auto",
          }}
          tooltip={props.tooltip ? props.tooltip : null}
          onKeyDown={!disabled && !props.loading ? onClick : null}
          onClick={!disabled && !props.loading ? onClick : null}
          className={`h-[43px] flex gap-1 items-center font-semibold justify-center  ${
            type && type
          } ${disabled || props.loading ? "disable-button" : ""} ${
            size ? size : ""
          } py-[7px] ${
            props.type === "error" &&
            "bg-[#d4504c46] text-[#ff6767] hover:bg-[#d4504c69] hover:text-[#ff6767]"
          } ${
            props.type === "default" &&
            "dark:bg-transparent border text-base dark:border-neutral-700 hover:dark:bg-neutral-800 dark:text-neutral-50 bg-[#ffffff] border-[#d3d5d6] text-[#151516] hover:bg-[#ecedf0]"
          }  `}
        >
          {props.loading ? (
            <div>
              <ShadowRolling />
            </div>
          ) : (
            <>
              {props.image && (
                <Image>
                  <img src={props.image} alt="" />
                </Image>
              )}
              {iconLeft && iconLeft}
              {children}
              {iconRigth && (
                <span
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  {iconRigth}
                </span>
              )}
            </>
          )}
        </div>
      </Container>
    </ContainerButton>
  );
}

const ContainerButton = styled.div`
  > a,
  div {
    display: flex;
    justify-content: center;
    transition: 0.1s;
    border-radius: 6px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-decoration: none;
    > div {
      min-width: 100%;
    }
    /* &:hover {
      background-color: rgba(145, 145, 145, 0.1);
    } */
    svg {
      max-width: 20px;
      max-height: 20px;
    }
    span {
      svg {
        width: 20px;
        height: 20px;
        max-width: 20px;
        max-height: 20px;
      }
    }
    &:active {
      /* transform: scale(0.98); */
    }
  }
  a:hover {
    color: #070707 !important;
  }
  .primary {
    background: #007c48;
    color: #ffffff;
    &:hover {
      background: #007c48;
    }
  }
  .primary_transparent {
    background: #099b6329;
    color: #007c48;
    &:hover {
      background: #0aa86c52;
    }
  }
  .primary-strong {
    background: #fab216;
    border: 1px solid #fab216;
    color: #000000;
    &:hover {
      background: #e6a415;
      border: 1px solid #fab216;
    }
  }

  .disable-button {
    cursor: no-drop;
    opacity: 0.5;
  }
  .small {
    height: 25px;
    svg {
      max-width: 15px;
      max-height: 15px;
    }
  }
`;
const Image = styled.figure`
  width: 25px;
  margin-right: auto;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;
