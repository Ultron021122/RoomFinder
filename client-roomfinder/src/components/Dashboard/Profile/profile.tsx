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
import { UserProfile } from '@/utils/interfaces'
import axios from 'axios'
import { Spinner, useDisclosure } from '@nextui-org/react'
import ImageModal from './ImageModal'

// Estilos de leaflet
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { customIcon } from '@/components/Map'

interface UserProfileComponentProps {
    userData: UserProfile;
}


const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ userData }) => {
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

    const [editando, setEditando] = useState(false)
    type Ubicacion = [number, number] | null;

    const [ubicacionActual, setUbicacionActual] = useState<Ubicacion>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const fetchImageUrls = async () => {
            if (userData) {
                try {
                    const response = await axios.get(`/api/users/images/${userData.usuarioid}`);
                    setCoverImage(response.data.data.vchcoverimage);
                    setProfileImage(response.data.data.vchimage);
                } catch (error) {
                    console.error("Error al cargar las imágenes:", error);
                }
            }
        };

        fetchImageUrls();
    }, [userData]);


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
            <Card className="max-w-7xl mx-auto bg-gray-100 dark:bg-gray-950 border-gray-100 dark:border-gray-950">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <Image
                        src={coverImage || '/background/fondo-1.jpg'}
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
                        <Avatar className="h-32 w-32 border-4 border-gray-300">
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
                    <CardTitle className="text-2xl font-bold pt-12">{userData.vchname + ' ' + userData.vchmaternalsurname + ' ' + userData.vchpaternalsurname}</CardTitle>
                    <Button variant="outline" size="sm" className="absolute top-4 border-gray-400 dark:border-gray-900 right-4 bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white" onClick={() => setEditando(!editando)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {editando ? 'Cancelar' : 'Editar Perfil'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* <Image src='/utils/logoW.png' alt="Fondo de perfil" width={1000} height={1000} /> */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nombre">Nombre completo</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    className='border-gray-400 dark:border-gray-800'
                                    value={userData.vchname + ' ' + userData.vchmaternalsurname + ' ' + userData.vchpaternalsurname}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo electronico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className='border-gray-400 dark:border-gray-800'
                                    value={userData.vchemail}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    className='border-gray-400 dark:border-gray-800'
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
                                    className='border-gray-400 dark:border-gray-800'
                                    value={userData.dtbirthdate.substring(0, 10)}
                                    onChange={handleChange}
                                    disabled={!editando}
                                />
                            </div>
                            <div>
                                <Label htmlFor="universidad">Universidad</Label>
                                <Input
                                    id="universidad"
                                    name="universidad"
                                    className='border-gray-400 dark:border-gray-800'
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
                                    className='border-gray-400 dark:border-gray-800'
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
                                className='border-gray-400 dark:border-gray-800'
                                value={usuario.bio}
                                onChange={handleChange}
                                disabled={!editando}
                                rows={4}
                            />
                        </div>
                        {/* <div>
                            <Label htmlFor="experienciaLaboral">Experiencia Laboral</Label>
                            <Textarea
                                id="experienciaLaboral"
                                name="experienciaLaboral"
                                className='border-gray-400 dark:border-gray-800'
                                value={usuario.experienciaLaboral}
                                onChange={handleChange}
                                disabled={!editando}
                                rows={3}
                            />
                        </div> */}
                        <div>
                            <Label>Intereses</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {usuario.intereses.map((interes, index) => (
                                    <span key={index} className="bg-primary-400 text-primary-foreground px-3 py-1 rounded-full text-xs">
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

                    <section className='grid grid-cols-1 md:grid-cols-2'>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Información Adicional</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>Madrid, España</span>
                                </div>
                                <div className="flex items-center">
                                    <Book className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{usuario.carrera}</span>
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{userData.roleid === 1 ? 'Estudiante' : 'Arrendador'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Ubicación Actual</h3>
                            <div className="h-64 rounded-lg overflow-hidden">
                                {ubicacionActual ? (
                                    <MapContainer center={ubicacionActual} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker
                                            position={ubicacionActual}
                                            icon={customIcon}
                                        >
                                            <Popup>
                                                Tu ubicación actual
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                                        <Spinner />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </CardContent>
            </Card>
            <ToastContainer />
            <ImageModal isOpen={isOpen} onClose={onOpenChange} />
        </div>
    )
}

export default UserProfileComponent