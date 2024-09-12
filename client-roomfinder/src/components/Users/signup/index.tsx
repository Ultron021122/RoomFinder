'use client';

import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Componentes
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { Button, Spinner } from "@nextui-org/react";
import ModalImage from "./image";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Utilidades
import { messages, patterns, universities, roles } from "@/utils/constants";
import { StudentInfo, LessorInfo } from "@/utils/interfaces";
import Footer from "@/components/Footer";
import { Alert } from '@/utils/alert';

const Registrar = () => {
    const { status } = useSession();
    const router = useRouter();

    const { control, register, handleSubmit, formState: { errors }, watch, reset, setValue, setError, clearErrors } = useForm<StudentInfo | LessorInfo>({ mode: "onChange", defaultValues: { bnstatus: true } });
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    const [darkMode, setDarkMode] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const validatePasswordConfirmation = (value: string) => {
        const password = watch('vchpassword'); // Obtener el valor de la contraseña
        return value === password || messages.confirm_password.validate; // Comparar contraseñas
    }

    const handleImageSave = (imageFile: string | null) => {
        if (imageFile) {
            setValue("vchimage", imageFile);
            clearErrors("vchimage");
        } else {
            setError("vchimage", {
                type: "required",
                message: messages.profilImage.required
            });
        }
    };

    // Errores
    useEffect(() => {
        if (errorSystem) {
            toast.error(errorSystem, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [errorSystem]);

    // Registro de usuarios
    const onSubmit = async (userInfo: StudentInfo | LessorInfo) => {
        if (!userInfo.vchimage) {
            setError("vchimage", {
                type: "required",
                message: messages.profilImage.required
            });
        } else {
            setIsLoading(true);
            setErrorSystem(null);

            if (userInfo.roleid === 1) {
                const data = userInfo as StudentInfo;
                try {
                    const response = await axios.post("/api/users/student", data);
                    setIsLoading(false);
                    if (response.status === 201) {
                        toast.success(response.data.message.message, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                            transition: Slide,
                        });
                        reset();
                    } else {
                        setErrorSystem(response.data.message);
                    }
                } catch (Error: any) {
                    setErrorSystem(Error.response?.data.message);
                } finally {
                    setIsLoading(false);
                }

            } else {
                const data = userInfo as LessorInfo;
                try {
                    const response = await axios.post("/api/users/lessor", data);
                    setIsLoading(false);
                    if (response.status === 201) {
                        toast.success(response.data.message.message, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Slide,
                        });
                        reset();
                    } else {
                        setErrorSystem(response.data.message);
                    }
                } catch (Error: any) {
                    if (Error.response?.status == 400) {
                        setErrorSystem(Error.response?.data.message);
                    } else {
                        setErrorSystem(Error.response?.data.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };
    // Efectos
    useEffect(() => {
        const input = document.getElementById('vchname') as HTMLInputElement;
        if (input) {
            input.focus();
        }

        if (status === "authenticated") {
            router.push('/');
        }
    }, [status, router]);
    // Dark Mode 
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setDarkModeFromMediaQuery = () => setDarkMode(darkModeMediaQuery.matches);

        setDarkModeFromMediaQuery();
        darkModeMediaQuery.addEventListener('change', setDarkModeFromMediaQuery);

        setIsLoaded(true);

        return () => {
            darkModeMediaQuery.removeEventListener('change', setDarkModeFromMediaQuery);
        };
    }, []);

    if (!isLoaded) {
        return null;
    }
    // Render de Estudiante
    const renderStudent = () => {
        return (
            <>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("intcodestudent", {
                            required: {
                                value: true,
                                message: messages.intcodestudent.required
                            },
                            min: {
                                value: 100000000,
                                message: messages.intcodestudent.min
                            },
                            max: {
                                value: 999999999,
                                message: messages.intcodestudent.max
                            },
                            valueAsNumber: true,
                        })}
                        type="number"
                        name="intcodestudent"
                        id="intcodestudent"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="intcodestudent" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Codigo de estudiante
                    </label>
                    {errors?.intcodestudent && (
                        <Alert message={errors?.intcodestudent.message} />
                    )}
                </div>
                <div>
                    <FormControl
                        className="w-full mb-2"
                        variant="standard"
                        sx={{
                            '.MuiInput-underline:after': {
                                borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                            },
                            '.MuiInput-underline:before': {
                                borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                borderBottomWidth: '2px',
                            },
                            '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                            },
                        }}
                    >
                        <InputLabel
                            id="university-label"
                            className="peer-focus:font-medium text-sm peer-focus:text-sm"
                            sx={{
                                color: darkMode === true ? '#9ca3af' : '#6b7280',
                                fontSize: '0.875rem',
                                lineHeight: '1.25rem',
                            }}
                        >
                            Universidad
                        </InputLabel>
                        <Controller
                            name="vchuniversity"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: {
                                    value: true,
                                    message: messages.vchuniversity.required
                                }
                            }}
                            render={({ field }) => (
                                <Select
                                    labelId="university-label"
                                    id="vchuniversity"
                                    label="Universidad"
                                    className="text-sm"
                                    sx={{
                                        fontSize: '0.875rem',
                                        lineHeight: '1.25rem',
                                        fontStyle: 'normal',
                                        color: darkMode ? "white" : "#111827",
                                        '.MuiSvgIcon-root ': {
                                            fill: darkMode ? "white !important" : "#111827 !important",
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                color: darkMode ? "#fff" : "#111827",
                                                height: '200px',
                                            },
                                        },
                                    }}
                                    {...field}
                                >
                                    {
                                        universities.map((universidad, index) => (
                                            <MenuItem
                                                value={universidad.name}
                                                key={index}
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    lineHeight: '1.25rem',
                                                    '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                                    '&.Mui-selected:hover': {
                                                        backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                        color: darkMode ? '#3b82f6' : '#fff',
                                                    }, // Style when selected and hovered
                                                    '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                                }}
                                            >
                                                {universidad.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            )}
                        />
                        <FormHelperText
                            sx={{
                                color: darkMode ? '#d1d5db' : '#4b5563',
                            }}
                        >
                            Selecciona una universidad
                        </FormHelperText>
                        {errors?.vchuniversity && (
                            <Alert message={errors?.vchuniversity.message} />
                        )}
                    </FormControl>
                </div>
            </>
        );
    };
    // Render de Arrendador 
    const renderLessor = () => {
        return (
            <>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                    <div>
                        <div className="relative z-0 w-full group">
                            <input
                                {...register("vchphone", {
                                    required: {
                                        value: true,
                                        message: messages.vchphone.required
                                    }
                                })
                                }
                                type="text"
                                name="vchphone"
                                id="vchphone"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=""
                                autoComplete="off"
                            />
                            <label htmlFor="vchphone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Teléfono
                            </label>
                            {errors?.vchphone && (
                                <Alert message={errors?.vchphone.message} />
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="relative z-0 w-full group">
                            <input
                                {...register("intzip", {
                                    required: {
                                        value: true,
                                        message: messages.intzip.required
                                    },
                                    min: {
                                        value: 10000,
                                        message: messages.intzip.min
                                    },
                                    max: {
                                        value: 99999,
                                        message: messages.intzip.max
                                    },
                                    valueAsNumber: true
                                })
                                }
                                type="number"
                                name="intzip"
                                id="intzip"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=""
                                autoComplete="off"
                            />
                            <label htmlFor="intzip" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código Postal
                            </label>
                            {errors?.intzip && (
                                <Alert message={errors?.intzip.message} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("vchstreet", {
                            required: {
                                value: true,
                                message: messages.vchstreet.required
                            }
                        })
                        }
                        type="text"
                        name="vchstreet"
                        id="vchstreet"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="vchstreet" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Calle
                    </label>
                    {errors?.vchstreet && (
                        <Alert message={errors?.vchstreet.message} />
                    )}
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("vchsuburb", {
                            required: {
                                value: true,
                                message: messages.vchsuburb.required
                            }
                        })
                        }
                        type="text"
                        name="vchsuburb"
                        id="vchsuburb"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="vchsuburb" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Colonia
                    </label>
                    {errors?.vchsuburb && (
                        <Alert message={errors?.vchsuburb.message} />
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                    <div className="relative z-0 w-full group">
                        <input
                            {...register("vchmunicipality", {
                                required: {
                                    value: true,
                                    message: messages.vchmunicipality.required
                                }
                            })
                            }
                            type="text"
                            name="vchmunicipality"
                            id="vchmunicipality"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            autoComplete="off"
                        />
                        <label htmlFor="vchmunicipality" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Municipio
                        </label>
                        {errors?.vchmunicipality && (
                            <Alert message={errors?.vchmunicipality.message} />
                        )}
                    </div>
                    <div className="relative z-0 w-full mb-2 group">
                        <input
                            {...register("vchstate", {
                                required: {
                                    value: true,
                                    message: messages.vchstate.required
                                }
                            })
                            }
                            type="text"
                            name="vchstate"
                            id="vchstate"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            autoComplete="off"
                        />
                        <label htmlFor="vchstate" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Estado
                        </label>
                        {errors?.vchstate && (
                            <Alert message={errors?.vchstate.message} />
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <PerfectScrollbar>
                    {isLoading ?
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                            <Spinner />
                        </div>
                        :
                        <div className="h-[100vh] ">
                            <div className="flex flex-col items-center px-6 py-8 mx-auto lg:py-0 mt-[73px]">
                                <div className="w-full my-5 bg-white rounded-lg shadow dark:border sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Registrar Usuario
                                        </h1>
                                        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                            <ModalImage onImageSave={handleImageSave} />
                                            {errors?.vchimage && (
                                                <Alert message={errors?.vchimage.message} />
                                            )}
                                            <h4 className="mt-7 text-center text-lg font-semibold leading-tight tracking-tight text-gray-700 dark:text-gray-200">
                                                Datos del usuario
                                            </h4>
                                            {/* Nombre(s) */}
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("vchname", {
                                                        required: {
                                                            value: true,
                                                            message: messages.vchname.required
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: messages.vchname.min
                                                        },
                                                        maxLength: {
                                                            value: 25,
                                                            message: messages.vchname.max
                                                        },
                                                    })}
                                                    type="text"
                                                    name="vchname"
                                                    id="vchname"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                    autoComplete="off"
                                                />
                                                <label htmlFor="vchname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Nombre(s)
                                                </label>
                                                {errors?.vchname && (
                                                    <Alert message={errors?.vchname.message} />
                                                )}
                                            </div>
                                            {/* Apellido paterno y materno */}
                                            <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                                                <div>
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchpaternalsurname", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchpaternalsurname.required
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    message: messages.vchpaternalsurname.min
                                                                },
                                                                maxLength: {
                                                                    value: 25,
                                                                    message: messages.vchpaternalsurname.max
                                                                }
                                                            })}
                                                            type="text"
                                                            name="vchpaternalsurname"
                                                            id="vchpaternalsurname"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label htmlFor="vchpaternalsurname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                            Apellido paterno
                                                        </label>
                                                        {errors?.vchpaternalsurname && (
                                                            <Alert message={errors?.vchpaternalsurname.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchmaternalsurname", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchmaternalsurname.required
                                                                },
                                                                minLength: {
                                                                    value: 3,
                                                                    message: messages.vchmaternalsurname.min
                                                                },
                                                                maxLength: {
                                                                    value: 25,
                                                                    message: messages.vchmaternalsurname.max
                                                                },
                                                            })}
                                                            type="text"
                                                            name="vchmaternalsurname"
                                                            id="vchmaternalsurname"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                            autoComplete="off"
                                                        />
                                                        <label htmlFor="vchmaternalsurname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                            Apellido materno
                                                        </label>
                                                        {errors?.vchmaternalsurname && (
                                                            <Alert message={errors?.vchmaternalsurname.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Correo Electrónico */}
                                            <div className="relative z-0 w-full mb-2 group">
                                                <input
                                                    {...register("vchemail", {
                                                        required: {
                                                            value: true,
                                                            message: messages.vchemail.required
                                                        },
                                                        pattern: {
                                                            value: patterns.vchemail,
                                                            message: messages.vchemail.pattern
                                                        }
                                                    })}
                                                    type="email"
                                                    name="vchemail"
                                                    id="vchemail"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                    autoComplete="off"
                                                />
                                                <label htmlFor="vchemail" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo electrónico</label>
                                                {errors?.vchemail && (
                                                    <Alert message={errors?.vchemail.message} />
                                                )}
                                            </div>
                                            {/* Seguridad */}
                                            <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                                                {/* Contraseña */}
                                                <div>
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("vchpassword", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.vchpassword.required
                                                                },
                                                                minLength: {
                                                                    value: 8,
                                                                    message: messages.vchpassword.min
                                                                },
                                                                maxLength: {
                                                                    value: 16,
                                                                    message: messages.vchpassword.max
                                                                }
                                                            })}
                                                            type="password"
                                                            name="vchpassword"
                                                            id="vchpassword"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                        />
                                                        <label htmlFor="vchpassword" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                            Contraseña
                                                        </label>
                                                        {errors?.vchpassword && (
                                                            <Alert message={errors?.vchpassword.message} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="relative z-0 w-full group">
                                                        <input
                                                            {...register("confirm_password", {
                                                                required: {
                                                                    value: true,
                                                                    message: messages.confirm_password.required
                                                                },
                                                                minLength: {
                                                                    value: 8,
                                                                    message: messages.confirm_password.min
                                                                },
                                                                maxLength: {
                                                                    value: 16,
                                                                    message: messages.confirm_password.max
                                                                },
                                                                validate: validatePasswordConfirmation // Agregar función de validation
                                                            })}
                                                            type="password"
                                                            name="confirm_password"
                                                            id="confirm_password"
                                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                            placeholder=""
                                                        />
                                                        <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                            Repetir contraseña
                                                        </label>
                                                        {errors?.confirm_password && (
                                                            <Alert message={errors?.confirm_password.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Tipo de usuario */}
                                            <div>
                                                <FormControl
                                                    className="w-full mb-2"
                                                    variant="standard"
                                                    sx={{
                                                        '.MuiInput-underline:after': {
                                                            borderBottomColor: darkMode === true ? '#3b82f6' : '#2563eb',
                                                        },
                                                        '.MuiInput-underline:before': {
                                                            borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                                            borderBottomWidth: '2px',
                                                        },
                                                        '.MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                            borderBottomColor: darkMode === true ? '#4b5563' : '#d1d5db',
                                                        },
                                                    }}
                                                >
                                                    <InputLabel
                                                        id="type-user-label"
                                                        className="peer-focus:font-medium text-sm peer-focus:text-sm"
                                                        sx={{
                                                            color: darkMode === true ? '#9ca3af' : '#6b7280',
                                                            fontSize: '0.875rem',
                                                            lineHeight: '1.25rem',
                                                        }}
                                                    >
                                                        Tipo de usuario
                                                    </InputLabel>
                                                    <Controller
                                                        name="roleid"
                                                        control={control}
                                                        defaultValue={1}
                                                        rules={{
                                                            required: {
                                                                value: true,
                                                                message: messages.roleid.required
                                                            }
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                labelId="type-user-label"
                                                                id="roleid"
                                                                label="Tipo de usuario"
                                                                className="text-sm"
                                                                sx={{
                                                                    fontSize: '0.875rem',
                                                                    lineHeight: '1.25rem',
                                                                    fontStyle: 'normal',
                                                                    color: darkMode ? "white" : "#111827",
                                                                    '.MuiSvgIcon-root ': {
                                                                        fill: darkMode ? "white !important" : "#111827 !important",
                                                                    }
                                                                }}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                                                                            color: darkMode ? "#fff" : "#111827",
                                                                            maxHeight: '200px',
                                                                        },
                                                                    },
                                                                }}
                                                                {...field}
                                                            >
                                                                {
                                                                    roles.map((rol, index) => (
                                                                        <MenuItem
                                                                            value={rol.roleid}
                                                                            key={index}
                                                                            sx={{
                                                                                fontSize: '0.875rem',
                                                                                lineHeight: '1.25rem',
                                                                                '&.Mui-selected': { backgroundColor: darkMode ? '#1f2937' : "#9ca3af" }, // Style when selected
                                                                                '&.Mui-selected:hover': {
                                                                                    backgroundColor: darkMode ? '#111827' : "#6b7280",
                                                                                    color: darkMode ? '#3b82f6' : '#fff',
                                                                                }, // Style when selected and hovered
                                                                                '&:hover': { backgroundColor: darkMode ? '#374151' : "#d1d5db" }, // Style when hovered
                                                                            }}
                                                                        >
                                                                            {rol.vchname}
                                                                        </MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        )}
                                                    />
                                                    <FormHelperText
                                                        sx={{
                                                            color: darkMode ? '#d1d5db' : '#4b5563',
                                                        }}
                                                    >
                                                        Selecciona un tipo de usuario
                                                    </FormHelperText>
                                                    {errors?.roleid && (
                                                        <Alert message={errors?.roleid.message} />
                                                    )}
                                                </FormControl>
                                            </div>
                                            {/* Fecha de nacimiento */}
                                            <div className="relative z-0 w-full mb-2 group">
                                                <input
                                                    {...register("dtbirthdate", {
                                                        required: {
                                                            value: true,
                                                            message: messages.dtbirthdate.required
                                                        },
                                                        valueAsDate: true,
                                                        validate: (value) => {
                                                            const fechaNacimiento = new Date(value);
                                                            const fechaActual = new Date();
                                                            const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                                                            return edad >= 18 || messages.dtbirthdate.age;
                                                        },
                                                    })}
                                                    type="date"
                                                    name="dtbirthdate"
                                                    id="dtbirthdate"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder="Enter your date"
                                                    max="2007-01-01"
                                                    min="1900-01-01"
                                                />
                                                <label htmlFor="dtbirthdate" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Fecha de nacimiento
                                                </label>
                                                {errors?.dtbirthdate && (
                                                    <Alert message={errors?.dtbirthdate?.message} />
                                                )}
                                            </div>
                                            {watch("roleid") === 1 && renderStudent()}
                                            {watch("roleid") === 2 && renderLessor()}
                                            <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                                Registrar
                                            </Button>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ¿Ya tienes una cuenta? <Link href='/users/login' className="text-sky-600 hover:underline dark:text-sky-500">Ingresar</Link>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div >
                            <Footer />
                        </div>
                    }
                </PerfectScrollbar>
            </section >
        </>
    );
}

export default Registrar;
