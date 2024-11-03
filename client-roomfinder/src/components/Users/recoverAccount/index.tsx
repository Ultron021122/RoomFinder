'use client';

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "@nextui-org/react";
import Footer from "@/components/Footer";
import { Alert } from "@/utils/alert";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { toast, Bounce, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Form from "./form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// Utilidades
import { messages } from "@/utils/constants";

interface RecoverUser {
    vchtoken: string;
}

function RecoverComponent() {
    const { status } = useSession();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm<RecoverUser>({ mode: "onChange" });
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

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

    const onSubmit = async (recoverUser: RecoverUser) => {
        setIsLoading(true);
        setErrorSystem(null);

        console.log(token);

        const dataToken: RecoverUser = {
            vchtoken: recoverUser.vchtoken // Usar el valor del OTP
        };

        try {
            const response = await axios.get(`/api/users/recover/${dataToken.vchtoken}`);
            setIsLoading(false);
            if (response.status === 200) {
                toast.success(response.data.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                });
                setIsTokenValid(true);
                setToken(dataToken.vchtoken);
            }
        } catch (Error: any) {
            if (Error.response?.status == 404) {
                setErrorSystem('Token no válido');
            } else {
                setErrorSystem(Error.response?.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const input = document.getElementById('otpInput') as HTMLInputElement;
        if (input) {
            input.focus();
        }

        if (status === "authenticated") {
            router.push('/dashboard');
        }
    }, [status, router]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <PerfectScrollbar>
                <div className="h-[100vh]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            {!isTokenValid ? (
                                <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-800">
                                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                            <div>
                                                <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                                    Validar token
                                                </h2>
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Recibiste un correo electrónico con un token, ingrésalo a continuación.
                                                </p>
                                            </div>
                                            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                                <div>
                                                    <InputOTP
                                                        maxLength={8}
                                                        {...register("vchtoken", {
                                                            required: {
                                                                value: true,
                                                                message: messages.vchtoken.required
                                                            },
                                                            minLength: {
                                                                value: 8,
                                                                message: messages.vchtoken.min
                                                            },
                                                            maxLength: {
                                                                value: 8,
                                                                message: messages.vchtoken.max
                                                            },
                                                        })}
                                                        onChange={(value) => {
                                                            setValue("vchtoken", value); // Actualiza el valor en react-hook-form
                                                            trigger("vchtoken"); // Desencadena validación
                                                        }}
                                                    >
                                                        <InputOTPGroup
                                                            className="flex justify-center space-x-2 items-center"
                                                        >
                                                            {[...Array(8)].map((_, index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={index}
                                                                    className="w-10 h-10 text-center border rounded-md dark:border-gray-700"
                                                                />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                    {errors.vchtoken && (
                                                        <Alert message={errors.vchtoken.message} />
                                                    )}
                                                </div>
                                                <Button type="submit" color="primary" variant="solid" className="font-normal w-full">
                                                    Validar token
                                                </Button>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ¿No tienes una cuenta? <Link href='/users/signup' className="text-sky-600 hover:underline dark:text-sky-500">Crear una cuenta</Link>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
                                    <Form token={token} />
                                </div>
                            )}
                        </>
                    )}
                    <Footer />
                </div>
            </PerfectScrollbar>
        </section>
    );
};

export default RecoverComponent;
