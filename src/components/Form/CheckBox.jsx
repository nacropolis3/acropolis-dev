import React from "react";
import styled from "styled-components";

export default function CheckBox(props) {
  return (
    <CheckBoxContainer className="flex">
      <label className="flex" tooltip={props.tooltip ? props.tooltip : null}>
        <div
          className={`${
            props.disabled ? "cursor-default opacity-50" : ""
          } container flex gap-1 `}
        >
          <div className={"controlform flex items-center"}>
            <input
              type="checkbox"
              disabled={props.disabled}
              onChange={(e) => {
                props.onChange ? props.onChange(e) : null;
              }}
              value={props.value}
              className="checkbox"
              defaultChecked={props.defaultChecked}
              name={props.name}
              checked={props.checked}
            />
            <div
              onKeyPress={
                !props.disabled && !props.loading ? props.onChange : null
              }
              role="checkbox"
              tabIndex="0"
              className="checkmark"
            >
              <div className="circule">
                {props.icon ? (
                  <>{props.icon}</>
                ) : (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{
                      strokeWidth: ".5px",
                    }}
                  >
                    <g>
                      <polygon points="9.707 14.293 19 5 20.414 6.414 9.707 17.121 4 11.414 5.414 10"></polygon>{" "}
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
          {props.text && (
            <div className={`font-normal flex items-center text-base ${props.checked ? " text-green-700 dark:text-green-500" : "text-zinc-800 dark:text-zinc-400"}`}>
              <span>{props.text}</span>
            </div>
          )}
        </div>
      </label>
    </CheckBoxContainer>
  );
}
const CheckBoxContainer = styled.div`
  label {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    .container {
      transition: 0.1s;
      &:hover {
      }
      .text_descrip {
        h5 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }
        span {
          font-size: 14px;
          color: #e9a528;
        }
      }
      .controlform {
        input {
          display: none;
          opacity: 0;
          &:checked ~ .checkmark {
            border-color: #088a3e;
            .circule {
              color: #088a3e;
            }
          }
        }
        .checkmark {
          height: 20px;
          width: 20px;
          border: 1px solid #949898;
          box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1) inset;
          border-radius: 4px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.1s;
          color: #fff;
          &:hover {
            border: 1px solid #c2c2c2;
          }
          &:active {
            transform: scale(0.98);
          }
          .circule {
            color: transparent;
            width: 18px;
            height: 17px;
          }
        }
      }
    }
  }
`;
