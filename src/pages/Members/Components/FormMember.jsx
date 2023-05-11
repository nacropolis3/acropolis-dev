import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import EclipseButton from "../../../components/Button/EclipseButton";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import CheckBox from "../../../components/Form/CheckBox";
import Combobox from "../../../components/Form/ComboBox";
import TextField from "../../../components/Form/TextField";
import Rotation from "../../../components/Loader/Rotation";
import { useUser } from "../../../context/userContext";
import { FormatDate } from "../../../helpers/moment";
import { useObject } from "../../../hooks/useObject";
import { useToggle } from "../../../hooks/useToggle";
import {
  getDataGeadquartersService,
  getDataGroupsService,
} from "../../../services/Data/DataServices";
import {
  getMemberByDni,
  saveMemberService,
  updateMemberService,
} from "../../../services/Member/MemberServices";
import TextFieldUnivercel from "../../../univercel-component/textfield";
import ComboboxUnivercel from "../../../univercel-component/combobox";

const days = [
  {
    data: [
      {
        name: "1",
        value: "1",
      },
      {
        name: "2",
        value: "2",
      },
      {
        name: "3",
        value: "3",
      },
    ],
  },
];

export default function FormMember(props) {
  const [data, setData] = useObject(
    props.data
      ? props.data
      : {
          dni: "",
          names: "",
          lastName: "",
          motherLastName: "",
          observations: "",
          verify: false,
          statu: true,
          groupUid: "",
          day: 1,
          month: 1,
          year: 2023,
          geadquarterUid: "",
          memberFee: "30.00",
          bookletFee: "2.00",
          celebrationFee: "3.00",
          totalFee: "40.00",

          younger: false,
          attorney: "",
          phone: "",
          dischargeDate: "",
          entryDate: "",
        }
  );
  const {
    handleSubmit,
    control,
    setError,
    register,
    setValue,
    clearErrors,
    unregister,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...data,
    },
    mode: "onChange",
  });

  const { userData } = useUser();

  const [loading, setLoading] = useToggle(false);
  const [loadingRuc, setLoadingRuc] = useToggle(false);
  const [groups, setGroups] = useObject(null);
  const [geadquarters, setGeadquarters] = useObject(null);

  let currentYear = new Date().getFullYear();

  let days = [];
  let years = [];
  const monthsDate = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const getDate = () => {
    for (let year = currentYear; year >= 1905; year--) {
      years.push(year);
    }

    for (let day = 1; day <= 31; day++) {
      days.push(day);
    }
  };
  getDate();

  // handles
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async () => {
    if (isYear(data.year) < 19 && !data.younger) {
      setError("year", { type: "custom", message: "Menor de Edad" });
      return;
    }
    setLoading(true);
    let geadquartersFinal = null;
    let groupFinal = null;

    geadquarters.forEach((item) => {
      if (item.uid == data.geadquarterUid) {
        geadquartersFinal = {
          uid: item.uid,
          name: item.name,
          address: item.address,
        };
      }
    });

    groups.forEach((item) => {
      if (item.uid == data.groupUid) {
        groupFinal = {
          uid: item.uid,
          name: item.name,
        };
      }
    });

    let newData = {
      ...data,
      geadquarter: geadquartersFinal,
      group: groupFinal,
      names: data.names.toUpperCase(),
      lastName: data.lastName.toUpperCase(),
      motherLastName: data.motherLastName.toUpperCase(),
    };

    if (props.data) {
      delete newData.uid;
      newData = {
        ...newData,
        updated_user: userData.uid,
        update_at: FormatDate(),
        updated_statu_at:
          props.data.statu != data.statu
            ? {
                user_name: userData.name,
                user_role: userData.role,
                user_uid: userData.uid,
                date: FormatDate(),
              }
            : props.data.updated_statu_at
            ? props.data.updated_statu_at
            : null,
      };
      await updateMemberService(newData, props.data.uid, userData);
      toast.success("Miembro Actualizado", {
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
    } else {
      // if member no exist
      if (await getMemberByDni(data.dni)) {
        newData = {
          ...newData,
          created_at: FormatDate(),
          created_user: userData.uid,
        };
        await saveMemberService(newData, userData);
        toast.success("Miembro Agregado", {
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
      } else {
        alert("EL miembro con el dni asignado ya se encuentra registrado");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    props.close();
  };
  const handleOnBlur = (e) => {
    const value = parseFloat(e.target.value);
    const name = e.target.name;

    const pattern = /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/;
    if (pattern.test(value)) {
      const money = value.toFixed(2);
      setData({
        ...data,
        [name]: money,
      });
    }
  };
  function isYear(birthYear) {
    return currentYear - birthYear;
  }

  // handle get client axios
  async function getClientSunat() {
    const number = data.dni;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN_QUERIES_UNIVERCEL}`,
      },
    };

    const response = await axios.get(
      `https://api.univercel.com.pe/queries/dni?number=` + number,
      axiosConfig
    );

    const dataUnivercel = response.data;
    if (dataUnivercel.status) {
      setData({
        ...data,
        names: dataUnivercel.credentials.nombres,
        lastName: dataUnivercel.credentials.apellidoPaterno,
        motherLastName: dataUnivercel.credentials.apellidoMaterno,
      });
      setValue("names", dataUnivercel.credentials.nombres);
      setValue("lastName", dataUnivercel.credentials.apellidoPaterno);
      setValue("motherLastName", dataUnivercel.credentials.apellidoMaterno);
    } else {
      clearErrors();
    }
  }

  const changeYouger = (e) => {
    if (e.target.checked) {
      unregister("attorney");
      clearErrors("attorney");
      clearErrors("year");
    } else {
      register("attorney", { required: true });
      clearErrors("attorney");
      if (isYear(data.year) < 18) {
        setError("year", { type: "custom", message: "Menor de Edad" });
      }
    }
  };

  //useEfects
  useEffect(() => {
    getDataGroupsService(setGroups);
    getDataGeadquartersService(setGeadquarters);
    // register("groupUid", { required: true });
    // register("geadquarterUid", { required: true });
  }, []);

  useEffect(() => {
    if (data.dni.length === 8) {
      getClientSunat();
    }
  }, [data.dni]);

  useEffect(() => {
    let memberFee = null;
    if (isYear(data.year) < 26) {
      memberFee = "30.00";
      setValue("memberFee", "30.00");
      clearErrors("memberFee");
    } else if (isYear(data.year) > 25) {
      memberFee = "40.00";
      setValue("memberFee", "40.00");
      clearErrors("memberFee");
    }
    setData({
      ...data,
      memberFee: memberFee,
    });
  }, [data.year]);

  useEffect(() => {
    const bookletFee = parseFloat(data.bookletFee);
    const celebrationFee = parseFloat(data.celebrationFee);
    const memberFee = parseFloat(data.memberFee);
    let total = bookletFee + memberFee + celebrationFee;
    if (!total.isNaN) {
      setData({
        ...data,
        totalFee: total.toFixed(2),
      });
    }
  }, [data.bookletFee, data.celebrationFee, , data.memberFee]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col ">
        <div className="flex items-center">
          <h1 className="mr-auto leading-8 text-2xl text-neutral-800 font-bold tracking-tight dark:text-neutral-200">
            {props.data ? " Actualizar" : " Registrar miembro"}
          </h1>
          <div>
            <EclipseButton
              onClick={props.close}
              type="default"
              size="medium"
              icon={
                <svg
                  className=" dark:text-zinc-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"
                    fill="currentColor"
                    style={{
                      strokeWidth: "0",
                    }}
                  ></path>
                </svg>
              }
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12">
          {/* <TextField
            autoFocus
            // info={<>DNI</>}

            type="text"
            placeholder="N° Identificiación"
            // long
            checked={data.verify}
            onChange={handleRucSearsh}
            iconLoadingLeft={loadingRuc}
            disabled={loadingRuc}
            value={data.dni}
            error={errors.dni}
            control={control}
            name="dni"
            rules={{
              pattern: /^[0-9,$]*$/,
              required: true,
              maxLength: 8,
              minLength: 8,
            }}
          /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            placeholder="DNI"
            name="dni"
            requiredName="Ingrese un Dni"
            patternName={`El dni "${data.dni}" es invalido, se acepta solo numeros`}
            maxLengthName="No puede contener mas de 8 caracteres"
            minLengthName="Debe contener 8 caracteres"
            control={control}
            error={errors.dni}
            value={data.dni}
            rules={{
              pattern: /^[0-9,$]*$/,
              required: true,
              maxLength: 8,
              minLength: 8,
            }}
          />
        </div>
        <div className="col-span-12">
          {/* <TextField
            // info={"Nombres"}
            requiredName="Ingrese los nombres"
            patternName="Solo letras y espacios"
            placeholder="Nombres"
            type="text"
            // long
            onChange={handleChange}
            value={data.names}
            error={errors.names}
            control={control}
            name="names"
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            placeholder="Nombres"
            name="names"
            requiredName="Ingrese los nombres"
            patternName="Solo letras y espacios"
            control={control}
            error={errors.names}
            value={data.names}
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-4">
          {/* <TextField
            // info={"Apellido Paterno"}
            requiredName="Ingrese el apellido paterno"
            patternName="El apellido solo debe contener letras"
            placeholder="Apellido Paterno"
            type="text"
            // long
            onChange={handleChange}
            value={data.lastName}
            error={errors.lastName}
            control={control}
            name="lastName"
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            name="lastName"
            requiredName="Ingrese el apellido paterno"
            patternName="El apellido solo debe contener letras"
            placeholder="Apellido Paterno"
            control={control}
            error={errors.lastName}
            value={data.lastName}
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          />
        </div>
        <div className="col-span-4">
          {/* <TextField
            // info={"Apellido Materno"}
            requiredName="Ingrese el apellido materno"
            patternName="El apellido solo debe contener letras"
            placeholder="Apellido Materno"
            type="text"
            // long
            onChange={handleChange}
            value={data.motherLastName}
            error={errors.motherLastName}
            control={control}
            name="motherLastName"
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            placeholder="Apellido Materno"
            name="motherLastName"
            requiredName="Ingrese el apellido materno"
            patternName="El apellido solo debe contener letras"
            control={control}
            error={errors.motherLastName}
            value={data.motherLastName}
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          />
        </div>
        <div className="col-span-4">
          {/* <TextField
            // info={"Numero de telefono"}
            patternName="Invalido"
            placeholder="Celular (Opcional)"
            type="text"
            // long
            onChange={handleChange}
            value={data.phone}
            error={errors.phone}
            // componentLeft="PE"
            control={control}
            name="phone"
            rules={{
              pattern: /^[0-9,$]*$/,
            }}
          /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            placeholder="Celular (Opcional)"
            name="phone"
            patternName="Invalido"
            control={control}
            error={errors.phone}
            value={data.phone}
            rules={{
              pattern: /^[0-9,$]*$/,
            }}
          />
        </div>
      </div>
      <div>
        <div className="text-neutral-400 text-sm p-1">
          <span>Fecha de nacimiento</span>
        </div>
        <div className="grid grid-cols-12 gap-3 ">
          <div className="col-span-4">
            <ComboboxUnivercel
              onChange={handleChange}
              error={errors.day}
              control={control}
              placeHolder="Dia"
              options={[
                {
                  data: days.map((day) => {
                    return {
                      name: day,
                      value: day,
                    };
                  }),
                },
              ]}
              value={parseInt(data.day)}
              name="day"
            />
            {console.log(data.day)}
          </div>
          <div className="col-span-4">
            <ComboboxUnivercel
              onChange={handleChange}
              error={errors.month}
              control={control}
              placeHolder="Mes"
              options={[
                {
                  data: monthsDate.map((month, index) => {
                    return {
                      name: month,
                      value: index + 1,
                    };
                  }),
                },
              ]}
              value={parseInt(data.month)}
              name="month"
            />
          </div>
          <div className="col-span-4">
            <ComboboxUnivercel
              onChange={handleChange}
              error={errors.year}
              control={control}
              placeHolder="Año"
              options={[
                {
                  data: years.map((year) => {
                    return {
                      name: year,
                      value: year,
                    };
                  }),
                },
              ]}
              minName="Tienes que ser mayor de edad"
              value={parseInt(data.year)}
              name="year"
            />
          </div>
        </div>
      </div>
      {data.younger && (
        <div className="py-2 col-span-6">
          {/* <TextField
              // info={"Apoderado"}
              requiredName="Ingrese los nombres del apoderado"
              patternName="El apellido solo debe contener letras"
              placeholder="Apoderado"
              type="text"
              // long
              onChange={handleChange}
              value={data.attorney}
              error={errors.attorney}
              control={control}
              name="attorney"
              rules={{
                required: true,
                pattern:
                  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
              }}
            /> */}
          <TextFieldUnivercel
            onChange={handleChange}
            name="attorney"
            requiredName="Ingrese los nombres del apoderado"
            patternName="El apellido solo debe contener letras"
            placeholder="Apoderado"
            control={control}
            error={errors.attorney}
            value={data.attorney}
            rules={{
              required: true,
              pattern:
                /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
            }}
          />
        </div>
      )}
      <div className="grid grid-cols-12 gap-3 ">
        <div className="flex col-span-6 gap-2">
          <div className="w-full pl-1 py-1">
            <CheckBox
              text={"Miembro menor de edad"}
              onChange={(e) => {
                setData({ ...data, younger: e.target.checked });
                changeYouger(e);
              }}
              checked={data.younger}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-4">
          <ComboboxUnivercel
            onChange={handleChange}
            error={errors.groupUid}
            requiredName="Selecciona un grupo"
            control={control}
            placeHolder="Grupo"
            options={[
              {
                data: groups
                  ? groups?.map((group) => {
                      return {
                        name: group.name,
                        value: group.uid,
                      };
                    })
                  : [],
              },
            ]}
            value={data.groupUid}
            name="groupUid"
            rules={{
              required: true,
            }}
          />
        </div>
        <div className="col-span-8">
          <ComboboxUnivercel
            onChange={handleChange}
            error={errors.groupUid}
            control={control}
            placeHolder="Sede"
            requiredName="Selecciona una sede"
            options={[
              {
                data: geadquarters
                  ? geadquarters?.map((item) => {
                      return {
                        name: item.name,
                        value: item.uid,
                        disabled: !item.statu,
                      };
                    })
                  : [],
              },
            ]}
            value={data.geadquarterUid}
            name="geadquarterUid"
            rules={{
              required: true,
            }}
          />
        </div>
      </div>
      {/* <div className="flex gap-2">
        <div className="w-60">
          <h2
            className={`pb-2 ${
              errors["groupUid"]
                ? "text-red-500 dark:text-red-500"
                : "text-neutral-800"
            } pl-1 text-xs dark:text-neutral-100`}
          >
            Selecciona un grupo
          </h2>
          <div
            className={`  bg-[#eef1f3] dark:bg-neutral-800 border dark:border-neutral-600  w-full p-1 rounded-[5px] ${
              errors["groupUid"]
                ? "border-red-600 dark:border-red-500"
                : "border-neutral-300 "
            } `}
          >
            <div className="flex flex-wrap justify-center gap-1 ">
              {groups &&
                groups.map((item, index) => (
                  <div
                    onClick={() => {
                      item.statu &&
                        handleChange({
                          target: {
                            name: "groupUid",
                            value: item.uid,
                          },
                        });
                      item.statu && clearErrors("groupUid");
                      item.statu && setValue("groupUid", item.uid);
                    }}
                    tooltip={!item.statu ? "Grupo inactivo" : null}
                    key={index}
                  >
                    <div
                      tabIndex="0"
                      role="button"
                      className={`transition-colors w-[30px] h-[30px] flex items-center justify-center ${
                        !item.statu && "opacity-20 cursor-default"
                      } cursor-pointer    py-2 p-3 rounded-full  ${
                        item.uid === data.groupUid
                          ? "  bg-green-700  text-neutral-50 dark:text-white  hover:bg-green-800"
                          : "hover:bg-[#a5a6a771] dark:text-neutral-100 "
                      }`}
                    >
                      <span className="font-semibold text-xs">{item.name}</span>
                    </div>
                  </div>
                ))}
              {groups && groups.length < 1 && (
                <div className=" text-neutral-600 leading-4 w-full p-1">
                  <img
                    width="101"
                    className="mx-auto h-70 pb-1"
                    src="/assets/no-data.png"
                    alt=""
                  />
                  <span className="text-sm dark:text-neutral-100">
                    Sin grupos
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-60">
          <h2
            className={`pb-2 ${
              errors["geadquarterUid"]
                ? "text-red-500 dark:text-red-500"
                : "text-neutral-800"
            } pl-1 text-xs dark:text-neutral-100`}
          >
            Selecciona una sede
          </h2>
          <div
            className={`bg-[#eef1f3] dark:bg-neutral-800 dark:border-neutral-600 border  w-full p-1 rounded-[5px] ${
              errors["geadquarterUid"]
                ? "border-red-600 dark:border-red-500"
                : "border-neutral-300 "
            } `}
          >
            <div className="flex flex-wrap gap-0 ">
              {geadquarters &&
                geadquarters.map((item, index) => (
                  <div
                    className="w-full"
                    tooltip={!item.statu ? "Sede inactivo" : null}
                    key={index}
                  >
                    <div
                      onClick={() => {
                        item.statu &&
                          handleChange({
                            target: {
                              name: "geadquarterUid",
                              value: item.uid,
                            },
                          });
                        item.statu && clearErrors("geadquarterUid");
                        item.statu && setValue("geadquarterUid", item.uid);
                      }}
                      role="button"
                      tabIndex="0"
                      className={`transition-colors ${
                        !item.statu && "opacity-20 cursor-default"
                      } ${
                        item.uid === data.geadquarterUid &&
                        "bg-green-700  text-zinc-50 hover:bg-green-800"
                      } cursor-pointer  hover:bg-[#a5a6a771] dark:text-zinc-300 p-2 rounded-md`}
                    >
                      <h3 className="text-xs font-semibold dark:text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                ))}
              {geadquarters && geadquarters.length < 1 && (
                <div className=" text-neutral-600 leading-4 w-full p-1">
                  <img
                    width="100"
                    // height="80"
                    className="mx-auto pb-1"
                    src="/assets/world.png"
                    alt=""
                  />
                  <span className="text-sm  dark:text-neutral-100">
                    Sin sedes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6">
          <TextFieldUnivercel
            onChange={handleChange}
            name="entryDate"
            placeholder="Fecha de entrada"
            requiredName="Ingrese la fecha de entrada"
            control={control}
            error={errors.entryDate}
            type="date"
            value={data.entryDate}
          />
        </div>
        <div className="col-span-6">
          <TextFieldUnivercel
            onChange={handleChange}
            name="dischargeDate"
            placeholder="Fecha de baja"
            control={control}
            error={errors.dischargeDate}
            type="date"
            value={data.dischargeDate}
          />
        </div>
      </div>
      {/* <div className=" my-2">
        <div className="flex gap-2">


          <div className="w-full">
            <TextField
              info={"Fecha de baja"}
              type="date"
              long
              onChange={handleChange}
              value={data.dischargeDate}
              error={errors.dischargeDate}
              control={control}
              name="dischargeDate"
            />
          </div>
        </div>
      </div> */}
      <div className=" gap-2">
        <div className=" w-full  mb-2">
          <h3 className="dark:text-zinc-100 text-xl tracking-tight font-semibold pl-1">
            Gestión de cuotas y pagos
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4">
            <TextFieldUnivercel
              name="memberFee"
              placeholder="Cuota miembro"
              requiredName="La cuota es obligatorio"
              minName={`La cuota minima es S/${
                isYear(data.year) < 26 ? 30.0 : 40.0
              }`}
              onChange={handleChange}
              onBlur={handleOnBlur}
              type="money"
              control={control}
              error={errors.memberFee}
              value={data.memberFee}
              rules={{
                required: true,
                min: isYear(data.year) < 26 ? 30 : 40,
                pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
              }}
            />
          </div>
          <div className="col-span-4">
            <TextFieldUnivercel
              name="bookletFee"
              placeholder="Cuota Librito"
              requiredName="La cuota es obligatorio"
              minName="La cuota minima es S/ 2.00"
              onChange={handleChange}
              onBlur={handleOnBlur}
              type="money"
              control={control}
              error={errors.bookletFee}
              value={data.bookletFee}
              rules={{
                required: true,
                min: 2,
                pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
              }}
            />
          </div>
          <div className="col-span-4">
            <TextFieldUnivercel
              name="celebrationFee"
              placeholder="Cuota Celebración"
              requiredName="La cuota es obligatorio"
              minName="La cuota minima es S/3.00"
              onChange={handleChange}
              onBlur={handleOnBlur}
              type="money"
              control={control}
              error={errors.celebrationFee}
              value={data.celebrationFee}
              rules={{
                min: 3,
                required: true,
                pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
              }}
            />
          </div>
        </div>
        {/* <div>
          <div className="flex gap-2">
            <div className="w-full">
              <TextField
                info={"Cuota miembro"}
                requiredName="La cuota es obligatorio"
                minName={`La cuota minima es S/${
                  isYear(data.year) < 26 ? 30.0 : 40.0
                }`}
                patternName="Solo numeros"
                placeholder="0.00"
                componentLeft="S/"
                type="text"
                // long
                onChange={handleChange}
                onBlur={handleOnBlur}
                value={data.memberFee}
                error={errors.memberFee}
                control={control}
                name="memberFee"
                rules={{
                  required: true,
                  min: isYear(data.year) < 26 ? 30 : 40,
                  pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                }}
              />
            </div>
            <div className="w-full">
              <TextField
                info={"Cuota Librito"}
                requiredName="La cuota es obligatorio"
                minName="La cuota minima es S/ 2.00"
                patternName="Solo numeros"
                placeholder="0.00"
                componentLeft="S/"
                type="text"
                // long
                onBlur={handleOnBlur}
                onChange={handleChange}
                value={data.bookletFee}
                error={errors.bookletFee}
                control={control}
                name="bookletFee"
                rules={{
                  required: true,
                  min: 2,
                  pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                }}
              />
            </div>
            <div className="w-full">
              <TextField
                info={"Cuota Celebración"}
                requiredName="La cuota es obligatorio"
                minName="La cuota minima es S/3.00"
                patternName="Solo numeros"
                placeholder="0.00"
                type="text"
                componentLeft="S/"
                // long
                onBlur={handleOnBlur}
                onChange={handleChange}
                value={data.celebrationFee}
                error={errors.celebrationFee}
                control={control}
                name="celebrationFee"
                rules={{
                  min: 3,
                  required: true,
                  pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                }}
              />
            </div>
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <TextFieldUnivercel
            name="observations"
            placeholder="Observaciones"
            onChange={handleChange}
            onBlur={handleOnBlur}
            multiple
            control={control}
            error={errors.observations}
            value={data.observations}
          />
        </div>
      </div>
      {/* <div className=" gap-2 mt-3">
        <div>
          <div className="flex gap-2">
            <div className="w-full">
              <TextField
                multiple
                info={"Observaciones"}
                requiredName="La cuota es obligatorio"
                placeholder="(Opcional)"
                type="text"
                onChange={handleChange}
                value={data.observations}
                error={errors.observations}
                control={control}
                name="observations"
                rules={{}}
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex items-center gap-2 dark:text-white text-base">
        <span className="dark:text-zinc-400 ">Cuota mensual</span>
        <span className="text-xl">
          S/ {!data.totalFee.isNaN && data.totalFee}
        </span>
      </div>
      <div className="flex gap-2">
        <div className="w-full pl-2 py-1">
          <CheckBox
            text={data.statu ? "Miembro Activo" : "Miembro Inactivo"}
            onChange={(e) => setData({ ...data, statu: e.target.checked })}
            checked={data.statu}
          />
        </div>
      </div>
      <div>
        <PrimaryButton
          disabled={Object.entries(errors).length > 0 ? true : false}
          onClick={handleSubmit(onSubmit)}
          type="primary_transparent"
        >
          {props.data ? "Actualizar" : "Guardar"}
        </PrimaryButton>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,.5)] dark:bg-neutral-700/50 rounded-xl">
          <div className="w-full h-full flex items-center justify-center">
            <Rotation width="60px" height="60px" />
          </div>
        </div>
      )}
    </div>
  );
}
