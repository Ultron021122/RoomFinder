'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer, Bounce, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import axios from 'axios'
import { format, set } from 'date-fns'
import { Spinner, Tab } from '@nextui-org/react'
import { HomeIcon } from '@radix-ui/react-icons'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Properties, PropertyType } from '@/utils/interfaces'


export default function AdminProperties() {
    const [properties, setProperties] = useState<Properties[]>([]);
    const [busqueda, setBusqueda] = useState<string>('')
    const [propertyEdit, setPropertyEdit] = useState<Properties | null>(null)
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false)
    const [paginaActual, setPaginaActual] = useState<number>(1)
    const [propiedadesPorPagina] = useState<number>(10)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    const filtrarProperties = () => {
        return properties.filter(property =>
            property.vchtitle.toLowerCase().includes(busqueda.toLowerCase()) ||
            property.vchdescription.toLowerCase().includes(busqueda.toLowerCase())
        );
    };

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
        const fetchProperties = async () => {

            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.get(`/api/properties`);
                setProperties(response.data.data);
                setIsLoading(false);
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const fetchTypesProperties = async () => {
            try {
                const response = await axios.get(`/api/typeproperty`);
                setPropertyTypes(response.data.data);
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message);
            }
        };
        fetchTypesProperties();
    }, []);

    const propiedadesFiltrados = filtrarProperties()
    const totalPaginas = Math.ceil(propiedadesFiltrados.length / propiedadesPorPagina)

    const obtenerPropiedadesPaginados = () => {
        const indiceInicio = (paginaActual - 1) * propiedadesPorPagina
        const indiceFin = indiceInicio + propiedadesPorPagina
        return propiedadesFiltrados.slice(indiceInicio, indiceFin)
    }

    useEffect(() => {
        setPaginaActual(1)
    }, [busqueda])

    const handleEditarUsuario = (propiedad: Properties) => {
        setPropertyEdit(propiedad);
        setDialogoAbierto(true)
    }

    const handleGuardarCambios = () => {
        if (propertyEdit) {
            setProperties(properties.map(u => u.propertyid === propertyEdit.propertyid ? propertyEdit : u))
            setDialogoAbierto(false)
            toast.success('Propiedad actualizada con éxito', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleEliminarPropietario = async (id: number) => {
        setIsLoading(true);
        setErrorSystem(null);
        setProperties(properties.filter(u => u.propertyid !== id));
        try {
            const response = await axios.delete(`/api/properties/${id}`);
            setIsLoading(false);
            if (response.status === 200) {
                setProperties(properties.filter(u => u.propertyid !== id));
                toast.success(response.data.message.message, {
                    position: "top-right",
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
                setErrorSystem(response.data.message);
            }
        } catch (Error: any) {
            setErrorSystem(Error.response?.data.message || Error.response.request.statusText);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r p-2 md:p-8">
            <Card className="overflow-hidden w-full max-w-8xl mx-auto bg-gray-100 dark:bg-gray-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Administración de Propiedades</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-48 md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar propiedades..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button className='flex flex-row items-center justify-center md:justify-start'>
                            <HomeIcon className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                            <span className='hidden md:inline'>Agregar Propiedad</span>
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titulo</TableHead>
                                <TableHead>Costo</TableHead>
                                <TableHead>Disponibilidad</TableHead>
                                <TableHead>Creado</TableHead>
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
                                obtenerPropiedadesPaginados().map((propiedad) => (
                                    <TableRow key={propiedad.propertyid}>
                                        <TableCell>{propiedad.vchtitle}</TableCell>
                                        <TableCell>{propiedad.decrentalcost}</TableCell>
                                        <TableCell className="justify-center items-center">
                                            <Badge
                                                variant={propiedad.bnavailability === true ? 'default' : 'outline'}
                                            //propiedad.bnavailability === 'Inactivo' ? 'secondary' : 'outline'}
                                            >
                                                {propiedad.bnavailability === true ? 'Disponible' : 'No Disponible'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(propiedad.created_at, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(propiedad)}>
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
                                                            ¿Estás seguro de eliminar esta propiedad?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esta propiedad será eliminada permanentemente.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleEliminarPropietario(propiedad.propertyid)}
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
                            Mostrando {((paginaActual - 1) * propiedadesPorPagina) + 1} - {Math.min(paginaActual * propiedadesPorPagina, propiedadesFiltrados.length)} de {propiedadesFiltrados.length} propiedades
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
                    aria-describedby="modal-description"
                    className="w-96"
                >
                    <DialogHeader>
                        <DialogTitle>Editar Propiedad</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="min-h-28">
                        {propertyEdit && (
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleGuardarCambios(); }}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="vchtitle">Titulo</Label>
                                    <Input
                                        id="vchtitle"
                                        value={propertyEdit.vchtitle}
                                        onChange={(e) => setPropertyEdit({ ...propertyEdit, vchtitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="vchdescription">Descripción</Label>
                                    <Textarea
                                        id="vchdescription"
                                        placeholder='Descripción de la propiedad'
                                        className='h-24'
                                        value={propertyEdit.vchdescription}
                                        onChange={(e) => setPropertyEdit({ ...propertyEdit, vchdescription: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="decrentalcost">Costo</Label>
                                    <Input
                                        id="decrentalcost"
                                        type="text"
                                        value={propertyEdit.decrentalcost}
                                        onChange={(e) => setPropertyEdit({ ...propertyEdit, decrentalcost: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="bnavailability"
                                        type="checkbox"
                                        className='form-checkbox h-4 w-4 text-blue-600'
                                        checked={propertyEdit.bnavailability}
                                        onChange={(e) => setPropertyEdit({ ...propertyEdit, bnavailability: e.target.checked })}
                                    />
                                    <Label htmlFor="bnavailability">Disponibilidad</Label>
                                </div>
                                <div>
                                    <Label htmlFor="tipo">Tipo de inmueble</Label>
                                    <Select
                                        value={propertyEdit.propertytypeid.toString()}
                                        onValueChange={(e) => setPropertyEdit({ ...propertyEdit, propertytypeid: e as string })}
                                        defaultValue={propertyEdit.propertytypeid.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el tipo de usuario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                propertyTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.propertytypeid}
                                                        value={type.propertytypeid.toString()}
                                                    >
                                                        {type.vchtypename}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="intnumberrooms"
                                        type='number'
                                        value={propertyEdit.intnumberrooms as number}
                                        onChange={(e) => setPropertyEdit({ ...propertyEdit, intnumberrooms: parseInt(e.target.value) })}
                                    />
                                    <Label htmlFor="intnumberrooms">
                                        Número de habitaciones
                                    </Label>
                                </div>
                                {/* <div>
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select
                                    value={usuarioEditando.tipo}
                                    onValueChange={(value) => setUsuarioEditando({ ...usuarioEditando, tipo: value as 'Estudiante' | 'Propietario' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo de usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Estudiante">Estudiante</SelectItem>
                                        <SelectItem value="Propietario">Propietario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                                {/* <div>
                                <Label htmlFor="estado">Estado</Label>
                                <Select
                                    value={usuarioEditando.estado}
                                    onValueChange={(value) => setUsuarioEditando({ ...usuarioEditando, estado: value as 'Activo' | 'Inactivo' | 'Pendiente' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el estado del usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                                <Button
                                    type="submit"
                                // onClick={handleGuardarCambios}
                                >
                                    Guardar Cambios
                                </Button>
                                {/* <Button
                                type='button'
                                variant="outline" 
                                onClick={() => setDialogoAbierto(false)}
                            >
                                Cancelar
                            </Button> */}
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
