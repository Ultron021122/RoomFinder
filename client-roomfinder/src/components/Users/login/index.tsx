'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
// Componentes
import { Button, Spinner, Image } from "@nextui-org/react";
// Utilidades
import { messages, patterns } from "@/utils/constants";
import { UserInfo } from "@/utils/interfaces";
import Footer from "@/components/Footer";
import { Alert } from "@/utils/alert";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox, FormControlLabel } from "@mui/material";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<UserInfo>({ mode: "onChange" });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    // Función para enviar los datos del formulario
    const onSubmit = async (userInfo: UserInfo) => {
        setIsLoading(true);
        setErrorSystem(null);

        const data: UserInfo = {
            vchemail: userInfo.vchemail,
            vchpassword: userInfo.vchpassword
        };

        try {
            const response = await signIn("credentials", {
                vchemail: data.vchemail,
                vchpassword: data.vchpassword,
                redirect: false
            });
            if (response?.error) setErrorSystem(response.error as string);

            if (response?.ok) {
                toast.success('Inicio de sesión exitoso', {
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
                return router.push("/dashboard/profile");
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
    };

    // Mostrar mensaje de error
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
    // Enfocar el input email al cargar la página
    useEffect(() => {
        const input = document.getElementById('vchemail') as HTMLInputElement;
        input.focus();
    }, []);

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <PerfectScrollbar>
                    <div className="h-[calc(100vh-73px)]">
                        {isLoading ?
                            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[calc(100vh-73px)] lg:py-0">
                                <Spinner />
                            </div>
                            :
                            <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-[calc(100vh-73px)] lg:py-0">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-5 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Iniciar sesión
                                        </h1>
                                        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                            <div className="relative z-0 w-full mb-5 group">
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
                                                <label htmlFor="vchemail" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo electrónico</label>
                                                {errors?.vchemail && (
                                                    <Alert message={errors?.vchemail.message} />
                                                )}
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
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
                                                <label htmlFor="vchpassword" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-ocus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                                                {errors?.vchpassword && (
                                                    <Alert message={errors?.vchpassword.message} />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            defaultChecked
                                                            sx={{
                                                                color: "#075985",
                                                                '&.Mui-checked': {
                                                                    color: "#0284c7",
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="Recuerdame"
                                                    className="text-sm font-medium text-gray-400 dark:text-gray-300"
                                                    disableTypography
                                                />
                                                <Link href="#" className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-500">¿Has olvidado tú contraseña?</Link>
                                            </div>
                                            <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                                Ingresar
                                            </Button>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ¿No tienes una cuenta? <Link href='/users/signup' className="text-sky-600 hover:underline dark:text-sky-500">Crear una cuenta</Link>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        }
                        <Footer />
                    </div>
                </PerfectScrollbar>
            </section>
        </>
    );
};

export default Login;