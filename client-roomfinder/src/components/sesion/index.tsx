import axios from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionStore } from "./global";
import { Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";

interface UserInfo {
    email: string;
    password: string;
}

interface Data {
    email: string;
    password: string;
}

const Sigin = () => {
    const { isLoggedIn, login } = useSessionStore();
    const { register, handleSubmit, formState: { errors } } = useForm<UserInfo>({ mode: "onChange" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (userInfo: UserInfo) => {
        setIsLoading(true);
        setError(null);

        const data: Data = {
            email: userInfo.email,
            password: userInfo.password
        };

        try {
            const response = await axios.post("http://localhost:1234/users/login", data);
            if (response.status === 200) {
                // Successful login using the provided login function
                login(response.data); // Appropriate user data structure
                localStorage.setItem("isLoggedIn", String(true)); // (Optional)
            } else {
                setError("Credenciales incorrectas.");
            }
        } catch (Error: any) {
            if (Error.response?.status == 401) {
                setError("Ocurrio un error...");
            } else {
                console.error(Error); // Handle (Manejar) other errors
            }
        } finally {
            setIsLoading(false);
        }
    };

    const messages = {
        required: "Este campo es obligatorio",
        email: "Debes introducir una dirección correcta",
        password: "Debes introducir una contraseña que cumpla los requerimientos"
    }

    const patterns = {
        email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    };

    useEffect(() => {
        const input = document.getElementById('email') as HTMLInputElement;
        input.focus();

        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn]);

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-col items-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                    {/* <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <Image width={32} height={32} className="mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                        RoomFinder
                    </Link> */}
                    {isLoading ? <Spinner /> :
                        <div className="w-full my-5 bg-white rounded-lg shadow dark:border md:mt-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Iniciar sesión
                                </h1>
                                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo electrónico</label>
                                        {errors?.email?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                    </div>
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
                                        <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                                        {errors?.password?.type === "required" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> {messages.required}</p>
                                        )}
                                        {errors?.password?.type === "minLength" && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> Contraseña demasiado corta</p>
                                        )}
                                    </div>
                                    <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                        Ingresar
                                    </Button>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ¿No tienes una cuenta? <Link href='/registrar' className="text-sky-600 hover:underline dark:text-sky-500">Crear una cuenta</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </section>
        </>
    );
};

export default Sigin;