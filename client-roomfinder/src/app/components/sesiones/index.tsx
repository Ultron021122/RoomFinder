import axios from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";

interface UserInfo {
    email: string;
    password: string;
}

interface Data {
    email: string;
    password: string;
}

const Sigin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserInfo>({ mode: "onChange" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (userInfo: UserInfo) => {
        setIsLoading(true);
        setError(null);

        const data: Data = {
            email: userInfo.email,
            password: userInfo.password
        };
        console.log(data)
        axios.post("http://localhost:1234/users/login", data)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("isLoggedIn", String(true));
                } else {
                    setError("Credenciales incorrectas.");
                }
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setError("Credenciales incorrectas");
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    const messages = {
        required: "Este campo es obligatorio",
        email: "Debes introducir una dirección correcta",
        password: "Debes introducir una contraseña que cumpla los requerimientos"
    }

    const patterns = {
        email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                {isLoading && <p>Iniciando sesión</p>}
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="http://localhost:5173" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                        RoomFinder
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Iniciar sesión
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tú email</label>
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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@example.com"
                                    />
                                    {errors?.email?.type === "required" && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                    <input
                                        {...register("password", {
                                            required: messages.required,
                                            minLength: 8,
                                            maxLength: 16
                                        })}
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {errors?.password?.type === "required" && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                    )}
                                    {errors?.password?.type === "minLength" && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> Contraseña demasiado corta</p>
                                    )}
                                </div>
                                <button type="submit" className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">Ingresar</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    ¿No tienes una cuenta? <Link href='/register' className="font-medium text-sky-600 hover:underline dark:text-sky-500">Crear una cuenta</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Sigin;