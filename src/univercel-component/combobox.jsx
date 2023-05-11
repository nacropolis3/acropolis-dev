import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import MenuComponent from "./portal";

const Icon = () => {
  return (
    <svg
      className="text-neutral-800 dark:text-neutral-100"
      width="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

const ComboboxUnivercel = ({
  control,
  value,
  placeHolder,
  options,
  isMulti,
  info,
  name,
  error,
  onChange,
  rules,
  type,
  requiredName,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef();
  const inputRef = useRef();
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

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  useEffect(() => {
    let newValue = null;
    const data = [];
    options.forEach((option) => {
      option.data.forEach((value) => {
        data.push(value);
      });
    });

    data.forEach((option) => {
      if (option.value === value) {
        newValue = option;
      }
    });
    setSelectedValue(newValue);
  }, [value, options]);

  const handleInputClick = (e) => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return null;
    }

    return selectedValue.name;
  };

  const onItemClick = (option) => {
    const newValue = option.value;
    setSelectedValue(option);
    onChange({
      target: {
        value: newValue,
        name,
      },
    });
    if (field) {
      field.onChange({
        value: newValue,
        name,
      });
    }
  };

  const isSelected = (option) => {
    if (isMulti) {
      return selectedValue.filter((o) => o.value === option.value).length > 0;
    }

    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    const data = [];
    let resultSearsh = [];
    options.forEach((option) => {
      option.data.forEach((value) => {
        data.push(value);
      });
    });

    resultSearsh = data.filter(
      (option) =>
        option.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );

    return [
      {
        title: 'Resultados: "' + searchValue + '"',
        icon: "searsh.png",
        data: resultSearsh,
      },
    ];
  };

  return (
    <div className="dropdown-container">
      <div
        aria-haspopup="true"
        aria-expanded={!!focus}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={`h-[50px] border-[1px]  ${
          focus
            ? error
              ? "dark:border-[#f0284a]"
              : "dark:border-transparent"
            : error
            ? "dark:border-[#f0284a]"
            : "dark:border-[#3E4042] border-[#c4c6c8] hover:dark:border-[#939494] hover:border-[#999a9c]"
        }  rounded-lg relative ${error && "border-[#f0284a]"}`}
        style={{
          boxShadow:
            focus && error
              ? "0 0 0px 0px rgb(245, 13, 13)"
              : focus &&
                "0 0 0px 1.5px rgb(255, 255, 255), 0 0 0px 3.5px rgb(13, 94, 245)",
        }}
        role="button"
        tabIndex="0"
        ref={inputRef}
        onClick={handleInputClick}
        onKeyPress={handleInputClick}
      >
        <div className="flex items-center h-11 px-2">
          {placeHolder && (
            <span
              className={`${
                type === "money" ? "left-8" : "left-3"
              } absolute pointer-events-none ${
                value !== ""
                  ? "text-[12px] top-[3px] "
                  : "text-base top-[50%] translate-y-[-50%]"
              } ${
                focus
                  ? !error && "dark:text-blue-500 "
                  : error
                  ? "text-[#f0284a]"
                  : "dark:text-neutral-400"
              } ${error && "text-[#f0284a]"}`}
            >
              {placeHolder}
            </span>
          )}
          <div className="dark:text-neutral-50 text-base mt-4 ml-1">
            {selectedValue && selectedValue.name}
          </div>
          {error && (
            <div className="pointer-events-none absolute top-[50%] translate-y-[-50%] right-7 text-red-600">
              <svg width="20" viewBox="0 0 512 512">
                <g fill="currentColor">
                  <path d="M246.312928,5.62892705 C252.927596,9.40873724 258.409564,14.8907053 262.189374,21.5053731 L444.667042,340.84129 C456.358134,361.300701 449.250007,387.363834 428.790595,399.054926 C422.34376,402.738832 415.04715,404.676552 407.622001,404.676552 L42.6666667,404.676552 C19.1025173,404.676552 7.10542736e-15,385.574034 7.10542736e-15,362.009885 C7.10542736e-15,354.584736 1.93772021,347.288125 5.62162594,340.84129 L188.099293,21.5053731 C199.790385,1.04596203 225.853517,-6.06216498 246.312928,5.62892705 Z M224,272 C208.761905,272 197.333333,283.264 197.333333,298.282667 C197.333333,313.984 208.415584,325.248 224,325.248 C239.238095,325.248 250.666667,313.984 250.666667,298.624 C250.666667,283.264 239.238095,272 224,272 Z M245.333333,106.666667 L202.666667,106.666667 L202.666667,234.666667 L245.333333,234.666667 L245.333333,106.666667 Z"></path>{" "}
                </g>
              </svg>
            </div>
          )}
          <div className="ml-auto">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
        </div>
      </div>
      <MenuComponent show={showMenu} inputRef={inputRef}>
        <div className="p-2 w-full block">
          {/* <div className="search-box  h-0 opacity-0">
            <input
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              className="pointer-events-none hover:bg-neutral-700 focus:border-blue-500 text-sm text-neutral-50 bg-neutral-800 outline-none rounded-md pl-2 pt-2 pr-2 pb-2 w-full"
              onChange={onSearch}
              value={searchValue}
              placeholder="Buscar"
              ref={searchRef}
            />
          </div> */}
          <ul>
            {getOptions().length > 0 &&
              getOptions().map((option, index) => (
                <li className="w-full block" key={index}>
                  {option.title && (
                    <div
                      className={
                        "pointer-events-none flex items-center gap-2 rounded-md pl-0 pr-2 "
                      }
                    >
                      {option.icon && (
                        <div className="w-3 h-3 rounded-full p-[5px] bg-black/50">
                          <img src={"/icons-solid/" + option.icon} alt="" />
                        </div>
                      )}
                      <div className=" py-1 px-1 text-sm dark:text-neutral-300">
                        {option.title}
                      </div>
                    </div>
                  )}
                  <ul className="flex flex-col" role="tablist" id="list">
                    {option.data &&
                      option.data.map((item, i) => (
                        <li
                          role="tab"
                          aria-selected="true"
                          id={`tab-${i}`}
                          onClick={() => onItemClick(item)}
                          onKeyPress={() => {
                            onItemClick(item);
                            setShowMenu(false);
                          }}
                          autoFocus={!!isSelected(item)}
                          key={i}
                          tabIndex="0"
                        >
                          <div
                            className={`${
                              isSelected(item) &&
                              " dark:hover:bg-neutral-700 dark:text-neutral-50"
                            } flex cursor-pointer dark:hover:bg-neutral-700/60  hover:bg-neutral-200 rounded-md ${
                              option.title ? "pt-1 pb-1" : "pt-1 pb-1"
                            } pl-2 pr-2 flex items-center`}
                          >
                            {option.title && (
                              <div className="w-5 min-w-5 flex items-center justify-center mr-1"></div>
                            )}
                            {item.icon && (
                              <div
                                className={`${
                                  isSelected(item)
                                    ? "text-blue-500"
                                    : "text-neutral-300"
                                } w-[33px] min-w-[33px] bg-neutral-800 rounded-full p-[6px] mr-1`}
                              >
                                {item.icon}
                              </div>
                            )}
                            <div className=" my-1 text-sm dark:text-neutral-100">
                              <span
                                className={`${
                                  isSelected(item) ? "font-semibold" : ""
                                }`}
                              >
                                {item.name}
                              </span>
                              {item.description && (
                                <div className="text-xs tracking-tight flex leading-4 dark:text-neutral-400 w-full">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div className="ml-auto pl-2">
                              <div
                                className={`w-[20px] h-[20px] flex items-center justify-center border ${
                                  isSelected(item)
                                    ? "border-blue-500 "
                                    : "border-neutral-500 "
                                } rounded-full`}
                              >
                                {isSelected(item) && (
                                  <div className="w-[12px] h-[12px] bg-blue-600 rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      </MenuComponent>
      {error ? (
        <div className="text-[13px] dark:text-red-500 text-red-500">
          {error?.type === "custom" && <div>{error?.message}</div>}
          {error?.type === "required" && <div>{requiredName}</div>}
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
};

export default ComboboxUnivercel;
