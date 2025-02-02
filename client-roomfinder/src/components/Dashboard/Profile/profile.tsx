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
import { Camera, Pencil, MapPin, BookMarkedIcon, Briefcase, MapPinned } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LessorInfo, StudentInfo, UserProfile } from '@/utils/interfaces'
import axios from 'axios'
import { Spinner, useDisclosure } from '@nextui-org/react'
import ImageModal from './ImageModal'
import { messages, universities } from '@/utils/constants'
import { Alert } from "@/utils/alert";

// Estilos de leaflet
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { customIcon } from '@/components/Map'
import { ARRENDADOR, ESTUDIANTE } from '@/utils/constants'
import { getUserType } from '@/utils/functions'
import { IdCardIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { validateDate } from '@/utils/functions'

interface UserProfileComponentProps {
    userData: UserProfile;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ userData }) => {

    const [coverImage, setCoverImage] = useState("");
    const [profileImage, setProfileImage] = useState("");

    const [usuario, setUsuario] = useState<StudentInfo | LessorInfo>()

    const {register, handleSubmit, reset, formState : {errors}} = useForm<StudentInfo | LessorInfo>({
        mode: "onChange"
    });

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

        const getUserData = async () => {
            if(userData){
                try{
                    const {roleid, usuarioid} = userData;
                    let path = "";
                    if(getUserType(roleid) === ARRENDADOR){
                        path = `/api/users/lessor/${usuarioid}`;
                    }else{// estudiante
                        path = `/api/users/student/${usuarioid}`;
                    }

                    const response = await axios.get(path);
                    const {data} = response.data;

                    // asignar los datos al objeto local
                    let obj : LessorInfo | StudentInfo;
                    if(getUserType(roleid) === ARRENDADOR){
                        const {vchpassword, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate} = data[0];
                        obj = {
                            ...userData,
                            vchphone: vchphone,
                            vchstreet: vchstreet,
                            intzip: intzip,
                            vchsuburb: vchsuburb,
                            vchmunicipality: vchmunicipality,
                            vchstate: vchstate,
                            vchpassword: vchpassword,
                            confirm_password: ""
                        }
                    }else{
                        const {vchpassword,intcodestudent, vchuniversity, vchmajor} = data[0];
                        obj = {
                            ...userData,
                            intcodestudent: parseInt(intcodestudent),
                            vchuniversity: vchuniversity,
                            vchpassword: vchpassword,
                            confirm_password: "",
                            vchmajor: vchmajor
                        }
                    }

                    setUsuario(() => {
                        const newObject = {...obj, ['dtbirthdate'] : userData.dtbirthdate.substring(0, 10),};
                        reset(newObject);
                        return newObject
                    });

                }catch(error){
                    console.log(`error al cargar la info del usuario ${error}`);
                }
            }
        }

        fetchImageUrls();
        getUserData();
    }, [userData]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setUbicacionActual([position.coords.latitude, position.coords.longitude])
            })
        }
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            /*setUsuario(prevState => ({
                ...prevState,
                [tipo]: imageUrl
            }))*/
        }
    }

    const handleSave = async (data: LessorInfo | StudentInfo) => {
        setEditando(false);

        try{
            let path = getUserType(data.roleid) === ARRENDADOR ? "/api/users/lessor" : "/api/users/student";
            
            const response = await axios.patch(path, data);
            if(response.status == 200){
                setUsuario(() => {
                    const {dtbirthdate} = data;
                    const fecha = new Date(dtbirthdate);
                    const newObject = {
                        ...data,
                        ['dtbirthdate'] : fecha.toISOString().substring(0, 10)
                    }
                    reset(newObject);
                    return newObject;
                });
                toast.success('Perfil actualizado con éxito!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }else{
                toast.error('A ocurrido un error inesperado!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        }catch(error){
            console.log(error);
            toast.error('El perfil no se pudo actualizar!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
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
                                alt={userData.vchname}
                                className="object-cover w-full h-full rounded-full"
                            />
                            <AvatarFallback>{userData.vchname.charAt(0)}</AvatarFallback>
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
                    <CardTitle className="text-2xl font-bold pt-12">{`${usuario?.vchname ?? " "} ${usuario?.vchpaternalsurname ?? " "} ${usuario?.vchmaternalsurname ?? " "}`}</CardTitle>
                    <Button variant="outline" size="sm" className="absolute top-4 border-gray-400 dark:border-gray-900 right-4 bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white" onClick={() => setEditando(!editando)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {editando ? 'Cancelar' : 'Editar Perfil'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* <Image src='/utils/logoW.png' alt="Fondo de perfil" width={1000} height={1000} /> */}
                    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="vchname">Nombre</Label>
                                <Input
                                    {...register('vchname', {
                                        required: {
                                            value: true,
                                            message: messages.vchname.required
                                        },
                                        minLength:{
                                            value: 4,
                                            message: messages.vchname.min
                                        }
                                    }
                                    )}
                                    type='text'
                                    id="vchname"
                                    name="vchname"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                    autoComplete='off'
                                />
                                {errors?.vchname && (
                                    <Alert message={errors?.vchname.message} />
                                )}
                            </div>
                            <div>
                                <Label htmlFor="vchpaternalsurname">Apellido paterno</Label>
                                <Input
                                    {...register('vchpaternalsurname', {
                                        required:{
                                            value: true,
                                            message: messages.vchpaternalsurname.required
                                        },
                                        minLength:{
                                            value: 4,
                                            message: messages.vchpaternalsurname.min
                                        }
                                    })}
                                    type='text'
                                    id="vchpaternalsurname"
                                    name="vchpaternalsurname"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                    autoComplete='off'
                                />
                                {errors.vchpaternalsurname && (
                                    <Alert message={errors.vchpaternalsurname.message}/>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="vchmaternalsurname">Apellido materno</Label>
                                <Input
                                    {...register('vchmaternalsurname', {
                                        required:{
                                            value: true,
                                            message: messages.vchmaternalsurname.required
                                        },
                                        minLength:{
                                            value: 4,
                                            message: messages.vchmaternalsurname.min
                                        }
                                    })}
                                    type='text'
                                    id="vchmaternalsurname"
                                    name="vchmaternalsurname"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                    autoComplete='off'
                                />
                                {errors.vchmaternalsurname && (
                                    <Alert message={errors.vchmaternalsurname.message}/>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="email">Correo electronico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className='border-gray-400 dark:border-gray-800'
                                    value={userData.vchemail}
                                    disabled
                                />
                            </div>
                            { getUserType(userData.roleid) === ARRENDADOR && <div>
                                <Label htmlFor="vchphone">Teléfono</Label>
                                <Input
                                    {...register('vchphone', {
                                        required:{
                                            value:true,
                                            message: messages.vchphone.required
                                        },
                                        minLength:{
                                            value:10,
                                            message:messages.vchphone.length
                                        },
                                        maxLength:{
                                            value: 10,
                                            message:messages.vchphone.length
                                        }
                                    })}
                                    type='tel'
                                    id="vchphone"
                                    name="vchphone"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                    autoComplete='off'
                                />
                                {errors.vchphone && (
                                    <Alert message={errors.vchphone.message}/>
                                )}
                            </div>
                            }
                            <div>
                                <Label htmlFor="dtbirthdate">Fecha de Nacimiento</Label>
                                <Input
                                    {...register('dtbirthdate', {
                                        required:{
                                            value: true,
                                            message: messages.dtbirthdate.required
                                        },
                                        valueAsDate: true,
                                        validate: (value) => validateDate(value)
                                    })}
                                    id="dtbirthdate"
                                    name="dtbirthdate"
                                    type="date"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                />
                                {errors.dtbirthdate && (
                                    <Alert message={errors.dtbirthdate.message}/>
                                )}
                            </div>
                            {getUserType(userData.roleid) === ESTUDIANTE && (<><div>
                                <Label>Universidad</Label>
                                <select
                                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-400 dark:border-gray-800'
                                    name="universidad"
                                    id="universidad"
                                    disabled={!editando}
                                >
                                    {universities.map((university, index) => <option key={index} className='text-sm'>{university.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="vchmajor">Carrera</Label>
                                <Input
                                    {...register('vchmajor', {
                                        required:{
                                            value:true,
                                            message: messages.vchmajor.required
                                        },
                                        minLength:{
                                            value: 10,
                                            message: messages.vchmajor.min
                                        }
                                    })}
                                    type='text'
                                    id="vchmajor"
                                    name="vchmajor"
                                    className='border-gray-400 dark:border-gray-800'
                                    disabled={!editando}
                                    autoComplete='off'
                                />
                               
                            </div></>)
                            }
                        </div>
                        <div>
                            <Label htmlFor="vchbiography">Biografía</Label>
                            <Textarea
                                {...register('vchbiography', {
                                    minLength:{
                                        value:50,
                                        message: messages.vchbiography.min
                                    },
                                    maxLength:{
                                        value:255,
                                        message: messages.vchbiography.max
                                    }
                                })}
                                id="vchbiography"
                                name="vchbiography"
                                className='border-gray-400 dark:border-gray-800'
                                disabled={!editando}
                                rows={4}
                                placeholder='Escribe una breve descripción sobre tí...'
                            />
                            {errors.vchbiography && (
                                <Alert message={errors.vchbiography.message}/>
                            )}
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
                                {getUserType(userData.roleid) === ARRENDADOR ? (<>
                                <div className="flex items-center">
                                    <MapPinned className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{`${usuario?.vchmunicipality ?? " "}, ${usuario?.vchstate ?? " "}`}</span>
                                </div>
                                <div className="flex items-center">
                                    <BookMarkedIcon className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{usuario?.intzip ?? " "}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{`${usuario?.vchstreet ?? " "}, ${usuario?.vchsuburb ?? " "}`}</span>
                                </div>
                                </>): (<>
                                    <div className="flex items-center">
                                    <IdCardIcon className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{usuario?.intcodestudent ?? " "}</span>
                                </div>
                                </>)}
                                <div className="flex items-center">
                                    <Briefcase className="h-5 w-5 mr-2 text-primary-300" />
                                    <span className='text-sm dark:text-primary-foreground'>{getUserType(userData.roleid)}</span>
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