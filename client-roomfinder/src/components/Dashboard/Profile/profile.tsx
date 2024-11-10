'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Camera, Pencil, MapPin, Book, Briefcase, Calendar } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { useSession } from 'next-auth/react'
import { UserProfile } from '@/utils/interfaces'
import axios from 'axios'
import { useDisclosure } from '@nextui-org/react'
import ImageModal from './ImageModal'

// Corregir el problema de los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

export default function UserProfileComponent() {
    const [coverImage, setCoverImage] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");

    const [usuario, setUsuario] = useState({
        nombre: 'Ana García',
        email: 'ana.garcia@universidad.es',
        telefono: '+34 612 345 678',
        universidad: 'Universidad Autónoma de Madrid',
        carrera: 'Ingeniería Informática',
        bio: 'Estudiante de tercer año buscando un apartamento tranquilo cerca del campus.',
        fotoPerfil: '/perfiles/astronauta.jpg',
        imagenFondo: '/background/fondo-1.jpg',
        fechaNacimiento: '1999-05-15',
        intereses: ['Tecnología', 'Viajes', 'Fotografía'],
        experienciaLaboral: 'Prácticas en Desarrollo Web - Verano 2023',
        ubicacion: [40.4165, -3.7026], // Coordenadas de Madrid
    })

    const { data: session } = useSession();
    const user = session?.user as UserProfile;

    const [editando, setEditando] = useState(false)
    type Ubicacion = [number, number] | null;

    const [ubicacionActual, setUbicacionActual] = useState<Ubicacion>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const fetchImageUrls = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/users/images/${user.usuarioid}`);
                    setCoverImage(response.data.data.vchcoverimage);
                    setProfileImage(response.data.data.vchimage);
                } catch (error) {
                    console.error("Error al cargar las imágenes:", error);
                }
            }
        };

        fetchImageUrls();
    }, [user]);


    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setUbicacionActual([position.coords.latitude, position.coords.longitude])
            })
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuario(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setUsuario(prevState => ({
                ...prevState,
                [tipo]: imageUrl
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Datos actualizados:', usuario)
        setEditando(false)
        toast.success('Perfil actualizado con éxito!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-r p-4"> {/*bg-gradient-to-r*/}
            <Card className="max-w-7xl mx-auto bg-gray-300 dark:bg-gray-950">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <Image
                        src={coverImage}
                        alt="Fondo de perfil"
                        fill
                        priority
                        className='absolute inset-0 object-cover w-full h-full'
                    />
                    <label htmlFor="fondo" className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer">
                        <Camera className="h-6 w-6" />
                        <input
                            id="fondo"
                            type="button"
                            className="hidden"
                            onClick={onOpen}
                            // onChange={(e) => handleImageUpload(e, 'imagenFondo')}
                            // accept="image/*"
                        />
                    </label>
                </div>
                <CardHeader className="relative">
                    <div className="absolute -top-16 left-4">
                        <Avatar className="h-32 w-32 border-4 border-white">
                            <AvatarImage
                                src={profileImage}
                                alt={usuario.nombre}
                                className="object-cover w-full h-full rounded-full"
                            />
                            <AvatarFallback>{usuario.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <label htmlFor="perfil" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer">
                            <Camera className="h-4 w-4" />
                            <input
                                id="perfil"
                                type="file"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'fotoPerfil')}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <CardTitle className="text-2xl font-bold pt-12">{usuario.nombre}</CardTitle>
                    <Button variant="outline" size="sm" className="absolute top-4 right-4" onClick={() => setEditando(!editando)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {editando ? 'Cancelar' : 'Editar Perfil'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* <Image src='/utils/logoW.png' alt="Fondo de perfil" width={1000} height={1000} /> */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    value={usuario.nombre}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={usuario.email}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    value={usuario.telefono}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                                <Input
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    type="date"
                                    value={usuario.fechaNacimiento}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="universidad">Universidad</Label>
                                <Input
                                    id="universidad"
                                    name="universidad"
                                    value={usuario.universidad}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="carrera">Carrera</Label>
                                <Input
                                    id="carrera"
                                    name="carrera"
                                    value={usuario.carrera}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio">Biografía</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={usuario.bio}
                                onChange={handleChange}
                                disabled={!editando}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="experienciaLaboral">Experiencia Laboral</Label>
                            <Textarea
                                id="experienciaLaboral"
                                name="experienciaLaboral"
                                value={usuario.experienciaLaboral}
                                onChange={handleChange}
                                disabled={!editando}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>Intereses</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {usuario.intereses.map((interes, index) => (
                                    <span key={index} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                                        {interes}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {editando && (
                            <Button type="submit" className="w-full">
                                Guardar Cambios
                            </Button>
                        )}
                    </form>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Información Adicional</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-primary" />
                                <span>Madrid, España</span>
                            </div>
                            <div className="flex items-center">
                                <Book className="h-5 w-5 mr-2 text-primary" />
                                <span>{usuario.carrera}</span>
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                                <span>Estudiante</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-primary" />
                                <span>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Ubicación Actual</h3>
                        <div className="h-64 rounded-lg overflow-hidden">
                            {ubicacionActual ? (
                                <MapContainer center={ubicacionActual} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={ubicacionActual}>
                                        <Popup>
                                            Tu ubicación actual
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-100">
                                    <p>Cargando mapa...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <ToastContainer />
            <ImageModal isOpen={isOpen} onClose={onOpenChange} />
        </div>
    )
}