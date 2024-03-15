import { useForm } from "react-hook-form";
import { useSessionStore } from "../sesion/global";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { messages, patterns } from "./constants";


type UserInfo<T extends "student" | "lessor"> = {
    type_user: T;
    name: string;
    last_name: string;
    email: string;
    password: string;
    birthday: string;
} & (T extends "student"
    ? { code: number; university: string; }
    : T extends "lessor"
    ? {
        phone: string;
        street: string;
        zip: number;
        suburb: string;
        municipality: string;
        state: string;
    } : {});

interface User {
    type_user: string;
    name: string;
    last_name: string;
    email: string;
    password: string;
    birthday: string;
}

type StudentInfo = User & {
    code: number;
    university: string;
}

type LessorInfo = User & {
    phone: string;
    street: string;
    zip: number;
    suburb: string;
    municipality: string;
    state: string;
}

const Signup = () => {
    const { isLoggedIn, login } = useSessionStore();
    const [selectedUserType, setSelectedUserType] = useState(""); // Variable de estado para el tipo de usuario seleccionado
    const [selectedUniversity, setSelectedUniversity] = useState(""); // Variable de estado para la universidad seleccionada

    const { register, handleSubmit, formState: { errors } } = useForm<UserInfo<"student" | "lessor">>({ mode: "onChange" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (userInfo: UserInfo<"student" | "lessor">) => {
        setIsLoading(true);
        setError(null);

        if (selectedUserType === "student") {
            const data: StudentInfo = {
                type_user: userInfo.type_user,
                name: userInfo.name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                password: userInfo.password,
                birthday: userInfo.birthday,
                code: userInfo.code,
                university: userInfo.university,
            }
        } else {
            const data: LessorInfo = {
                type_user: userInfo.type_user,
                name: userInfo.name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                password: userInfo.password,
                birthday: userInfo.birthday,
                phone: userInfo.phone,
                street: userInfo.street,
                zip: userInfo.zip,
                suburb: userInfo.suburb,
                municipality: userInfo.municipality,
                state: userInfo.state,
            }
        }

        try {
            const response = await axios.post("http://localhost:1234/users/create", data);
            if (response.status === 200) {
                // Creacion de usuario
                console.log(response.data) // Mostrar datos
            } else {
                setError("Ocurrio algun error...");
            }
        } catch (Error: any) {
            if (Error.response?.status == 400) {
                setError("Bad Request...");
            } else {
                console.log(Error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn]);

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                    {isLoading ? <Spinner /> :
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Registrar
                                </h1>
                                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                    {/* Nombre y Apellidos */}
                                    <div className="grid sm:grid-cols-2 gap-2 mb-5">
                                        <div>
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("name", {
                                                        required: messages.required,
                                                        minLength: 3,
                                                        maxLength: 25,
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
                                                {errors?.name?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative z-0 w-full group">
                                                <input
                                                    {...register("last_name", {
                                                        required: messages.required
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
                                                {errors?.last_name?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Correo Electrónico */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            {...register("email", {
                                                required: messages.required,
                                                pattern: {
                                                    value: patterns.email,
                                                    message: messages.email
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
                                        {errors?.email?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                    </div>
                                    {/* Contraseña */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            {...register("password", {
                                                required: messages.required,
                                                minLength: 8,
                                                maxLength: 16
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
                                        {errors?.password?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                        {errors?.password?.type === "minLength" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> Contraseña demasiado corta</p>
                                        )}
                                        {errors?.password?.type === "maxLength" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> Contraseña demasiado grande</p>
                                        )}
                                    </div>
                                    {/* Tipo de usuario */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <select
                                            id="type_user"
                                            {...register("type_user", {
                                                required: messages.required
                                            })
                                            }
                                            value={selectedUserType} // Variable de estado para el tipo de usuario
                                            onChange={(e) => setSelectedUserType(e.target.value)} // Función para actualizar la variable de estado
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="" className="dark:bg-gray-800 mr-5">Elige un tipo de usuario</option>
                                            <option value="student" className="dark:bg-gray-800">Estudiante</option>
                                            <option value="lessor" className="dark:bg-gray-800">Arrendador</option>
                                        </select>
                                        <label htmlFor="type_user" className="peer-focus:font-medium absolute peer-focus:text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tipo de usuario</label>
                                        {errors?.type_user?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                    </div>
                                    {/* Fecha de nacimiento */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            {...register("birthday", {
                                                required: messages.required
                                            })}
                                            type="date"
                                            name="birthday"
                                            id="birthday"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder="Enter your date"
                                            // defaultValue="2002-11-22"
                                            max="2020-01-01"
                                            min="1900-01-01"
                                        />
                                        <label htmlFor="birthday" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                            Fecha de nacimiento
                                        </label>
                                        {errors?.birthday?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                    </div>
                                    {selectedUserType === 'student' ? (
                                        <>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("code", {
                                                        required: messages.required
                                                    })}
                                                    type="text"
                                                    name="code"
                                                    id="code"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="code" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Codigo de estudiante
                                                </label>
                                                {errors?.code?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <select
                                                    id="university"
                                                    {...register("university", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    value={selectedUniversity} // Variable de estado para la universidad
                                                    onChange={(e) => setSelectedUniversity(e.target.value)} // Función para actualizar la variable de estado
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                >
                                                    <option value="" className="dark:bg-gray-800 mr-5">Elige una universidad</option>
                                                    <option className="dark:bg-gray-800">Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)</option>
                                                    <option className="dark:bg-gray-800">Centro Universitario de Arte, Arquitectura y Diseño (CUAAD)</option>
                                                </select>
                                                <label htmlFor="university" className="peer-focus:font-medium absolute peer-focus:text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tipo de usuario</label>
                                                {errors?.university?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : selectedUserType === 'lessor' && (
                                        <>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("phone", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Teléfono
                                                </label>
                                                {errors?.phone?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("street", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    type="text"
                                                    name="street"
                                                    id="street"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="street" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Calle
                                                </label>
                                                {errors?.street?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("suburb", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    type="text"
                                                    name="suburb"
                                                    id="suburb"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="suburb" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Colonia
                                                </label>
                                                {errors?.suburb?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("municipality", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    type="text"
                                                    name="municipality"
                                                    id="municipality"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="municipality" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Municipio
                                                </label>
                                                {errors?.municipality?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input
                                                    {...register("state", {
                                                        required: messages.required
                                                    })
                                                    }
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                    placeholder=""
                                                />
                                                <label htmlFor="state" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                                    Estado
                                                </label>
                                                {errors?.state?.type === "required" && (
                                                    <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                        Registrar
                                    </Button>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ¿Ya tienes una cuenta? <Link href='/sesion' className="text-sky-600 hover:underline dark:text-sky-500">Ingresar</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    }
                </div >
            </section >
        </>
    );
}

export default Signup;