'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signOut, useSession } from 'next-auth/react';
import { UserProfile } from '@/utils/interfaces';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SettingsComponent: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user as UserProfile;
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeChange = (value: string) => {
        setTheme(value); // Cambiar al tema seleccionado
    };

    const handleDeleteAccount = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/users/${id}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.message.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                    style: { fontSize: '0.9rem' },
                    transition: Slide,
                });
            } else {
                toast.error(response.data.message, {
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
        } catch (error: any) {
            toast.error(error.response?.data.message || error.response.request.statusText, {
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
        } finally {
            setIsLoading(false);
        }

        signOut();
    };

    if (!mounted) {
        return null; // Evitar el renderizado hasta que el componente esté montado
    }

    return (
        <div className="p-2 md:p-8 h-screen overflow-hidden">
            <Card className="overflow-hidden w-auto sm:w-full mx-auto bg-gray-100 dark:bg-gray-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Configuración</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-1.5 mb-4">
                        <Label htmlFor='thema'>
                            Establecer el tema de la aplicación
                        </Label>
                        <Select
                            onValueChange={handleThemeChange}
                            value={theme}
                        >
                            <SelectTrigger className="bg-none border-none shadow-none bg-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 focus:ring-0">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-300 dark:bg-gray-800">
                                <SelectItem value="light" className="hover:bg-gray-100 dark:hover:bg-gray-700">Claro</SelectItem>
                                <SelectItem value="dark" className="hover:bg-gray-100 dark:hover:bg-gray-700">Oscuro</SelectItem>
                                <SelectItem value="system" className="hover:bg-gray-100 dark:hover:bg-gray-700">Sistema</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-1.5 mb-4">
                        <Label htmlFor="name">Usuario</Label>
                        <Input
                            type='text'
                            id='name'
                            placeholder='Nombre de usuario'
                            value={user?.vchname + ' ' + user?.vchpaternalsurname + ' ' + user?.vchmaternalsurname}
                            disabled
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5 mb-4">
                        <Label htmlFor="email">Correo electronico</Label>
                        <Input
                            type='email'
                            id='email'
                            placeholder='Correo electronico'
                            value={user?.vchemail}
                            disabled
                        />
                    </div>

                    {/* <div className="flex justify-end">
                        <Button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Eliminar Usuario
                        </Button>
                    </div> */}

                    <div className='flex justify-end'>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                Eliminar Usuario
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className='bg-red-800' side='top'>
                                            <p>Eliminar usuario</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        ¿Estás seguro de eliminar este usuario?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Este usuario será eliminado permanentemente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDeleteAccount(user?.usuarioid || 0)}
                                    >
                                        Continuar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div className="mt-8">
                        <UpcomingFeatures />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const UpcomingFeatures: React.FC = () => {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:border-yellow-600 dark:text-yellow-800">
                <div className="flex">
                    <AlertCircleIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-600" />
                    <div className="ml-3">
                        <p className="text-sm font-medium">Próximas actualizaciones</p>
                        <p className="text-sm">Nuevas características están en desarrollo y llegarán pronto.</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-center">
                    <Image src="/icon/peligro.png"
                        alt="En construcción"
                        className="w-16 h-16 sm:w-32 sm:h-32"
                        width="128"
                        height="128"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsComponent;