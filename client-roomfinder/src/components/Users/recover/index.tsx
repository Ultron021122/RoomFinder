'use client';

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // importante aqui!
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
// Componentes
import { Button, Spinner } from "@nextui-org/react";
// Utilidades
import { messages, patterns } from "@/utils/constants";
import Footer from "@/components/Footer";
import { Alert } from "@/utils/alert";
// Estilos de algunos componentes
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


interface RecoverUser {
    vchemail: string;
}

function Recover() {
    const { status } = useSession(); // determinar si el usuario tiene una sesión iniciada { cargando, autenticado y no autenticado}
    const router = useRouter(); // redirecciona las pantallas

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RecoverUser>({ mode: "onChange" }); // control sobre el formulario
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

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

    // Función para enviar los datos del formulario
    const onSubmit = async (recoverUser: RecoverUser) => {
        setIsLoading(true);
        setErrorSystem(null);

        const data: RecoverUser = {
            vchemail: recoverUser.vchemail
        };

        try {
            const response = await axios.post('/api/users/recover', data);
            setIsLoading(false);
            if (response.status === 200) {
                toast.success('Email enviado!!!', {
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
            } else if (response.status === 404) {
                //console.log(response);
                setErrorSystem(response.data.message);
            } else {
                setErrorSystem(response.data.message);
            }
        } catch (Error: any) {
            console.log('erro?')
            if (Error.response?.status == 400) {
                setErrorSystem(Error.response?.data.message);
            } else {
                setErrorSystem(Error.response?.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Efectos
    useEffect(() => {
        const input = document.getElementById('vchemail') as HTMLInputElement;
        if (input) {
            input.focus();
        }

        if (status === "authenticated") {
            router.push('/dashboard');
        }
    }, [status, router]);

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <PerfectScrollbar>
                    <div className="h-[100vh]">
                        {isLoading ?
                            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                                <Spinner />
                            </div>
                            :
                            <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <div>
                                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                                Recuperar cuenta
                                            </h1>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Te enviaremos instrucciones para restablecer tu contraseña.
                                            </p>
                                        </div>
                                        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                                            <Button type="submit" color="primary" variant="solid" className="font-normal w-full ">
                                                Enviar correo
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

export default Recover;