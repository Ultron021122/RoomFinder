'use client';
import {CheckoutButton} from '@/app/checkout/page';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import CopyText from '@/components/ui/copy-text';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRequestContext } from '@/contexts/request-context';
import { debounce } from '@/lib/debounce';
import { ESTUDIANTE } from '@/utils/constants';
import { LeaseRequest, UserProfile } from '@/utils/interfaces';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminRequests() {

    const session = useSession()
    const { leasingRequests, properties, requestStatus, isLoading, error, reload } = useRequestContext();
    const [requestEdit, setRequestEdit] = useState<LeaseRequest | null>(null);
    const [status, setStatus] = useState<string>('all');
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false);
    const [busqueda, setBusqueda] = useState<string>('');
    const [usersPerPage] = useState<number>(10);
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /* ACCIONES BARRA DE BÚSQUEDA Y FILTRO */

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const debouncedBusquedaChange = useMemo(() => debounce(handleBusquedaChange, 300), []);
    const filterRequests = useCallback(() => {
        // Verificar que request sea un array antes de usar filter
        if (!Array.isArray(leasingRequests)) {
            return [];
        }
        return leasingRequests.filter(req => {
            const matchesBusqueda = req.vchmessage.toLowerCase().includes(busqueda.toLowerCase());
            const matchesVerificado = status === 'all' || (status === req.statusid.toString());

            return matchesBusqueda && matchesVerificado;
        });
    }, [leasingRequests, busqueda, status]);

    const requestFiltrados = filterRequests();
    const totalPaginas = Math.ceil(requestFiltrados.length / usersPerPage);

    const getRequestPaginated = useCallback(() => {
        const indiceInicio = (paginaActual - 1) * usersPerPage;
        const indiceFin = indiceInicio + usersPerPage;
        return requestFiltrados.slice(indiceInicio, indiceFin);
    }, [paginaActual, requestFiltrados, usersPerPage]);

    /* ACCIONES VENTANA MODAL */

    const handleEditarRequest = (request: LeaseRequest) => {
        setRequestEdit(request);
        setDialogoAbierto(true);
    };

    const handleGuardarCambios = async () => {
        if (requestEdit) {
            setLoading(true)
            try {
                const response = await axios.patch(`/api/requests/${requestEdit.requestid}`,
                    requestEdit,
                    {
                        headers: {
                            'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                        }
                    }
                );
                reload()
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
            } catch (Error: any) {
                toast.error(Error.response?.data.message, {
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
                setLoading(false)
            }
        }
    };

    const handleEliminarRequest = async (id: number) => {
        try {
            const response = await axios.delete(`/api/requests/${id}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            reload()
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
        } catch (Error: any) {
            toast.error(Error.response?.data.message || Error.response.request.statusText, {
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
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    const getUserType = () => {
        if(session.status === 'authenticated'){
            const userData = session.data.user as UserProfile;
            return userData.roleid;
        }

        return null;
    }

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
    
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    useEffect(() => {
        return () => {
            debouncedBusquedaChange.cancel();
        };
    }, [debouncedBusquedaChange]);

    return (
        <div className='p-2 md:p-8 h-screen overflow-hidden'>
            <Card className='overflow-hidden w-auto sm:w-full mx-auto bg-gray-100 dark:bg-gray-950'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>
                        Administración de Solicitudes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* BÚSQUEDA Y FILTROS */}
                    <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6'>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4'>
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar solicitudes..."
                                    onChange={debouncedBusquedaChange}
                                    className="pl-8"
                                />
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <Select
                                    value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estatus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key='0' value='all'>Todos</SelectItem>
                                        {
                                            requestStatus.map((request) => (
                                                <SelectItem
                                                    key={request.statusid}
                                                    value={request.statusid.toString()}
                                                >
                                                    {request.vchstatusname}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* TABLA DE CONTENIDOS */}
                    <ScrollArea className="w-full overflow-x-auto">
                        <Table className='w-full max-w-7xl'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Propiedad</TableHead>
                                    <TableHead>Estatus</TableHead>
                                    <TableHead>Mensaje</TableHead>
                                    <TableHead>Mascotas</TableHead>
                                    <TableHead>Fecha de solicitud</TableHead>
                                    <TableHead>Periodo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ?
                                    <TableRow className='bg-transparent hover:bg-slate-100'>
                                        <TableCell colSpan={6}>
                                            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0'>
                                                <Spinner />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    getRequestPaginated().map((request, index) => (
                                        <TableRow key={request.requestid}>
                                            <TableCell>
                                                <Link href={`/dashboard/propertyDetails/${request.propertyid}`}>{properties[index].vchtitle}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        request.statusid === 1 ? 'success' :
                                                            request.statusid === 2 ? 'outline' :
                                                                request.statusid === 3 ? 'default' :
                                                                    request.statusid === 4 ? 'destructive' :
                                                                        'destructive'
                                                    }
                                                >
                                                    {
                                                        request.statusid === 1 ? 'Aceptada' :
                                                            request.statusid === 2 ? 'Pendiente' :
                                                                request.statusid === 3 ? 'En revisión' :
                                                                    request.statusid === 4 ? 'Rechazada' :
                                                                        'Error'
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <CopyText text={request.vchmessage} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={request.bnhaspets}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(request.dtrequest), 'yyyy-MM-dd HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(request.dtstartdate), 'yyyy-MM-dd') + ' - ' + format(new Date(request.dtenddate), 'yyyy-MM-dd')}
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => handleEditarRequest(request)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='bg-gray-800' side='top'>
                                                            <p>Editar solicitud</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className='bg-red-800' side='top'>
                                                                    <p>Eliminar solicitud</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                ¿Estás seguro de eliminar esta solicitud?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Esta solicitud será eliminada permanentemente.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleEliminarRequest(request.requestid || 0)}
                                                            >
                                                                Continuar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                            <TableCell>
                                                { getUserType() !== null && getUserType() === ESTUDIANTE && (
                                                    request.statusid === 1 ? 
                                                    <CheckoutButton property={properties[index]} leaseRequest={request}/> :
                                                    <p className="text-red-500">Pago no disponible por el momento</p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    {/* PAGINACIÓN */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {((paginaActual - 1) * usersPerPage) + 1} - {Math.min(paginaActual * usersPerPage, requestFiltrados.length)} de {requestFiltrados.length} solicitudes
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

            {/* VENTANA MODAL */}
            <Dialog
                open={dialogoAbierto}
                onOpenChange={setDialogoAbierto}
            >
                <DialogContent
                    aria-describedby="update_element"
                    className="w-screen sm:w-full max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>Editar Solicitud</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px]">
                        {requestEdit && (
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleGuardarCambios(); }}
                                className="space-y-4 pl-2 pr-3"
                            >
                                { getUserType() !== null && (
                                    getUserType() === ESTUDIANTE ? <>
                                    <div>
                                        <Label htmlFor="vchmessage">Mensaje</Label>
                                        <Textarea
                                            id="vchmessage"
                                            placeholder='Mensaje de solicitud'
                                            className='h-24'
                                            value={requestEdit.vchmessage}
                                            onChange={(e) => setRequestEdit({ ...requestEdit, vchmessage: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="bnhaspets"
                                            type="checkbox"
                                            className='form-checkbox h-4 w-4 text-blue-600'
                                            checked={requestEdit.bnhaspets}
                                            onChange={(e) => setRequestEdit({ ...requestEdit, bnhaspets: e.target.checked })}
                                        />
                                        <Label htmlFor="bnhaspets">Mascotas</Label>
                                    </div>
                                    </>:
                                    <div>
                                        <Label htmlFor="tipo">Estado de solicitud</Label>
                                        <Select
                                            value={requestEdit.statusid.toString()}
                                            onValueChange={(value) => setRequestEdit({ ...requestEdit, statusid: parseInt(value) })}
                                            defaultValue={requestEdit.statusid.toString()}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo de usuario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    requestStatus.map((request) => (
                                                        <SelectItem
                                                            key={request.statusid}
                                                            value={request.statusid.toString()}
                                                        >
                                                            {request.vchstatusname}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                                }
                                {loading ? 
                                    <Spinner/> :
                                    <Button type="submit"> Guardar Cambios </Button>
                                }
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}