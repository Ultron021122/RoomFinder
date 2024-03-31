import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";
import { messages, patterns, universities } from "./constants";
import { useSessionStore } from "../sesion/global";
import { Alert } from "./alert";
import { ToastContainer, toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalImage from "./image";

interface User {
    type_user: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    status: string;
    birthday: string;
    profileImage: string;
}

interface StudentInfo extends User {
    code_student: number;
    university: string;
    phone?: string;
    street?: string;
    zip?: number;
    suburb?: string;
    municipality?: string;
    state?: string;
}

interface LessorInfo extends User {
    code_student?: number;
    university?: string;
    phone: string;
    street: string;
    zip: number;
    suburb: string;
    municipality: string;
    state: string;
}

const Signup = () => {
    const { isLoggedIn } = useSessionStore();

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue, setError, clearErrors } = useForm<StudentInfo | LessorInfo>({ mode: "onChange", defaultValues: { status: 'active' } });
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const router = useRouter();

    const validatePasswordConfirmation = (value: string) => {
        const password = watch('password'); // Obtener el valor de la contraseña
        return value === password || messages.confirm_password.validate; // Comparar contraseñas
    }

    const handleImageSave = (imageFile: string | null) => {
        if (imageFile) {
            setValue("profileImage", imageFile);
            clearErrors("profileImage");
        } else {
            setError("profileImage", {
                type: "required",
                message: messages.profilImage.required
            });
        }
    };

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

    const onSubmit = async (userInfo: StudentInfo | LessorInfo) => {
        if (!userInfo.profileImage) {
            setError("profileImage", {
                type: "required",
                message: messages.profilImage.required
            });
        } else {
            setIsLoading(true);
            setErrorSystem(null);

            if (userInfo.type_user === "student") {
                const data = userInfo as StudentInfo;
                try {
                    const response = await axios.post("/api/users/student", data);
                    if (response.status === 201) {
                        setIsLoading(false);
                        toast.success(response.data.message, {
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

            } else {
                const data = userInfo as LessorInfo;
                try {
                    const response = await axios.post("/api/users/lessor", data);
                    if (response.status === 201) {
                        setIsLoading(false);
                        toast.success(response.data.message, {
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

    useEffect(() => {
        const input = document.getElementById('name') as HTMLInputElement;
        input.focus();

        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn]);

    const renderStudent = () => {
        return (
            <>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("code_student", {
                            required: {
                                value: true,
                                message: messages.code_student.required
                            },
                            min: {
                                value: 100000000,
                                message: messages.code_student.min
                            },
                            max: {
                                value: 999999999,
                                message: messages.code_student.max
                            },
                            valueAsNumber: true,
                        })}
                        type="number"
                        name="code_student"
                        id="code_student"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="code_student" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Codigo de estudiante
                    </label>
                    {errors?.code_student && (
                        <Alert message={errors?.code_student.message} />
                    )}
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <select
                        id="university"
                        {...register("university", {
                            required: {
                                value: true,
                                message: messages.university.required
                            }
                        })
                        }
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    >
                        <option value="" className="dark:bg-gray-800 mr-5">Elige una universidad</option>
                        {
                            universities.map((university, index) => (
                                <option className="dark:bg-gray-800" value={university.name} key={index}>{university.name}</option>
                            ))
                        }
                        <option className="dark:bg-gray-800">Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)</option>
                        <option className="dark:bg-gray-800">Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)</option>
                    </select>
                    <label htmlFor="university" className="peer-focus:font-medium absolute peer-focus:text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Universidad</label>
                    {errors?.university && (
                        <Alert message={errors?.university.message} />
                    )}
                </div>
            </>
        );
    };

    const renderLessor = () => {
        return (
            <>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                    <div>
                        <div className="relative z-0 w-full group">
                            <input
                                {...register("phone", {
                                    required: {
                                        value: true,
                                        message: messages.phone.required
                                    }
                                })
                                }
                                type="text"
                                name="phone"
                                id="phone"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=""
                                autoComplete="off"
                            />
                            <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Teléfono
                            </label>
                            {errors?.phone && (
                                <Alert message={errors?.phone.message} />
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="relative z-0 w-full group">
                            <input
                                {...register("zip", {
                                    required: {
                                        value: true,
                                        message: messages.zip.required
                                    },
                                    min: {
                                        value: 10000,
                                        message: messages.zip.min
                                    },
                                    max: {
                                        value: 99999,
                                        message: messages.zip.max
                                    },
                                    valueAsNumber: true
                                })
                                }
                                type="number"
                                name="zip"
                                id="zip"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=""
                                autoComplete="off"
                            />
                            <label htmlFor="zip" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código Postal
                            </label>
                            {errors?.zip && (
                                <Alert message={errors?.zip.message} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("street", {
                            required: {
                                value: true,
                                message: messages.street.required
                            }
                        })
                        }
                        type="text"
                        name="street"
                        id="street"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="street" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Calle
                    </label>
                    {errors?.street && (
                        <Alert message={errors?.street.message} />
                    )}
                </div>
                <div className="relative z-0 w-full mb-2 group">
                    <input
                        {...register("suburb", {
                            required: {
                                value: true,
                                message: messages.suburb.required
                            }
                        })
                        }
                        type="text"
                        name="suburb"
                        id="suburb"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        autoComplete="off"
                    />
                    <label htmlFor="suburb" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Colonia
                    </label>
                    {errors?.suburb && (
                        <Alert message={errors?.suburb.message} />
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                    <div className="relative z-0 w-full group">
                        <input
                            {...register("municipality", {
                                required: {
                                    value: true,
                                    message: messages.municipality.required
                                }
                            })
                            }
                            type="text"
                            name="municipality"
                            id="municipality"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            autoComplete="off"
                        />
                        <label htmlFor="municipality" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Municipio
                        </label>
                        {errors?.municipality && (
                            <Alert message={errors?.municipality.message} />
                        )}
                    </div>
                    <div className="relative z-0 w-full mb-2 group">
                        <input
                            {...register("state", {
                                required: {
                                    value: true,
                                    message: messages.state.required
                                }
                            })
                            }
                            type="text"
                            name="state"
                            id="state"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            autoComplete="off"
                        />
                        <label htmlFor="state" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Estado
                        </label>
                        {errors?.state && (
                            <Alert message={errors?.state.message} />
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <section className="bg-zinc-200 dark:bg-gray-900">
                {isLoading ?
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                        <Spinner />
                    </div>
                    :
                    <div className="flex flex-col items-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                        <div className="w-full my-5 bg-white rounded-lg shadow dark:border sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Registrar Usuario
                                </h1>
                                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                    <ModalImage onImageSave={handleImageSave} />
                                    {errors?.profileImage && (
                                        <Alert message={errors?.profileImage.message} />
                                    )}
                                    <h4 className="mt-7 text-center text-lg font-semibold leading-tight tracking-tight text-gray-700 dark:text-gray-200">
                                        Datos del usuario
                                    </h4>
                                    {/* Nombre y Apellidos */}
                                    <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                                        <div>
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("name", {
                                                        required: {
                                                            value: true,
                                                            message: messages.name.required
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: messages.name.min
                                                        },
                                                        maxLength: {
                                                            value: 25,
                                                            message: messages.name.max
                                                        },
                                                    })}
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                    autoComplete="off"
                                                />
                                                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Nombre
                                                </label>
                                                {errors?.name && (
                                                    <Alert message={errors?.name.message} />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("last_name", {
                                                        required: {
                                                            value: true,
                                                            message: messages.last_name.required
                                                        }
                                                    })}
                                                    type="text"
                                                    name="last_name"
                                                    id="last_name"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                    autoComplete="off"
                                                />
                                                <label htmlFor="last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Apellidos
                                                </label>
                                                {errors?.last_name && (
                                                    <Alert message={errors?.last_name.message} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Correo Electrónico */}
                                    <div className="relative z-0 w-full mb-2 group">
                                        <input
                                            {...register("email", {
                                                required: {
                                                    value: true,
                                                    message: messages.email.required
                                                },
                                                pattern: {
                                                    value: patterns.email,
                                                    message: messages.email.pattern
                                                }
                                            })}
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=""
                                            autoComplete="off"
                                        />
                                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo electrónico</label>
                                        {errors?.email && (
                                            <Alert message={errors?.email.message} />
                                        )}
                                    </div>
                                    {/* Seguridad */}
                                    <div className="grid sm:grid-cols-2 gap-5 sm:gap-2 mb-2">
                                        {/* Contraseña */}
                                        <div>
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("password", {
                                                        required: {
                                                            value: true,
                                                            message: messages.password.required
                                                        },
                                                        minLength: {
                                                            value: 8,
                                                            message: messages.password.min
                                                        },
                                                        maxLength: {
                                                            value: 16,
                                                            message: messages.password.max
                                                        }
                                                    })}
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Contraseña
                                                </label>
                                                {errors?.password && (
                                                    <Alert message={errors?.password.message} />
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
                                    <div className="relative z-0 w-full mb-2 group">
                                        <select
                                            id="type_user"
                                            {...register("type_user", {
                                                required: {
                                                    value: true,
                                                    message: messages.type_user.required
                                                }
                                            })
                                            }
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="" className="dark:bg-gray-800 mr-5">Elige un tipo de usuario</option>
                                            <option value="student" className="dark:bg-gray-800">Estudiante</option>
                                            <option value="lessor" className="dark:bg-gray-800">Arrendador</option>
                                        </select>
                                        <label htmlFor="type_user" className="peer-focus:font-medium absolute peer-focus:text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tipo de usuario</label>
                                        {errors?.type_user && (
                                            <Alert message={errors?.type_user.message} />
                                        )}
                                    </div>
                                    {/* Fecha de nacimiento */}
                                    <div className="relative z-0 w-full mb-2 group">
                                        <input
                                            {...register("birthday", {
                                                required: {
                                                    value: true,
                                                    message: messages.birthday.required
                                                },
                                                valueAsDate: true,
                                                validate: (value) => {
                                                    const fechaNacimiento = new Date(value);
                                                    const fechaActual = new Date();
                                                    const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                                                    return edad >= 18 || messages.birthday.age;
                                                },
                                            })}
                                            type="date"
                                            name="birthday"
                                            id="birthday"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your date"
                                            max="2007-01-01"
                                            min="1900-01-01"
                                        />
                                        <label htmlFor="birthday" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                            Fecha de nacimiento
                                        </label>
                                        {errors?.birthday && (
                                            <Alert message={errors?.birthday?.message} />
                                        )}
                                    </div>
                                    {watch("type_user") === "student" && renderStudent()}
                                    {watch("type_user") === "lessor" && renderLessor()}
                                    <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                        Registrar
                                    </Button>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ¿Ya tienes una cuenta? <Link href='/login' className="text-sky-600 hover:underline dark:text-sky-500">Ingresar</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div >
                }
            </section >
        </>
    );
}

export default Signup;