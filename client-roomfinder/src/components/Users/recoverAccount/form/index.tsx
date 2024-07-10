import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { messages } from "@/utils/constants";
import axios from "axios";
import { Link, Spinner, Button } from "@nextui-org/react";
import { Alert } from "@/utils/alert";

interface UpdatePassword {
    vchpassword: string;
    vchconfirmPassword: string;
}


export default function Form({ token }: { token: string }) {
    const { status } = useSession();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<UpdatePassword>({ mode: "onChange" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    const validatePasswordConfirmation = (value: string) => {
        const password = watch('vchpassword'); //Obtenemos el valor de la contraseña
        return value === password || messages.confirm_password.validate;
    }

    useEffect(() => {
        if (errorSystem) {
            toast.error(errorSystem, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [errorSystem]);

    const onSubmit = async (updatePassword: UpdatePassword) => {
        setIsLoading(true);
        setErrorSystem(null);

        const data: UpdatePassword = {
            vchpassword: updatePassword.vchpassword,
            vchconfirmPassword: updatePassword.vchconfirmPassword
        };
        console.log(data)
        try {
            const response = await axios.post(`/api/users/recover/${token}`, data);
            setIsLoading(false);
            if (response.status === 200) {
                console.log(response)
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                reset();
                // router.push('/users/login');
            } else {
                setErrorSystem(response.data.message);
            }
        } catch (Error: any) {
            console.log(Error);
            if (Error.response?.status == 400) {
                setErrorSystem(Error.response?.data.message.message);
            } else {
                setErrorSystem(Error.response?.data.message.message);
            }
        } finally {
            setIsLoading(false);
            //router.push('/');
        }
    };

    // Enfocar el input email al cargar la página
    useEffect(() => {
        const input = document.getElementById('vchpassword') as HTMLInputElement;
        if (input) {
            input.focus();
        }

        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            {isLoading ?
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                    <Spinner />
                </div>
                :
                <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-5 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Cambio de contraseña
                            </h2>
                            <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="vchpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nueva Contraseña</label>
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
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        autoComplete="off"
                                    />
                                    {errors?.vchpassword && (
                                        <Alert message={errors?.vchpassword.message} />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="vchconfirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirma Contraseña</label>
                                    <input
                                        {...register("vchconfirmPassword", {
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
                                        name="vchconfirmPassword"
                                        id="vchconfirmPassword"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {errors?.vchconfirmPassword && (
                                        <Alert message={errors?.vchconfirmPassword.message} />
                                    )}
                                </div>
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
                                    Restablecer Contraseña
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </section>
    );
}