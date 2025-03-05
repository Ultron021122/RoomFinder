'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, User as UserIcon, CalendarIcon, KeyRound, RectangleEllipsis, LockKeyhole, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Spinner } from '@nextui-org/react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { debounce } from '@/lib/debounce';
import { User } from '@/utils/interfaces';
import { useUserContext } from '@/contexts/user-context';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import CopyText from '@/components/ui/copy-text';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarField } from './calendar-field';
import { fifteenYearsAgo, generatePassword } from '@/utils/functions';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const userFormSchema = z.object({
    vchname: z.string().min(3).max(50),
    vchpaternalsurname: z.string().min(3).max(50),
    vchmaternalsurname: z.string().min(3).max(50),
    vchemail: z.string().email(),
    dtbirthdate: z.date({
        required_error: "A date of birth is required.",
    }),
    vchimage: z.string(),
    vchpassword: z.string().min(8, {
        message: 'Contraseña debe ser de 8 o más caracteres'
    }),
    roleid: z.number().positive()
})


export default function AdminUsers() {
    const { users, roles, isLoading, error, refetchUsers } = useUserContext();
    const [busqueda, setBusqueda] = useState<string>('');
    const [verificado, setVerificado] = useState<string>('all');
    const [userEdit, setUserEdit] = useState<User | null>(null);
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false);
    const [createUser, setCreateUser] = useState<boolean>(false);
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const [usersPerPage] = useState<number>(10);
    const [isLoadingState, setIsLoading] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | ArrayBuffer | null>(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            vchname: "",
            vchpaternalsurname: "",
            vchmaternalsurname: "",
            vchemail: "",
            dtbirthdate: fifteenYearsAgo,
            vchpassword: "",
            roleid: 3
        },
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof userFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result);
            form.setValue('vchimage', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
        maxFiles: 1
    });

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const handleVerificadoChange = (value: string) => {
        setVerificado(value);
    };

    const debouncedBusquedaChange = useMemo(() => debounce(handleBusquedaChange, 300), []);

    useEffect(() => {
        return () => {
            debouncedBusquedaChange.cancel();
        };
    }, [debouncedBusquedaChange]);

    const filterUsers = useCallback(() => {
        return users.filter(user => {
            const matchesBusqueda = user.vchname.toLowerCase().includes(busqueda.toLowerCase()) ||
                user.vchpaternalsurname.toLowerCase().includes(busqueda.toLowerCase()) ||
                user.vchmaternalsurname.toLowerCase().includes(busqueda.toLowerCase()) ||
                (user.vchname + ' ' + user.vchpaternalsurname + ' ' + user.vchmaternalsurname).toLowerCase().includes(busqueda.toLowerCase());

            const matchesVerificado = verificado === 'all' || (verificado === '1' && user.bnverified) || (verificado === '0' && !user.bnverified);

            return matchesBusqueda && matchesVerificado;
        });
    }, [users, busqueda, verificado]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
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
    }, [error]);

    const usuariosFiltrados = filterUsers();
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usersPerPage);

    const getUserPaginated = useCallback(() => {
        const indiceInicio = (paginaActual - 1) * usersPerPage;
        const indiceFin = indiceInicio + usersPerPage;
        return usuariosFiltrados.slice(indiceInicio, indiceFin);
    }, [paginaActual, usuariosFiltrados, usersPerPage]);

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, verificado]);

    const handleEditarUsuario = (user: User) => {
        setUserEdit(user);
        setDialogoAbierto(true);
    };

    const handleGuardarCambios = async () => {
        if (userEdit) {
            try {
                const response = await axios.patch(`/api/users/${userEdit.usuarioid}`,
                    userEdit, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                refetchUsers();
                setDialogoAbierto(false);
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
            } catch (error: any) {
                toast.error(error.response?.data.message, {
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
        }
    };

    const handleEliminarUsuario = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/users/${id}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            refetchUsers();
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
    };

    const handleGeneratePassword = () => {
        const newPassword = generatePassword(16);
        form.setValue('vchpassword', newPassword);
    };

    return (
        <div className="p-2 md:p-8 h-screen overflow-hidden">
            <Card className="overflow-hidden w-auto sm:w-full mx-auto bg-gray-100 dark:bg-gray-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Administración de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar usuarios..."
                                    onChange={debouncedBusquedaChange}
                                    className="pl-8"
                                />
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <Select value={verificado} onValueChange={handleVerificadoChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Verificado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="1">Verificado</SelectItem>
                                        <SelectItem value="0">No verificado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            className='flex flex-row items-center justify-center w-full sm:w-auto sm:justify-start'
                            onClick={() => setCreateUser(true)}
                        >
                            <UserIcon className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                            <span className='hidden md:inline'>Agregar Usuario (Admin)</span>
                        </Button>
                    </div>
                    <ScrollArea className="w-full overflow-x-auto">
                        <Table className='w-full max-w-7xl'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Verificado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ?
                                    <TableRow className='bg-transparent hover:bg-slate-100'>
                                        <TableCell colSpan={5}>
                                            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0'>
                                                <Spinner />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    getUserPaginated().map((usuario) => (
                                        <TableRow key={usuario.usuarioid}>
                                            <TableCell>
                                                <CopyText text={usuario.vchname + ' ' + usuario.vchpaternalsurname + ' ' + usuario.vchmaternalsurname} />
                                            </TableCell>
                                            <TableCell>
                                                <CopyText text={usuario.vchemail} />
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={usuario.bnstatus === true ? 'default' : 'destructive'}
                                                >
                                                    {usuario.bnstatus === true ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={usuario.bnverified}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(usuario)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='bg-gray-800' side='top'>
                                                            <p>Editar usuario</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
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
                                                                onClick={() => handleEliminarUsuario(usuario.usuarioid || 0)}
                                                            >
                                                                Continuar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {((paginaActual - 1) * usersPerPage) + 1} - {Math.min(paginaActual * usersPerPage, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                                <Button
                                    key={pagina}
                                    variant={pagina === paginaActual ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPaginaActual(pagina)}
                                >
                                    {pagina}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={dialogoAbierto}
                onOpenChange={setDialogoAbierto}
            >
                <DialogContent
                    aria-describedby="update_element"
                    className="w-screen sm:w-full max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[550px]">
                        {userEdit && (
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleGuardarCambios(); }}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="vchname">Nombre</Label>
                                    <Input
                                        id="vchname"
                                        value={userEdit.vchname}
                                        onChange={(e) => setUserEdit({ ...userEdit, vchname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="vchpaternalsurname">Apellido paterno</Label>
                                    <Input
                                        id="vchpaternalsurname"
                                        placeholder='Apellido paterno'
                                        type='text'
                                        value={userEdit.vchpaternalsurname}
                                        onChange={(e) => setUserEdit({ ...userEdit, vchpaternalsurname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="vchmaternalsurname">Apellido materno</Label>
                                    <Input
                                        id="vchmaternalsurname"
                                        type="text"
                                        value={userEdit.vchmaternalsurname}
                                        onChange={(e) => setUserEdit({ ...userEdit, vchmaternalsurname: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="bnstatus"
                                        type="checkbox"
                                        className='form-checkbox h-4 w-4 text-blue-600'
                                        checked={userEdit.bnstatus}
                                        onChange={(e) => setUserEdit({ ...userEdit, bnstatus: e.target.checked })}
                                    />
                                    <Label htmlFor="bnstatus">Estado</Label>
                                </div>
                                <div>
                                    <Label htmlFor="roleid">Tipo de usuario</Label>
                                    <Select
                                        value={userEdit.roleid.toString()}
                                        onValueChange={(value) => setUserEdit({ ...userEdit, roleid: parseInt(value) })}
                                        defaultValue={userEdit.roleid.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el tipo de usuario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                roles.map((rol) => (
                                                    <SelectItem
                                                        key={rol.roleid}
                                                        value={rol.roleid.toString()}
                                                    >
                                                        {rol.vchname}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="vchbiography">Biografia</Label>
                                    <Textarea
                                        id="vchbiography"
                                        placeholder='Escribe sobre ti...'
                                        className='h-24'
                                        value={userEdit.vchbiography}
                                        onChange={(e) => setUserEdit({ ...userEdit, vchbiography: e.target.value })}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                >
                                    Guardar Cambios
                                </Button>
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog
                open={createUser}
                onOpenChange={setCreateUser}
            >
                <DialogContent
                    aria-describedby="create_element"
                    className="w-screen sm:w-full max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>Nuevo Usuario (Administrador)</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[550px]">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pl-2 pr-3">
                                <FormField
                                    control={form.control}
                                    name="vchname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Escribe el nombre del usuario.
                                            </FormDescription>
                                            <FormMessage className='text-red-600' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vchpaternalsurname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido paterno</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Escribe el apellido del usuario.
                                            </FormDescription>
                                            <FormMessage className='text-red-600' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vchmaternalsurname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido materno</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Escribe el apellido materno del usuario.
                                            </FormDescription>
                                            <FormMessage className='text-red-600' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vchemail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo electronico</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Escribe el correo electronico del usuario.
                                            </FormDescription>
                                            <FormMessage className='text-red-600' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dtbirthdate"
                                    render={({ field }) => <CalendarField field={field} />}
                                />
                                <div className='flex flex-row space-x-5 items-center'>
                                    <FormField
                                        control={form.control}
                                        name="vchpassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder="***************" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Establece una contraseña.
                                                </FormDescription>
                                                <FormMessage className='text-red-600' />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" onClick={handleGeneratePassword} className="mt-2">
                                        <LockKeyhole className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div
                                    {...getRootProps({ className: 'dropzone' })}
                                    className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer"
                                >
                                    <input {...getInputProps()} />
                                    {uploadedImage ? (
                                        <div className="mt-4">
                                            <Image
                                                width={300}
                                                height={300}
                                                src={uploadedImage as string}
                                                alt="Selected"
                                                className="w-full max-h-96 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center flex flex-col items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-600 dark:text-gray-200" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-200">
                                                <span className="text-gray-600 dark:text-gray-200">Sube una imagen</span>
                                                <p className="pl-1">o arrastra y suelta</p>
                                            </div>
                                            <p className="text-xs leading-5 text-blue-400">PNG, JPG, GIF hasta 10MB</p>
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" className='w-full'>Agregar administrador</Button>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}