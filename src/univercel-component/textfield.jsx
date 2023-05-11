import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";

export default function TextFieldUnivercel({
  onChange,
  placeholder,
  requiredName,
  type,
  value,
  defaultValue,
  name,
  error,
  control,
  rules,
  onClick,
  autoFocus,
  maxLength,
  minLength,
  disabled,
  min,
  max,
  info,
  minName,
  maxName,
  minLengthName,
  maxLengthName,
  patternName,
  typeMoney,
  multiple,
}) {
  const textareaRef = useRef(null);

  const [focus, setFocus] = useState(false);
  let field = null;
  if (control && name) {
    const { field: fil } = useController({
      name,
      control,
      rules,
    });
    field = fil;
  }

  function addName(e) {
    return {
      target: {
        ...e.target,
        name,
        value: e.target.value,
      },
    };
  }

  const handleChange = (e) => {
    onChange(addName(e));
    if (field) {
      field.onChange(addName(e));
    }
  };

  const handleBlur = (e) => {
    setFocus(false);
  };

  useEffect(() => {
    const textarea = textareaRef?.current;
    if (textarea) {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.rows += 1;
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`border-[1px]  ${
          focus
            ? error
              ? "dark:border-[#f0284a]"
              : "dark:border-transparent"
            : error
            ? "dark:border-[#f0284a]"
            : "dark:border-[#3E4042] border-[#c4c6c8] hover:dark:border-[#939494] hover:border-[#999a9c]"
        } rounded-md relative ${error && "border-[#f0284a]"}`}
        style={{
          boxShadow:
            focus && error
              ? "0 0 0px 0px rgb(245, 13, 13)"
              : focus &&
                "0 0 0px 1.5px rgb(255, 255, 255), 0 0 0px 3.5px rgb(13, 94, 245)",
        }}
      >
        {type === "money" && (
          <div
            className={` ${
              error ? "text-[#f0284a]" : "text-neutral-400"
            } absolute text-sm left-3 pointer-events-none font-semibold top-[50%] translate-y-[-50%]`}
          >
            {typeMoney === "USD" ? (
              <span className="text-[17px]">$</span>
            ) : (
              <span>S/</span>
            )}
          </div>
        )}
        {type === "search" && (
          <div
            className={` ${
              error ? "text-[#f0284a]" : "text-neutral-400"
            } absolute text-sm left-3 pointer-events-none font-semibold top-[50%] translate-y-[-50%]`}
          >
            <span>
              <svg width={15} fill="currentColor" viewBox="0 0 1920 1920">
                <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"></path>{" "}
              </svg>
            </span>
          </div>
        )}
        <div className="h-full">
          {placeholder && (
            <div
              className={`${
                type === "money" || type === "search" ? "left-8" : "left-3"
              } absolute pointer-events-none ${
                focus || value !== ""
                  ? multiple
                    ? "text-[12px] pt-[7px] "
                    : "text-[12px] pt-[3px] "
                  : multiple
                  ? "text-base top-3"
                  : type === "date"
                  ? "text-[12px] pt-[3px] "
                  : "text-base top-[50%] translate-y-[-50%]"
              } ${
                focus
                  ? !error && "dark:text-blue-500 "
                  : error
                  ? "text-[#f0284a]"
                  : "dark:text-neutral-400 text-neutral-500"
              } ${error && "text-[#f0284a]"}`}
            >
              {placeholder}
            </div>
          )}
          <div className="relative">
            {multiple ? (
              <textarea
                onFocus={() => setFocus(true)}
                onClick={onClick}
                autoFocus={autoFocus}
                maxLength={maxLength}
                className={`${
                  type === "money" || type === "search" ? "pl-8" : ""
                } outline-none text-base resize-none w-full bg-transparent appearance-none px-3 dark:text-neutral-50 pt-5`}
                disabled={disabled}
                type={type ? type : "text"}
                min={min}
                max={max}
                rows="4"
                ref={textareaRef}
                value={value}
                defaultValue={defaultValue}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            ) : (
              <input
                onFocus={() => setFocus(true)}
                onClick={onClick}
                autoFocus={autoFocus}
                maxLength={maxLength}
                className={`${
                  type === "money" || type === "search" ? "pl-8" : ""
                } outline-none text-base w-full bg-transparent appearance-none h-[50px] px-3 dark:text-neutral-50 pt-2`}
                disabled={disabled}
                type={type ? type : "text"}
                min={min}
                max={max}
                value={value}
                defaultValue={defaultValue}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            )}
          </div>
        </div>
        {error && (
          <div className="pointer-events-none absolute top-[50%] translate-y-[-50%] right-3 text-red-600">
            <svg width="20" viewBox="0 0 512 512">
              <g fill="currentColor">
                <path d="M246.312928,5.62892705 C252.927596,9.40873724 258.409564,14.8907053 262.189374,21.5053731 L444.667042,340.84129 C456.358134,361.300701 449.250007,387.363834 428.790595,399.054926 C422.34376,402.738832 415.04715,404.676552 407.622001,404.676552 L42.6666667,404.676552 C19.1025173,404.676552 7.10542736e-15,385.574034 7.10542736e-15,362.009885 C7.10542736e-15,354.584736 1.93772021,347.288125 5.62162594,340.84129 L188.099293,21.5053731 C199.790385,1.04596203 225.853517,-6.06216498 246.312928,5.62892705 Z M224,272 C208.761905,272 197.333333,283.264 197.333333,298.282667 C197.333333,313.984 208.415584,325.248 224,325.248 C239.238095,325.248 250.666667,313.984 250.666667,298.624 C250.666667,283.264 239.238095,272 224,272 Z M245.333333,106.666667 L202.666667,106.666667 L202.666667,234.666667 L245.333333,234.666667 L245.333333,106.666667 Z"></path>{" "}
              </g>
            </svg>
          </div>
        )}
      </div>
      {error ? (
        <div className="text-[13px] dark:text-red-500 text-red-600">
          {error?.type === "custom" && <div>{error?.message}</div>}
          {error?.type === "min" && <div>{minName}</div>}
          {error?.type === "max" && <div>{maxName}</div>}
          {error?.type === "minLength" && <div>{minLengthName}</div>}
          {error?.type === "required" && <div>{requiredName}</div>}
          {error?.type === "maxLength" && <div>{maxLengthName}</div>}
          {error?.type === "pattern" && <div>{patternName}</div>}
        </div>
      ) : (
        info && (
          <div className="pl-1 pt-1">
            <span className="text-xs block text-gray-500 dark:text-zinc-400">
              {info}
            </span>
          </div>
        )
      )}
    </div>
  );
}
