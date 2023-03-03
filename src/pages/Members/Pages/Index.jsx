import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { orderBy, where } from "firebase/firestore";
import styled from "styled-components";
import ContentModal from "../../../components/Modal/Components/Content";
import { HeaderModal } from "../../../components/Modal/Components/Header";
import BodyModal from "../../../components/Modal/Components/Main";
import Modal from "../../../components/Modal/Modal";
import { useUser } from "../../../context/userContext";
import {
  converterDate,
  FormatDate,
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../../helpers/moment";
import { converterNumberAtPricePeru } from "../../../helpers/pricing";

import {
  getDataGeadquartersService,
  getDataGroupsService,
} from "../../../services/Data/DataServices";
import {
  getMembersService,
  updateMemberService,
} from "../../../services/Member/MemberServices";
import FormMember from "../Components/FormMember";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import ReactSelect from "react-select";
import {
  concatString,
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../../helpers/Other";

export default function Members() {
  const { userData } = useUser();
  const [modalAdd, setModalAdd] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [memberSelected, setMemberSelected] = useState(null);

  const [groups, setGroups] = useState(null);
  const [members, setMembers] = useState(null);
  const [geadquarters, setGeadquarters] = useState(null);

  const [conditions, setConditions] = useState([]);

  const [groupWhere, setGroupWhere] = useState(null);
  const [geadquarterWhere, setGeadquarterWhere] = useState(null);
  const [statuWhere, setStatuWhere] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [data, setData] = useState({
    uidGroup: null,
    uidConcept: null,
    uidGeadquarter: null,
    startDate: null,
    endDate: null,
    statu: null,
  });

  // useEffect(() => {
  //   let newCon = [];
  //   if (startDate != null) {
  //     newCon.push(where("created_at", ">", converterDate(startDate)));
  //   }
  //   getMembersService(setMembers, newCon);
  // }, [startDate]);

  // useEffect(() => {
  //   let newCon = [];
  //   if (endDate != null) {
  //     newCon.push(where("created_at", "<", converterDate(endDate)));
  //   }
  //   getMembersService(setMembers, newCon);
  // }, [endDate]);

  // useEffect(() => {
  //   let newCon = [];
  //   if (statuWhere != null) {
  //     newCon.push(where("statu", "==", statuWhere));
  //     newCon.push(orderBy("created_at", "desc"));
  //   }
  //   getMembersService(setMembers, newCon);
  // }, [statuWhere]);

  // useEffect(() => {
  //   let newCon = [];
  //   if (groupWhere != null) {
  //     newCon.push(where("groupUid", "==", groupWhere));
  //   }

  //   getMembersService(setMembers, newCon);
  // }, [groupWhere]);

  // useEffect(() => {
  //   let newCon = [];
  //   if (geadquarterWhere != null) {
  //     newCon.push(where("geadquarterUid", "==", geadquarterWhere));
  //   }
  //   getMembersService(setMembers, newCon);
  // }, [geadquarterWhere]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({
      ...data,
      [name]: value,
    });
  };

  const getConditions = () => {
    let conditions = [];
    if (data.startDate) {
      conditions.push(where("created_at", ">=", converterDate(data.startDate)));
    }
    if (data.endDate) {
      conditions.push(where("created_at", "<=", converterDate(data.endDate)));
    }
    if (data.statu) {
      conditions.push(where("statu", "==", data.statu));
    }
    if (data.uidGroup) {
      conditions.push(where("group.uid", "==", data.uidGroup));
    }
    if (data.uidGeadquarter) {
      conditions.push(where("geadquarter.uid", "==", data.uidGeadquarter));
    }
    if (
      !data.uidGroup &&
      !data.uidGeadquarter &&
      !data.statu &&
      !data.startDate &&
      !data.endDate
    ) {
      conditions = [];
    }
    return conditions;
  };
  const filter = () => {
    const conditions = getConditions();
    getMembersService(setMembers, conditions);
  };
  const searsh = () => {
    let newCon = [];
    if (searchkey && !isNumeric(searchkey)) {
      newCon.push(where("member.names", ">=", searchkey.toUpperCase()));
      newCon.push(where("member.names", "<=", searchkey.toUpperCase() + "~"));
    } else if (searchkey && isNumeric(searchkey)) {
      newCon.push(where("member.dni", ">=", searchkey));
      newCon.push(where("member.dni", "<=", searchkey + "~"));
    }
    newCon.push(limit(5));
    if (!searchkey) {
      filter();
    } else {
      getPaymentsServiceSearsh(setPayments, newCon);
    }
  };

  useEffect(() => {
    getDataGroupsService(setGroups);
    getDataGeadquartersService(setGeadquarters);
  }, []);

  useEffect(() => {
    filter();
  }, [
    data.statu,
    data.uidGeadquarter,
    data.uidGroup,
    data.endDate,
    data.startDate,
  ]);

  // useEffect(() => {
  //   getDataGroupsService(setGroups);
  //   getDataGeadquartersService(setGeadquarters);
  //   let newCon = [];
  //   if (startDate) {
  //     newCon.push(where("created_at", ">=", converterDate(startDate)));
  //   }
  //   if (endDate) {
  //     newCon.push(where("created_at", "<=", converterDate(endDate)));
  //   }
  //   if (groupWhere) {
  //     newCon.push(where("groupUid", "==", groupWhere));
  //   }
  //   if (geadquarterWhere) {
  //     newCon.push(where("geadquarterUid", "==", geadquarterWhere));
  //   }
  //   if (statuWhere) {
  //     newCon.push(where("statu", "==", statuWhere.value));
  //   }
  //   getMembersService(setMembers, newCon);
  // }, [geadquarterWhere, groupWhere, statuWhere, endDate, startDate]);

  const handelCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success("Uid copiado", {
      style: {
        padding: "7px",
        paddingLeft: "10px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };
  const handleUpdateStatu = async (item) => {
    let newData = { ...item };
    delete newData.uid;
    newData = {
      ...newData,
      statu: !item.statu,
      updated_user: userData.uid,
      updated_statu_at: {
        user_name: userData.name,
        user_role: userData.role,
        user_uid: userData.uid,
        date: FormatDate(),
      },
    };
    await updateMemberService(newData, item.uid, userData);
    toast.success("Estado Actualizado", {
      style: {
        padding: "7px",
        paddingLeft: "10px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };

  return (
    <div className="p-4">
      <div>
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-zinc-50">
            Administracion de los Miembros
          </h1>
          <span className="flex text-sm text-zinc-500 dark:text-zinc-300 ml-1">
            Registro, actualización, de miembros
          </span>
        </div>
        <div className="bg-white p-4 border rounded-md ">
          <div className="flex gap-1 items-center">
            <div className="flex h-[40px]">
              <PrimaryButton
                width="190px"
                onClick={() => {
                  setMemberSelected(null);
                  setModalAdd(true);
                }}
                type="default"
              >
                <span className="w-6">
                  <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                    <g id="SVGRepo_iconCarrier">
                      <path d="M6 12H18"></path> <path d="M12 18V6"></path>{" "}
                    </g>
                  </svg>
                </span>
                <span className="text-sm font-semibold">Registrar nuevo</span>
              </PrimaryButton>
            </div>
            {/* <PrimaryButton
              width="100px"
              onClick={() => setFilterShow(!filterShow)}
              type="default"
            >
              <span className="text-sm font-semibold">Filtro</span>
            </PrimaryButton> */}
            <div className="ml-auto flex items-center  gap-2">
              <div className="text-sm text-neutral-500">filtro:</div>
              <div>
                <ReactSelect
                  placeholder="-- Grupo --"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        value: e.value,
                        name: "uidGroup",
                      },
                    })
                  }
                  name="uidConcept"
                  options={
                    groups &&
                    [
                      {
                        label: "Todos los grupos",
                        value: "",
                      },
                    ].concat(
                      groups.map((i) => {
                        return {
                          label: i.name,
                          value: i.uid,
                        };
                      })
                    )
                  }
                  className="react-select-container text-sm w-[150px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
              <div className="">
                <ReactSelect
                  placeholder="-- Sede --"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        value: e.value,
                        name: "uidGeadquarter",
                      },
                    })
                  }
                  name="uidConcept"
                  options={
                    geadquarters &&
                    [
                      {
                        label: "Todos los sedes",
                        value: "",
                      },
                    ].concat(
                      geadquarters.map((i) => {
                        return {
                          label: i.name,
                          value: i.uid,
                        };
                      })
                    )
                  }
                  className="react-select-container text-sm w-[140px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
              <div className="">
                <ReactSelect
                  placeholder="-- Estado --"
                  isDisabled
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        value: e.value,
                        name: "statu",
                      },
                    })
                  }
                  name="statu"
                  options={
                    groups && [
                      {
                        label: "Todos lo estados",
                        value: "",
                      },
                      {
                        label: "Activos",
                        value: "true",
                      },
                      {
                        label: "Inactivos",
                        value: "false",
                      },
                    ]
                  }
                  className="react-select-container text-sm w-[140px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
            </div>
            <div className="w-[270px]">
              <div className="w-full">
                <div className="relative">
                  <input
                    data-toggle="dropdown"
                    // onChange={(e) => setSearchkey(e.target.value)}
                    placeholder="Buscar por DNI o Apellido Paterno"
                    type="text"
                    // value={searchkey ? searchkey : ""}
                    className="px-4 pl-7 text-sm w-full  h-[35px] flex items-center justify-center py-1 outline-none dark:bg-[#7e7e7e36] bg-[#a8a8a836] dark:hover:bg-[#7e7e7e5b] hover:bg-[#a8a8a81a] transition-colors dark:text-[#ffffff] rounded-md"
                  />
                  <div className="pointer-events-none w-4 absolute top-[50%] translate-y-[-50%] left-2">
                    <svg
                      className="text-[#464545] dark:text-[#949494]"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g
                        style={{
                          clipPath: "url(#clip0_35_20)",
                        }}
                      >
                        <path
                          d="M10.8874 0C5.86273 0 1.7748 4.08789 1.7748 9.11258C1.7748 11.2861 2.54012 13.284 3.81496 14.852L0 18.6669L1.33312 20L5.14809 16.185C6.71594 17.4598 8.71387 18.2252 10.8874 18.2252C15.9121 18.2252 20 14.1373 20 9.11258C20 4.08789 15.9121 0 10.8874 0ZM10.8874 16.3398C6.90234 16.3398 3.6602 13.0977 3.6602 9.11258C3.6602 5.1275 6.9023 1.88535 10.8874 1.88535C14.8725 1.88535 18.1146 5.1275 18.1146 9.11258C18.1146 13.0977 14.8725 16.3398 10.8874 16.3398Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_35_20">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {filterShow && (
            <div className="dark:bg-[#282829] p-3 rounded-lg">
              <div>
                <h1 className="dark:text-zinc-50 text-xl font-bold">
                  Filtra los datos
                </h1>
                <span className="flex text-zinc-400 text-sm">
                  Filtra por grupos, sedes, estado y otros
                </span>
              </div>
              <div className="2xl:grid-cols-4 grid gap-3">
                <div className=" border-r dark:border-r-zinc-600 pr-4">
                  <div className="p-1">
                    <h4 className="font-semibold dark:text-zinc-100 pb-2">
                      Por grupo
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div
                      onClick={() => {
                        setGroupWhere(null);
                      }}
                      className={`h-[40px] w-[70px] flex items-center justify-center py-1 cursor-pointer ${
                        !groupWhere
                          ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                          : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797971f] hover:bg-[#6e6d6d1f]"
                      } dark:bg-[#277dff1f] dark:hover:bg-[#277dff44]  transition-colors rounded-full`}
                    >
                      <div className="text-sm font-semibold">Todos</div>
                    </div>
                    {groups &&
                      groups.map((group, index) => (
                        <div
                          onClick={() => {
                            setGroupWhere(group.uid);
                          }}
                          key={index}
                          className={` h-[40px] w-[40px] flex items-center justify-center py-1 cursor-pointer  ${
                            groupWhere && groupWhere === group.uid
                              ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                              : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797971f] hover:bg-[#6e6d6d4d]"
                          } dark:bg-[#277dff1f] dark:hover:bg-[#277dff44]  transition-colors rounded-full`}
                        >
                          <div className="text-sm font-semibold">
                            {group.name}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" border-r dark:border-r-zinc-600 pr-4">
                  <div className="p-1">
                    <h4 className="font-semibold dark:text-zinc-200 pb-2">
                      Por Sede
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div
                      onClick={() => {
                        setGeadquarterWhere(null);
                      }}
                      className={`h-[40px] w-[70px] flex items-center justify-center py-1 cursor-pointer ${
                        !geadquarterWhere
                          ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                          : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797974b]"
                      } dark:bg-[#277dff1f] dark:hover:bg-[#277dff44]  transition-colors rounded-full`}
                    >
                      <div className="text-sm font-semibold">Todos</div>
                    </div>
                    {geadquarters &&
                      geadquarters.map((item, index) => (
                        <div
                          onClick={() => {
                            setGeadquarterWhere(item.uid);
                          }}
                          key={index}
                          className={` h-[40px] px-3 flex items-center justify-center py-1 cursor-pointer ${
                            geadquarterWhere && geadquarterWhere === item.uid
                              ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                              : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797971f]"
                          } dark:hover:bg-[#277dff44] hover:bg-[#80808044] transition-colors  rounded-full`}
                        >
                          <div className="text-sm font-semibold">
                            {item.name}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" border-r dark:border-r-zinc-600 pr-4">
                  <div className="p-1">
                    <h4 className="font-semibold dark:text-zinc-200 pb-2">
                      Por Fecha
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex flex-col">
                      <div
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                        }}
                        className={`h-[40px] w-[70px] flex items-center justify-center py-1 cursor-pointer ${
                          !startDate && !endDate
                            ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                            : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797974b]"
                        } dark:bg-[#277dff1f] dark:hover:bg-[#277dff44]  transition-colors rounded-full`}
                      >
                        <div className="text-sm font-semibold">Todos</div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`relative rounded-full ${
                          startDate
                            ? "dark:bg-[#0974ff] bg-[#0974ff]"
                            : "dark:bg-[#66666663] hover:bg-[#66666631] bg-[#6666662a] text-zinc-300"
                        }  text-sm outline-none cursor-pointer font-semibold text-zinc-50 p-2 rounded-full w-[40px] h-[40px]`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="icon-stroke"
                        >
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path d="M8 2V5"></path> <path d="M16 2V5"></path>{" "}
                            <path d="M3.5 9.08997H20.5"></path>{" "}
                            <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"></path>{" "}
                            <path d="M15.6947 13.7H15.7037"></path>{" "}
                            <path d="M15.6947 16.7H15.7037"></path>{" "}
                            <path d="M11.9955 13.7H12.0045"></path>{" "}
                            <path d="M11.9955 16.7H12.0045"></path>{" "}
                            <path d="M8.29431 13.7H8.30329"></path>{" "}
                            <path d="M8.29431 16.7H8.30329"></path>{" "}
                          </g>
                        </svg>
                        <input
                          className={` absolute left-[-0px] opacity-0 text-[50px] w-full h-full top-0  cursor-pointer `}
                          type="date"
                          value={startDate ? startDate : ""}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-zinc-400 flex items-center justify-center text-sm px-1 pb-1">
                      Hasta:
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`relative rounded-full ${
                          endDate
                            ? "dark:bg-[#0974ff] bg-[#0974ff]"
                            : "dark:bg-[#66666663] hover:bg-[#66666631] bg-[#6666662a] text-zinc-200"
                        }  text-sm outline-none cursor-pointer font-semibold text-zinc-50 p-2 rounded-full w-[40px] h-[40px]`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="icon-stroke"
                        >
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path d="M8 2V5"></path> <path d="M16 2V5"></path>{" "}
                            <path d="M3.5 9.08997H20.5"></path>{" "}
                            <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"></path>{" "}
                            <path d="M15.6947 13.7H15.7037"></path>{" "}
                            <path d="M15.6947 16.7H15.7037"></path>{" "}
                            <path d="M11.9955 13.7H12.0045"></path>{" "}
                            <path d="M11.9955 16.7H12.0045"></path>{" "}
                            <path d="M8.29431 13.7H8.30329"></path>{" "}
                            <path d="M8.29431 16.7H8.30329"></path>{" "}
                          </g>
                        </svg>
                        <input
                          className={` absolute left-[-0px] opacity-0 text-[50px] w-full h-full top-0  cursor-pointer `}
                          type="date"
                          value={endDate ? endDate : ""}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="p-1">
                    <h4 className="font-semibold dark:text-zinc-200 pb-2">
                      Por Estado
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div
                      onClick={() => {
                        setStatuWhere(null);
                      }}
                      className={`h-[40px] w-[70px] flex items-center justify-center py-1 cursor-pointer ${
                        statuWhere === null
                          ? "dark:bg-[#277dffcc] bg-[#0974ff] text-[#ffffff] dark:hover:bg-[#277dffe3]"
                          : "dark:text-[#fefeff] dark:bg-[#9797971f]"
                      } dark:bg-[#277dff1f] dark:hover:bg-[#277dff44]  transition-colors rounded-full`}
                    >
                      <div className="text-sm font-semibold">Todos</div>
                    </div>
                    <div
                      onClick={() => {
                        setStatuWhere({ value: true });
                      }}
                      className={` h-[40px] px-3 flex items-center justify-center py-1 cursor-pointer ${
                        statuWhere && statuWhere.value === true
                          ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                          : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797973a]"
                      } dark:hover:bg-[#277dff44] hover:bg-[#8c8d8d44] transition-colors  rounded-full`}
                    >
                      <div className="text-sm font-semibold">Activos</div>
                    </div>
                    <div
                      onClick={() => {
                        setStatuWhere({ value: false });
                      }}
                      className={` h-[40px] px-3 flex items-center justify-center py-1 cursor-pointer ${
                        statuWhere && statuWhere.value === false
                          ? "text-[#ffffff] dark:bg-[#277dffcc] bg-[#0974ff] dark:hover:bg-[#277dffe3]"
                          : "dark:text-[#fefeff] dark:bg-[#9797971f] bg-[#9797973a]"
                      } dark:hover:bg-[#277dff44] hover:bg-[#8c8d8d44] transition-colors  rounded-full`}
                    >
                      <div className="text-sm font-semibold">Inactivos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div className="mt-2">
            <div className=" ">
              <table className="w-full ">
                <thead className="text-sm  border-b dark:border-b-zinc-700 h-[35px] font-normal">
                  <tr className="border-0  dark:text-zinc-200">
                    <th className="w-[0px]">{members && members.length}</th>
                    <th className="mb-1 p-2 px-3 font-semibold min-w-[180px]">
                      <div className=" text-left">Apellidos y Nombres</div>
                    </th>
                    <th className=" font-semibold w-[80px]">
                      <div className="text-center">Grupo</div>
                    </th>
                    <th className=" font-semibold min-w-[200px] w-[200px]">
                      <div className="text-left">Sede</div>
                    </th>
                    <th className=" font-semibold w-[90px]">
                      <div className="text-center">Estado</div>
                    </th>
                    <th className=" font-semibold w-[130px] text-right pr-2">
                      Cuota Mensual
                    </th>
                    <th className=" font-semibold w-[200px] text-left pl-5">
                      Entrada
                    </th>
                    <th className=" font-semibold w-[290px] text-left pl">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                {}
                <tbody>
                  {members &&
                    members.map((member, index) => (
                      <Opcy
                        onDoubleClick={() => {
                          setMemberSelected(member);
                          setModalAdd(true);
                        }}
                        key={index}
                        className="cursor-default dark:text-zinc-200 dark:hover:bg-[#18191a] hover:bg-[#b1b4b633]  transition-colors  text-sm "
                      >
                        <td className="px-2 w-[40px] mx-auto text-center  rounded-l-sm">
                          {member.verify && (
                            <div
                              tooltip="Verificado por Reniec"
                              className="w-5 text-neutral-500"
                            >
                              <svg
                                className="icon-stroke"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.63996 20.59 3.08997 16.01 3.08997 11.12V6.72997C3.08997 5.90997 3.70998 4.97998 4.47998 4.66998L10.05 2.39001C11.3 1.88001 12.71 1.88001 13.96 2.39001L19.53 4.66998C20.29 4.97998 20.92 5.90997 20.92 6.72997L20.91 11.12Z"></path>
                                </g>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="py-[8px] px-2 pl-1  relative">
                          <div>
                            <div
                              className="flex items-center gap-1 text-neutral-900 font-semibold h-full"
                              to="/"
                            >
                              {upercasePrimaryLetter(
                                concatString([
                                  member.lastName,
                                  member.motherLastName + ",",
                                  member.names,
                                ])
                              )}
                            </div>
                          </div>
                          <div className="text-zinc-500 text-xs">
                            {member.dni}
                          </div>
                        </td>
                        <td className="text-center text-xs font-semibold">
                          <div>{member.group.name}</div>
                        </td>
                        <td className="">
                          <div>
                            <div className="font-semibold">
                              {member.geadquarter.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {member.geadquarter.address}
                            </div>
                          </div>
                        </td>
                        <td className="text-center ">
                          <div className="flex items-center">
                            <div className="ml-auto">
                              <div
                                className={`w-[6px] h-[6px] ${
                                  member.statu ? " bg-green-600" : " bg-red-500"
                                }  rounded-full`}
                              ></div>
                            </div>
                            <div
                              onClick={() => handleUpdateStatu(member)}
                              tooltip={
                                member.updated_statu_at
                                  ? `Actualizado ${TimeAgoHourFormat(
                                      member.updated_statu_at.date
                                    )} por ${member.updated_statu_at.user_name}`
                                  : "Cambiar Estado"
                              }
                              className={`p-[5px] cursor-pointer hover:bg-neutral-200 rounded-md mx-auto font-semibold text-xs w-[65px] flex items-center justify-center`}
                            >
                              <div className="text">
                                {member.statu ? "Activo" : "Inactivo"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="ml-auto">
                          <div className="flex items-center font-semibold">
                            <div className="text-right ml-auto pr-2">
                              S/ {parseInt(member.totalFee).toFixed(2)}
                            </div>
                            <div className="w-4 h-4">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="icon-stroke"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M11.74 17.7499H17.66C17.57 17.8299 17.48 17.8999 17.39 17.9799L13.12 21.1799C11.71 22.2299 9.41001 22.2299 7.99001 21.1799L3.71001 17.9799C2.77001 17.2799 2 15.7299 2 14.5599V7.14986C2 5.92986 2.93001 4.57986 4.07001 4.14986L9.05 2.27986C9.87 1.96986 11.23 1.96986 12.05 2.27986L17.02 4.14986C17.97 4.50986 18.78 5.50986 19.03 6.52986H11.73C11.51 6.52986 11.31 6.53987 11.12 6.53987C9.27 6.64987 8.78999 7.31986 8.78999 9.42986V14.8598C8.79999 17.1598 9.39001 17.7499 11.74 17.7499Z"></path>{" "}
                                  <path d="M8.80005 11.22H22"></path>
                                  <path d="M22 9.41977V14.9698C21.98 17.1898 21.37 17.7397 19.06 17.7397H11.7401C9.39005 17.7397 8.80005 17.1498 8.80005 14.8398V9.40976C8.80005 7.30976 9.28005 6.63974 11.1301 6.51974C11.3201 6.51974 11.5201 6.50977 11.7401 6.50977H19.06C21.41 6.51977 22 7.09977 22 9.41977Z"></path>{" "}
                                  <path d="M11.3201 15.2598H12.6501"></path>
                                  <path d="M14.75 15.2598H18.02"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="rounded-r-sm text-left pl-5">
                          <div>
                            <div>
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormatSimple(member.created_at)
                              )}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormat(member.created_at)
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{member.observations}</div>
                        </td>
                      </Opcy>
                    ))}
                </tbody>
              </table>
              {members && members.length < 1 && (
                <div className="mx-auto text-center py-10 font-semibold text-zinc-400">
                  No hay nada que mostrar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        onClickIframe={() => setModalAdd(!modalAdd)}
        show={modalAdd}
        close={() => setModalAdd(!modalAdd)}
      >
        <ContentModal width="500px">
          <HeaderModal
            title={memberSelected ? "Editar miembro" : "Agregar miembro"}
            btnRightOnclick={() => setModalAdd(!modalAdd)}
          />
          <BodyModal>
            <FormMember
              data={memberSelected}
              close={() => setModalAdd(!modalAdd)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
    </div>
  );
}

const Opcy = styled.tr`
  .svg {
    display: none;
  }
  &:hover {
    .span {
      display: none;
    }
    .svg {
      display: block;
    }
  }
`;
