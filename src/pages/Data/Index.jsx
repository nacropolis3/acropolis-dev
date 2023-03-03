import React, { useEffect } from "react";
import ContentModal from "../../components/Modal/Components/Content";
import { HeaderModal } from "../../components/Modal/Components/Header";
import BodyModal from "../../components/Modal/Components/Main";
import Modal from "../../components/Modal/Modal";
import { useObject } from "../../hooks/useObject";
import { useToggle } from "../../hooks/useToggle";
import {
  getDataConcepetsService,
  getDataGeadquartersService,
  getDataGroupsService,
} from "../../services/Data/DataServices";
import FormConcept from "./Components/FormConcept";
import {
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../helpers/moment";
import styled from "styled-components";
import FormGroup from "./Components/FormGroup";
import FormGeadquarter from "./Components/FormGeadquarter";

export default function Data() {
  const [modalAddConcept, setModalAddConcept] = useToggle(false);
  const [modalAddGroup, setModalAddGroup] = useToggle(false);
  const [modalAddGeadquarter, setModalAddGeadquarter] = useToggle(false);

  const [wrapper, setWrapper] = useObject(1);

  const [concepts, setConcepts] = useObject(null);
  const [groups, setGroups] = useObject(null);
  const [geadquarters, setGeadquarters] = useObject(null);

  const [conceptSelected, setConceptSelected] = useObject(null);
  const [groupSelected, setGroupSelected] = useObject(null);
  const [geadquarterSelected, setGeadquarterSelected] = useObject(null);

  useEffect(() => {
    getDataConcepetsService(setConcepts);
    getDataGroupsService(setGroups);
    getDataGeadquartersService(setGeadquarters);
  }, []);
  return (
    <div className="p-4">
      <div className=" p-4 rounded-lg">
        <div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter leading-4 text-gray-800 dark:text-zinc-50">
              Gestion de Datos
            </h1>
            <span className="flex text-sm text-zinc-500 dark:text-zinc-300">
              Datos globales
            </span>
          </div>
        </div>
        <div className=" ">
          <div className="pt-2 flex justify-center"></div>
          <Wrapper className="2xl:grid-cols-4 grid md:grid-cols-2 lg:grid-cols-2 gap-3">
            {wrapper === 1 && (
              <>
                <div className="inline-block ">
                  <div className="border dark:border-0 bg-white rounded-lg mt-3 p-1 pl-2">
                    <div className="flex items-center bg-white  border-b  pb-[5px]">
                      <h2 className="font-semibold text-sm text-zinc-500 dark:text-zinc-200 tracking-tight">
                        Conceptos
                      </h2>
                      <div className="ml-auto">
                        <div
                          onClick={() => {
                            setConceptSelected(null);
                            setModalAddConcept(true);
                          }}
                          role="button"
                          tabIndex="0"
                          className="flex items-center justify-center gap-2 text-blue-600 pl-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#393a3b] p-1 py-1 rounded-md"
                        >
                          <div className="w-5">
                            <svg
                              className="icon-stroke"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <g id="SVGRepo_iconCarrier">
                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>{" "}
                                <path d="M8 12H16"></path>{" "}
                                <path d="M12 16V8"></path>{" "}
                              </g>
                            </svg>
                          </div>
                          <span className="text-xs font-semibold">Agregar</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {concepts &&
                        concepts.map((item, index) => (
                          <ItemEdit
                            className="flex items-center gap-2 hover:bg-neutral-100  cursor-pointer rounded-sm p-2"
                            key={index}
                          >
                            <div>
                              <div className="text-sm font-semibold text-neutral-800 ">
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-[6px] h-[6px] ${
                                      item.statu
                                        ? " bg-green-600"
                                        : " bg-red-500"
                                    }  rounded-full`}
                                  />
                                  {item.name}
                                </div>
                              </div>
                              {item.description && (
                                <div className="text-sm leading-5 py-2 hover:text-zinc-500 text-zinc-600 font-normal">
                                  {item.description}
                                </div>
                              )}
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Creado{" "}
                                  {TimeAgoHourFormatSimple(item.created_at)}{" "}
                                  {item.update_at && (
                                    <>
                                      · Actualizado{" "}
                                      {TimeAgoHourFormat(item.update_at)}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`ml-auto font-semibold text-sm w-[65px] flex items-center justify-center ${
                                item.statu ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              <div
                                tooltip="Editar"
                                onClick={() => {
                                  setConceptSelected(item);
                                  setModalAddConcept(true);
                                }}
                                className=" flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 rounded-md p-1"
                              >
                                <div className="text-blue-500 w-4">
                                  <svg
                                    className="icon-stroke"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <g id="SVGRepo_iconCarrier">
                                      <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"></path>{" "}
                                      <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"></path>{" "}
                                      <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                <div className="text-blue-500 text-xs">
                                  Editar
                                </div>
                              </div>
                            </div>
                          </ItemEdit>
                        ))}
                      {concepts && concepts.length < 1 && (
                        <div className="w-52 mx-auto text-center py-10">
                          Sin datos aun
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inline-block">
                  <div className="border dark:border-0 bg-white rounded-lg mt-3 p-1 pl-2">
                    <div className="flex items-center  bg-white dark:bg-[#242525] border-b dark:border-b-zinc-700 pb-[5px]">
                      <h2 className="font-semibold text-sm text-zinc-500 dark:text-zinc-200 tracking-tight">
                        Grupos
                      </h2>
                      <div className="ml-auto">
                        <div
                          onClick={() => {
                            setGroupSelected(null);
                            setModalAddGroup(true);
                          }}
                          role="button"
                          tabIndex="0"
                          className="flex items-center justify-center gap-2 text-blue-600 pl-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#393a3b] p-1 py-1 rounded-md"
                        >
                          <div className="w-5">
                            <svg
                              className="icon-stroke"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <g id="SVGRepo_iconCarrier">
                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>{" "}
                                <path d="M8 12H16"></path>{" "}
                                <path d="M12 16V8"></path>{" "}
                              </g>
                            </svg>
                          </div>
                          <span className="text-xs font-semibold">Agregar</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {groups &&
                        groups.map((item, index) => (
                          <ItemEdit
                            className="flex items-center gap-2 hover:bg-neutral-100  cursor-pointer rounded-sm p-2"
                            key={index}
                          >
                            <div>
                              <div className="text-sm font-semibold text-neutral-800 ">
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`w-[6px] h-[6px] ${
                                      item.statu
                                        ? " bg-green-600"
                                        : " bg-red-500"
                                    }  rounded-full`}
                                  />
                                  {item.name}
                                </div>
                              </div>
                              {item.description && (
                                <div className="text-sm leading-5 py-2 hover:text-zinc-500 text-zinc-600 font-normal">
                                  {item.description}
                                </div>
                              )}
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Creado{" "}
                                  {TimeAgoHourFormatSimple(item.created_at)}{" "}
                                  {item.update_at && (
                                    <>
                                      · Actualizado{" "}
                                      {TimeAgoHourFormat(item.update_at)}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`ml-auto font-semibold text-sm w-[65px] flex items-center justify-center ${
                                item.statu ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              <div
                                tooltip="Editar"
                                onClick={() => {
                                  setGroupSelected(item);
                                  setModalAddGroup(true);
                                }}
                                className=" flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 rounded-md p-1"
                              >
                                <div className="text-blue-500 w-4">
                                  <svg
                                    className="icon-stroke"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <g id="SVGRepo_iconCarrier">
                                      <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"></path>{" "}
                                      <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"></path>{" "}
                                      <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                <div className="text-blue-500 text-xs">
                                  Editar
                                </div>
                              </div>
                            </div>
                          </ItemEdit>
                        ))}
                      {groups && groups.length < 1 && (
                        <div className="w-52 mx-auto py-10 text-center">
                          Sin grupos aun
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inline-block">
                  <div className="border bg-white rounded-lg mt-3 p-2 pl-3">
                    <div className="flex items-center bg-white pb-[5px]">
                      <h2 className="font-semibold text-sm text-zinc-500 dark:text-zinc-200 tracking-tight">
                        Sedes
                      </h2>
                      <div className="ml-auto">
                        <div
                          onClick={() => {
                            setGeadquarterSelected(null);
                            setModalAddGeadquarter(true);
                          }}
                          role="button"
                          tabIndex="0"
                          className="flex items-center justify-center gap-2 text-blue-600 pl-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#393a3b] p-1 py-1 rounded-md"
                        >
                          <div className="w-5">
                            <svg
                              className="icon-stroke"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <g id="SVGRepo_iconCarrier">
                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>{" "}
                                <path d="M8 12H16"></path>{" "}
                                <path d="M12 16V8"></path>{" "}
                              </g>
                            </svg>
                          </div>
                          <span className="text-xs font-semibold">Agregar</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {geadquarters &&
                        geadquarters.map((item, index) => (
                          <ItemEdit
                            className="flex items-center hover:bg-neutral-50 border-t rounded-md p-2"
                            key={index}
                          >
                            <div className="w-full">
                              <div className="text-sm flex items-center gap-1 font-semibold  text-neutral-900 ">
                                <div
                                  className={`w-[6px] h-[6px] ${
                                    item.statu ? " bg-green-600" : " bg-red-500"
                                  }  rounded-full`}
                                />
                                {item.name}
                              </div>
                              {item.observations && (
                                <div className="text-sm leading-5 py-1 text-yellow-600 dark:text-yellow-500 font-normal">
                                  {item.observations}
                                </div>
                              )}
                              <div className="flex gap-1 bg-neutral-100 border rounded-md p-2 ">
                                <div className="w-4 text-zinc-500">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="icon-stroke"
                                  >
                                    <g id="SVGRepo_iconCarrier">
                                      <path d="M12 13.4299C13.7231 13.4299 15.12 12.0331 15.12 10.3099C15.12 8.58681 13.7231 7.18994 12 7.18994C10.2769 7.18994 8.88 8.58681 8.88 10.3099C8.88 12.0331 10.2769 13.4299 12 13.4299Z"></path>
                                      <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className=" gap-2 text-xs flex-wrap">
                                    Departamento:{" "}
                                    <div className="font-semibold inline-flex dark:text-zinc-100">
                                      {item.contry.departament.name}
                                    </div>
                                  </div>
                                  <div className=" gap-2 text-xs flex-wrap">
                                    Provincia:{" "}
                                    <div className="font-semibold inline-flex dark:text-zinc-100">
                                      {item.contry.province.name}
                                    </div>
                                  </div>
                                  <div className=" gap-2 text-xs flex-wrap">
                                    Distrito:{" "}
                                    <div className="font-semibold inline-flex dark:text-zinc-100">
                                      {item.contry.district.name}
                                    </div>
                                  </div>
                                  <div className=" gap-2 text-xs flex-wrap">
                                    Direccion:{" "}
                                    <div className="font-semibold inline-flex dark:text-zinc-100">
                                      {item.address}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Creado{" "}
                                  {TimeAgoHourFormatSimple(item.created_at)}{" "}
                                  {item.update_at && (
                                    <>
                                      · Actualizado{" "}
                                      {TimeAgoHourFormat(item.update_at)}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div
                                className="cursor-pointer p-1 text-sm bg-neutral-200 hover:bg-neutral-300 max-w-min rounded-sm px-3 mt-1"
                                onClick={() => {
                                  setGeadquarterSelected(item);
                                  setModalAddGeadquarter(true);
                                }}
                              >
                                Editar
                              </div>
                            </div>
                          </ItemEdit>
                        ))}
                      {geadquarters && geadquarters.length < 1 && (
                        <div className=" mx-auto py-10">
                          <span className="dark:text-zinc-200 text-center">
                            Sin sedes aun
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* {wrapper === 2 && (
              
            )} */}
          </Wrapper>
        </div>
      </div>
      <Modal
        onClickIframe={() => setModalAddConcept(!modalAddConcept)}
        show={modalAddConcept}
        close={() => setModalAddConcept(!modalAddConcept)}
      >
        <ContentModal width="400px">
          <HeaderModal
            title={
              conceptSelected ? "Editar concepto" : "Agregar nuevo concepto"
            }
            btnRightOnclick={() => setModalAddConcept(!modalAddConcept)}
          />
          <BodyModal>
            <FormConcept
              data={conceptSelected}
              close={() => setModalAddConcept(!modalAddConcept)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
      <Modal
        onClickIframe={() => setModalAddGroup(!modalAddGroup)}
        show={modalAddGroup}
        close={() => setModalAddGroup(!modalAddGroup)}
      >
        <ContentModal width="400px">
          <HeaderModal
            title={groupSelected ? "Editar grupo" : "Agregar grupo nuevo"}
            btnRightOnclick={() => setModalAddGroup(!modalAddGroup)}
          />
          <BodyModal>
            <FormGroup
              data={groupSelected}
              close={() => setModalAddGroup(!modalAddGroup)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
      <Modal
        onClickIframe={() => setModalAddGeadquarter(!modalAddGeadquarter)}
        show={modalAddGeadquarter}
        close={() => setModalAddGeadquarter(!modalAddGeadquarter)}
      >
        <ContentModal width="400px">
          <HeaderModal
            title={geadquarterSelected ? "Editar Sede" : "Agregar nueva Sede"}
            btnRightOnclick={() => setModalAddGeadquarter(!modalAddGeadquarter)}
          />
          <BodyModal>
            <FormGeadquarter
              data={geadquarterSelected}
              close={() => setModalAddGeadquarter(!modalAddGeadquarter)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
    </div>
  );
}

const ItemEdit = styled.div`
  .editbtn {
    display: none;
  }
  &:hover {
    .text {
      display: none;
    }
    .editbtn {
      display: flex;
    }
  }
`;

const Wrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;
