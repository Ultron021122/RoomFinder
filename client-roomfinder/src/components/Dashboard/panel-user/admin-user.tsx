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
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { Spinner } from '@nextui-org/react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FormularioProvider } from '@/components/Form/FormularioContext';
import ElementForm from '@/components/Form/element_form';
import { debounce } from '@/lib/debounce';
import { User } from '@/utils/interfaces';
import { useUserContext } from '@/contexts/user-context';

export default function AdminUsers() {
    const { users, roles, isLoading, error, refetchUsers } = useUserContext();
    const [busqueda, setBusqueda] = useState<string>('');
    const [userEdit, setUserEdit] = useState<User | null>(null);
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false);
    const [createUser, setCreateUser] = useState<boolean>(false);
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const [usersPerPage] = useState<number>(10);
    const [isLoadingState, setIsLoading] = useState<boolean>(false);

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const debouncedBusquedaChange = useMemo(() => debounce(handleBusquedaChange, 300), []);

    useEffect(() => {
        return () => {
            debouncedBusquedaChange.cancel();
        };
    }, [debouncedBusquedaChange]);

    const filterUsers = useCallback(() => {
        return users.filter(user =>
            user.vchname.toLowerCase().includes(busqueda.toLowerCase()) ||
            user.vchpaternalsurname.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [users, busqueda]);

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
    }, [busqueda]);

    const handleEditarUsuario = (user: User) => {
        setUserEdit(user);
        setDialogoAbierto(true);
    };

    const handleGuardarCambios = async () => {
        if (userEdit) {
            try {
                const response = await axios.patch(`/api/users/${userEdit.usuarioid}`, userEdit);
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
            const response = await axios.delete(`/api/users/${id}`);
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

    return (
        <div className="bg-gradient-to-r p-2 md:p-8">
            <Card className="overflow-hidden w-full max-w-8xl mx-auto bg-gray-100 dark:bg-gray-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Administración de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-48 md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuarios..."
                                onChange={debouncedBusquedaChange}
                                className="pl-8"
                            />
                        </div>
                        <Button
                            className='flex flex-row items-center justify-center md:justify-start'
                            onClick={() => setCreateUser(true)}
                        >
                            <UserIcon className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                            <span className='hidden md:inline'>Agregar Usuario</span>
                        </Button>
                    </div>
                    <Table className='w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ?
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0'>
                                            <Spinner />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                :
                                getUserPaginated().map((usuario) => (
                                    <TableRow key={usuario.usuarioid}>
                                        <TableCell>{usuario.vchname}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(usuario)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                    className="w-screen"
                >
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px]">
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
                                                        {rol.vchdescription}
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
                    className="w-full"
                >
                    <DialogHeader>
                        <DialogTitle>Nuevo Usuario</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px]">
                        <FormularioProvider>
                            <ElementForm />
                        </FormularioProvider>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}