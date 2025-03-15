'use client';

import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Componentes
import { Controller, useForm } from "react-hook-form";
import { Button, Spinner } from "@nextui-org/react";
import ModalImage from "./image";
// Estilos de algunos componentes
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Utilidades
import { messages, patterns, universities, roles, ESTUDIANTE } from "@/utils/constants";
import { fifteenYearsAgo } from "@/utils/functions";
import { StudentInfo, LessorInfo } from "@/utils/interfaces";
import { Alert } from '@/utils/alert';
import { SelectContent, SelectItem, SelectTrigger, Select as SelectS, SelectValue } from "@/components/ui/select";
import { Button as ButtonS } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

const Registrar = () => {
    const { status } = useSession();
    const router = useRouter();

    const { control, register, handleSubmit, formState: { errors }, watch, reset, setValue, setError, clearErrors } = useForm<StudentInfo | LessorInfo>({ mode: "onChange", defaultValues: { bnstatus: true } });
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [isZipValidated, setIsZipValidated] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [municipality, setMunicipality] = useState({ city: "", state: "" });

    const validatePasswordConfirmation = (value: string) => {
        const password = watch('vchpassword'); // Obtener el valor de la contraseña
        return value === password || messages.confirm_password.validate; // Comparar contraseñas
    }

    const handleZipValidation = async (zip: string) => {
        try {
            const response = await axios.get(`https://api.zippopotam.us/mx/${zip}`);
            if (response.status === 200) {
                setLocationData(response.data.places);
                setIsZipValidated(true);

                try {
                    const response = await axios.get(`/api/address/${zip}`);
                    if (response.status === 200) {
                        const { city, state } = response.data.response;
                        setMunicipality({ city, state });
                    }
                } catch (error) {
                    console.error("Error consult data: ", error);
                }
            }
        } catch (error) {
            console.error("Error fetching data from Zippopotamus API", error);
        }
    };

    useEffect(() => {
        const subscription = watch((value) => {
            if (value.intzip && value.intzip.length === 5) {
                handleZipValidation(value.intzip);
            } else {
                setIsZipValidated(false);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

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

            console.log(userInfo)
            if (userInfo.roleid === ESTUDIANTE) {
                const data = userInfo as StudentInfo;
                try {
                    const response = await axios.post("/api/users/student",
                        data,
                        {
                            headers: {
                                'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                            }
                        });
                    setIsLoading(false);
                    if (response.status === 201) {
                        toast.success(response.data.message.message, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                            transition: Slide,
                        });
                        reset();
                        router.push('/users/login');
                    } else {
                        setErrorSystem(response.data.message);
                    }
                } catch (Error: any) {
                    setErrorSystem(Error.response?.data.message);
                } finally {
                    setIsLoading(false);
                }

            } else { // Arrendador
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
                        router.push('/users/login');
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

    // Render de Estudiante
    const renderStudent = () => {
        return (
            <div>
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
                    <Label id="university-label" className="peer-focus:font-medium text-sm peer-focus:text-sm text-gray-500 dark:text-gray-400">
                        Universidad
                    </Label>
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
                            <SelectS
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                    <SelectValue placeholder="Selecciona una universidad" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-700 text-sm">
                                    {universities.map((universidad, index) => (
                                        <SelectItem
                                            value={universidad.name}
                                            key={index}
                                        >
                                            {universidad.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectS>
                        )}
                    />
                    <div className="text-gray-600 dark:text-gray-500 text-sm mt-1">
                        Selecciona una universidad
                    </div>
                    {errors?.vchuniversity && (
                        <Alert message={errors?.vchuniversity.message} />
                    )}
                </div>
            </div>
        );
    };
    // Render de Arrendador 
    const renderLessor = () => {
        return (
            <div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                    <div>
                        <div className="relative z-0 w-full group">
                            <input
                                {...register("vchphone", {
                                    required: {
                                        value: true,
                                        message: messages.vchphone.required
                                    },
                                    pattern: {
                                        value: patterns.vchphone,
                                        message: messages.vchphone.pattern
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
                        <div className="relative z-0 w-full mb-3 group">
                            <input
                                {...register("intzip", {
                                    required: {
                                        value: true,
                                        message: messages.intzip.required
                                    },
                                    minLength: {
                                        value: 5,
                                        message: messages.intzip.min
                                    },
                                    maxLength: {
                                        value: 5,
                                        message: messages.intzip.max
                                    }
                                })
                                }
                                type="string"
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
                <div className="relative z-0 w-full mb-3 group">
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
                        disabled={!isZipValidated}
                    />
                    <label htmlFor="vchstreet" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Calle
                    </label>
                    {errors?.vchstreet && (
                        <Alert message={errors?.vchstreet.message} />
                    )}
                </div>

                {/* Colonia */}
                <div className="mb-4">
                    <Label id="vchsuburb-label" className="peer-focus:font-medium text-sm peer-focus:text-sm text-gray-500 dark:text-gray-400">
                        Colonia
                    </Label>
                    <Controller
                        name="vchsuburb"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: messages.vchsuburb.required
                            }
                        }}
                        render={({ field }) => (
                            <SelectS
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                    <SelectValue placeholder="Selecciona tú colonia" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-700">
                                    {locationData.map((place, index) => (
                                        <SelectItem
                                            value={place?.["place name"]}
                                            key={index}
                                        >
                                            {place?.["place name"]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectS>
                        )}
                    />
                    {errors?.vchsuburb && (
                        <Alert message={errors?.vchsuburb.message} />
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-3">
                    <Controller
                        name="vchmunicipality"
                        control={control}  // Asegúrate de tener `control` de `useForm` de react-hook-form
                        defaultValue={municipality.city || ''}  // Asigna un valor predeterminado
                        render={({ field }) => (
                            <div className="relative z-0 w-full mb-2 group">
                                <input
                                    {...field}  // Esto conectará el campo con react-hook-form
                                    type="text"
                                    name="vchmunicipality"
                                    id="vchmunicipality"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=""
                                    autoComplete="off"
                                    value={municipality.city || municipality.state}
                                />
                                <label htmlFor="vchmunicipality" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Municipio
                                </label>
                                {errors?.vchmunicipality && (
                                    <Alert message={errors?.vchmunicipality.message} />
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="vchstate"
                        control={control}  // Asegúrate de tener `control` de `useForm` de react-hook-form
                        defaultValue={municipality.state || ''}  // Asigna un valor predeterminado
                        render={({ field }) => (
                            <div className="relative z-0 w-full mb-2 group">
                                <input
                                    {...field}  // Esto conectará el campo con react-hook-form
                                    type="text"
                                    name="vchstate"
                                    id="vchstate"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=""
                                    autoComplete="off"
                                    value={municipality.state}
                                />
                                <label htmlFor="vchstate" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Estado
                                </label>
                                {errors?.vchstate && (
                                    <Alert message={errors?.vchstate.message} />
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        );
    };

    return (
        <div>
            <section className=" dark:bg-gray-900">
                {isLoading ?
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                        <Spinner />
                    </div>
                    :
                    <div>
                        <div className="flex flex-col justify-center items-center px-6 pb-8 pt-24 mx-auto">
                            <div className="w-full my-5 bg-white rounded-lg shadow dark:border sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-800">
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
                                                            },
                                                            pattern: {
                                                                value: patterns.vchpassword,
                                                                message: messages.vchpassword.pattern
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
                                            <Label id="university-label" className="peer-focus:font-medium text-sm peer-focus:text-sm text-gray-500 dark:text-gray-400">
                                                Selecciona un tipo de usuario
                                            </Label>
                                            <Controller
                                                name="roleid"
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: messages.vchuniversity.required
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <SelectS
                                                        value={field.value?.toString() ?? ''}
                                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                                    >
                                                        <SelectTrigger className="border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                                            <SelectValue placeholder="Selecciona un tipo de usuario" />
                                                        </SelectTrigger>
                                                        <SelectContent className="dark:bg-gray-700">
                                                            {roles.map((rol, index) => (
                                                                <SelectItem
                                                                    value={rol.roleid.toString()}
                                                                    key={index}
                                                                >
                                                                    {rol.vchname}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </SelectS>
                                                )}
                                            />
                                            {errors?.roleid && (
                                                <Alert message={errors?.roleid.message} />
                                            )}
                                        </div>
                                        {/* Fecha de nacimiento */}
                                        {/* <div className="relative z-0 w-full mb-2 group">
                                            <input
                                                {...register("dtbirthdate", {
                                                    required: {
                                                        value: true,
                                                        message: messages.dtbirthdate.required
                                                    },
                                                    valueAsDate: true,
                                                    validate: (value) => validateDate(value),
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
                                        </div> */}
                                        <div>
                                            <Label id="university-label" className="peer-focus:font-medium font-normal text-sm peer-focus:text-sm text-gray-500 dark:text-gray-400">
                                                Fecha de nacimiento
                                            </Label>
                                            <Controller
                                                control={control}
                                                name="dtbirthdate"
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: messages.dtbirthdate.required
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <div className="flex flex-col">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <ButtonS
                                                                    variant={null}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal border rounded-md border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:dark:bg-slate-100",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(new Date(field.value), "PPP", { locale: es })
                                                                    ) : (
                                                                        <span>Elige una fecha</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </ButtonS>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    locale={es}
                                                                    selected={new Date(field.value)}
                                                                    onSelect={field.onChange}
                                                                    disabled={{ after: fifteenYearsAgo }}
                                                                    defaultMonth={fifteenYearsAgo}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        {errors?.dtbirthdate && (
                                                            <Alert message={errors?.dtbirthdate?.message} />
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        {watch("roleid") === 1 && renderStudent()}
                                        {watch("roleid") === 2 && renderLessor()}
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor="newsletter"
                                                    className="font-light text-gray-500 dark:text-gray-300"
                                                >
                                                    Acepto los
                                                    <Link
                                                        className="ml-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                                        href="#"
                                                    >
                                                        Terminos y Condiciones
                                                    </Link>
                                                </label>
                                            </div>
                                        </div>
                                        <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                            Registrar
                                        </Button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ¿Ya tienes una cuenta? <Link href='/users/login' className="text-primary-600 hover:underline dark:text-primary-500">Ingresar</Link>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div >
                    </div>
                }
            </section >
        </div>
    );
}

export default Registrar;
