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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'


// Definimos la interfaz para las propiedades
interface Property {
    lessorid: number;
    vchtitle: string;
    propertyid: number;
    propertytypeid: number;
    bnavailability: boolean;
    intnumberrooms: number;
    intnumberbeds: number;
    intnumberbathrooms: number;
    bnfurnished: boolean;
    vchfurnituretype: string;
    decrentalcost: string;
    dtavailabilitydate: string;
    intmincontractduration: number;
    intmaxcontractduration: number;
    decpropertyrating: string;
    bnstudyzone: boolean;
    vchbuildingsecurity: string;
    vchtransportationaccess: string;
    vchpropertyrules: string;
    vchdescription: string;
    bnwaterincluded: boolean;
    bnelectricityincluded: boolean;
    bninternetincluded: boolean;
    bngasincluded: boolean;
    bnheatingincluded: boolean;
    bnairconditioningincluded: boolean;
    bnlaundryincluded: boolean;
    bnparkingincluded: boolean;
    bncleaningincluded: boolean;
    bncabletvincluded: boolean;
    bnwashingmachineincluded: boolean;
    bnkitchen: boolean;
    bnlivingroom: boolean;
    bndiningroom: boolean;
    bncoolerincluded: boolean;
    bngardenincluded: boolean;
    bnwashingarea: boolean;
    intaccountparking: number;
    objphotos: string[];
    vchexteriornumber: string;
    vchinteriornumber: string | null;
    vchstreet: string;
    vchaddresscomplement: string;
    vchneighborhood: string;
    vchmunicipality: string;
    vchstateprovince: string;
    intzip: number;
    vchcountry: string;
    lat: number;
    lng: number;
    created_at: string;
}

export default function AdminProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [busqueda, setBusqueda] = useState<string>('')
    const [propertyEdit, setPropertyEdit] = useState<Property | null>(null)
    const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false)
    const [paginaActual, setPaginaActual] = useState<number>(1)
    const [propiedadesPorPagina] = useState<number>(10)

    const filtrarProperties = () => {
        return properties.filter(property =>
            property.vchtitle.toLowerCase().includes(busqueda.toLowerCase()) ||
            property.vchdescription.toLowerCase().includes(busqueda.toLowerCase())
        );
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`/api/properties`);
                setProperties(response.data.data);
                console.log("Propiedades cargadas:", response.data.data);
            } catch (error) {
                console.error("Error al cargar las propiedades:", error);
            }
        };
        fetchProperties();
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

    const handleEditarUsuario = (propiedad: Property) => {
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

    const handleEliminarUsuario = (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            setProperties(properties.filter(u => u.propertyid !== id))
            toast.success('Propiedad eliminada con éxito', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    return (
        <div className="bg-gradient-to-r p-2 md:p-8">
            <Card className="overflow-hidden w-full max-w-8xl mx-auto bg-gray-300 dark:bg-gray-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Administración de Propiedades</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar propiedades..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Agregar Propiedad
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
                            {obtenerPropiedadesPaginados().map((propiedad) => (
                                <TableRow key={propiedad.propertyid}>
                                    <TableCell>{propiedad.vchtitle}</TableCell>
                                    <TableCell>{propiedad.decrentalcost}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={propiedad.bnavailability === true ? 'default' : 'secondary'}
                                        //propiedad.bnavailability === 'Inactivo' ? 'secondary' : 'outline'}
                                        >
                                            {propiedad.bnavailability === true ? 'Disponible' : 'No Disponible'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{propiedad.created_at}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(propiedad)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEliminarUsuario(propiedad.propertyid)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
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

            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                <DialogContent aria-describedby="modal-description" className="w-96">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    {propertyEdit && (
                        <form onSubmit={(e) => { e.preventDefault(); handleGuardarCambios(); }} className="space-y-4">
                            <div>
                                <Label htmlFor="vchtitle">Titulo</Label>
                                <Input
                                    id="vchtitle"
                                    value={propertyEdit.vchtitle}
                                    onChange={(e) => setPropertyEdit({ ...propertyEdit, vchtitle: e.target.value })}
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
                            <Button type="submit">Guardar Cambios</Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <ToastContainer />
        </div>
    )
}
