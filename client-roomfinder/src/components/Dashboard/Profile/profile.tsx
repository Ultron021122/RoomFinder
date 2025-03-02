import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import 'react-toastify/dist/ReactToastify.css';
import { Camera, Pencil, MapPin, BookMarkedIcon, Briefcase, MapPinned, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LessorEdit, LessorInfo, StudentEdit, StudentInfo, UserProfile } from '@/utils/interfaces';
import axios from 'axios';
import { Spinner, useDisclosure } from '@nextui-org/react';
import ImageModal from './ImageModal';
import { COVER_IMAGE, messages, PROFILE_IMAGE, universities } from '@/utils/constants';
import { Alert } from "@/utils/alert";

// Estilos de leaflet
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { customIcon } from '@/components/Map';

// Estilos de toastify
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ARRENDADOR, ESTUDIANTE } from '@/utils/constants';
import { IdCardIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileComponentProps {
    userData: UserProfile;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ userData }) => {
    const { data: session, update } = useSession();
    const [coverImage, setCoverImage] = useState(userData.vchcoverimage);
    const [profileImage, setProfileImage] = useState(userData.vchimage);
    const [usuario, setUsuario] = useState<StudentInfo | LessorInfo>();
    const [imageType, setImageType] = useState<number | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentEdit | LessorEdit>({
        mode: "onChange"
    });

    const [editando, setEditando] = useState(false);
    type Ubicacion = [number, number] | null;

    const [ubicacionActual, setUbicacionActual] = useState<Ubicacion>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);

    // Use ref to control first render
    const isFirstRender = useRef(true);

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
        if (isFirstRender.current) {
            if (userData) {
                const getUserData = async () => {
                    try {
                        const { roleid, usuarioid } = userData;
                        let path = "";
                        if (roleid === ARRENDADOR) {
                            path = `/api/users/lessor/${usuarioid}`;
                        } else { // estudiante
                            path = `/api/users/student/${usuarioid}`;
                        }

                        const response = await axios.get(path, {
                            headers: {
                                'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                            }
                        });
                        const { data } = response.data;

                        // Asignar los datos al objeto local
                        let obj: LessorInfo | StudentInfo;
                        if (roleid === ARRENDADOR) {
                            const { vchpassword, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate } = data;
                            obj = {
                                ...data,
                                vchphone: vchphone,
                                vchstreet: vchstreet,
                                intzip: intzip,
                                vchsuburb: vchsuburb,
                                vchmunicipality: vchmunicipality,
                                vchstate: vchstate,
                                vchpassword: vchpassword,
                                confirm_password: ""
                            };
                        } else {
                            const { vchpassword, intcodestudent, vchuniversity, vchmajor } = data;
                            obj = {
                                ...data,
                                intcodestudent: parseInt(intcodestudent),
                                vchuniversity: vchuniversity,
                                vchpassword: vchpassword,
                                confirm_password: "",
                                vchmajor: vchmajor
                            };
                        }

                        setUsuario(() => {
                            const newObject = { ...obj, ['dtbirthdate']: data.dtbirthdate.substring(0, 10) };
                            reset(newObject);
                            return newObject;
                        });

                    } catch (Error: any) {
                        setErrorSystem(Error.response?.data.message);
                    }
                };

                // fetchImageUrls();
                getUserData();
            }
            isFirstRender.current = false;
        }
    }, [userData, reset]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setUbicacionActual([position.coords.latitude, position.coords.longitude]);
            });
        }
    }, []);

    const handleUpdateImage = (imageType: number) => {
        setImageType(imageType);
        onOpen();
    };

    const handleSave = async (data: LessorEdit | StudentEdit) => {
        setEditando(false);
        if (data.roleid === ARRENDADOR) {
            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.patch(`/api/users/lessor/${userData.usuarioid}`,
                    data, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                setIsLoading(false);
                if (response.status === 200) {

                    const { dtbirthdate, vchmaternalsurname, vchname, vchpaternalsurname, vchbiography } = response.data.data.updateLessor;
                    const fecha = new Date(dtbirthdate);
                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            vchname: vchname,
                            vchpaternalsurname: vchpaternalsurname,
                            vchmaternalsurname: vchmaternalsurname,
                            vchbiography: vchbiography,
                            dtbirthdate: dtbirthdate
                        }
                    });

                    setUsuario(() => {
                        const newObject = {
                            ...response.data.data.updateLessor
                            , ['dtbirthdate']: fecha.toISOString().substring(0, 10)
                        }
                        reset(newObject);
                        return newObject;
                    });
                    toast.success(response.data.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                    });
                } else {
                    setErrorSystem(response.data?.message);
                }
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(true);
            setErrorSystem(null);

            try {
                const response = await axios.patch(`/api/users/student/${userData.usuarioid}`,
                    data, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                setIsLoading(false);
                if (response.status === 200) {
                    const { dtbirthdate, intcodestudent, vchmaternalsurname, vchname, vchpaternalsurname, vchbiography } = response.data.data.updateStudent;
                    const fecha = new Date(dtbirthdate);
                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            vchname: vchname,
                            vchpaternalsurname: vchpaternalsurname,
                            vchmaternalsurname: vchmaternalsurname,
                            vchbiography: vchbiography,
                            dtbirthdate: dtbirthdate
                        }
                    });

                    setUsuario(() => {
                        const newObject = {
                            ...response.data.data.updateStudent
                            , ['dtbirthdate']: fecha.toISOString().substring(0, 10)
                            , ['intcodestudent']: parseInt(intcodestudent)
                        }
                        reset(newObject);
                        return newObject;
                    });
                    toast.success(response.data.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                    });
                } else {
                    setErrorSystem(response.data?.message);
                }
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message);
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <div className="bg-gradient-to-r p-4"> {/*bg-gradient-to-r*/}
            {isLoading ?
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <Spinner />
                </div>
                :
                <Card className="max-w-7xl mx-auto bg-gray-100 dark:bg-gray-950 border-gray-100 dark:border-gray-950">
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                        <Image
                            src={coverImage || '/background/fondo-1.jpg'}
                            alt="Fondo de perfil"
                            fill
                            priority
                            className='absolute inset-0 object-cover w-full h-full'
                        />
                        <button className='absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer' onClick={() => handleUpdateImage(COVER_IMAGE)}>
                            <Camera />
                        </button>
                    </div>
                    <CardHeader className="relative">
                        <div className="absolute -top-16 left-4">
                            <Avatar className="h-32 w-32 border-4 border-gray-300">
                                <AvatarImage
                                    src={profileImage}
                                    alt={usuario?.vchname}
                                    className="object-cover w-full h-full rounded-full"
                                />
                                <AvatarFallback>{usuario?.vchname.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <button className='absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer' onClick={() => handleUpdateImage(PROFILE_IMAGE)}>
                                <Camera />
                            </button>
                        </div>
                        <CardTitle className="text-2xl font-bold pt-12">{`${usuario?.vchname ?? " "} ${usuario?.vchpaternalsurname ?? " "} ${usuario?.vchmaternalsurname ?? " "}`}</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`absolute top-4 right-4 ${editando ? 'bg-red-300 hover:bg-red-400 border-red-400 dark:bg-red-900 dark:hover:bg-red-800 dark:border-red-900' : 'bg-gray-300 hover:bg-gray-400 border-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-900'} text-black dark:text-white`}
                                        onClick={() => setEditando(!editando)}
                                    >
                                        {!editando ? <Pencil className="h-4 w-4 sm:mr-1" /> : <X className='h-4 w-4 sm:mr-1' />}
                                        <span className='hidden sm:block'>{editando ? 'Cancelar' : 'Editar Perfil'}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side='right'>
                                    {!editando ? <p>Editar</p> : <p>Cancelar</p>}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>


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
                                            minLength: {
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
                                            required: {
                                                value: true,
                                                message: messages.vchpaternalsurname.required
                                            },
                                            minLength: {
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
                                        <Alert message={errors.vchpaternalsurname.message} />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="vchmaternalsurname">Apellido materno</Label>
                                    <Input
                                        {...register('vchmaternalsurname', {
                                            required: {
                                                value: true,
                                                message: messages.vchmaternalsurname.required
                                            },
                                            minLength: {
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
                                        <Alert message={errors.vchmaternalsurname.message} />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="email">Correo electronico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className='border-gray-400 dark:border-gray-800'
                                        value={userData?.vchemail}
                                        disabled
                                    />
                                </div>
                                {userData.roleid === ARRENDADOR && <div>
                                    <Label htmlFor="vchphone">Teléfono</Label>
                                    <Input
                                        {...register('vchphone', {
                                            required: {
                                                value: true,
                                                message: messages.vchphone.required
                                            },
                                            minLength: {
                                                value: 10,
                                                message: messages.vchphone.length
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: messages.vchphone.length
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
                                        <Alert message={errors.vchphone.message} />
                                    )}
                                </div>
                                }
                                <div>
                                    <Label htmlFor="dtbirthdate">Fecha de Nacimiento</Label>
                                    <Input
                                        {...register('dtbirthdate', {
                                            required: {
                                                value: true,
                                                message: 'La fecha de nacimiento es requerida'  // Reemplaza con tu mensaje
                                            },
                                            valueAsDate: true,
                                        })}
                                        id="dtbirthdate"
                                        name="dtbirthdate"
                                        type="date"
                                        className='border-gray-400 dark:border-gray-800'
                                        disabled={!editando}
                                    />
                                    {errors.dtbirthdate && (
                                        <Alert message={errors.dtbirthdate.message} />
                                    )}
                                </div>
                                {userData.roleid === ESTUDIANTE && (
                                    <>
                                        <div>
                                            <Label htmlFor="vchuniversity">Universidad</Label>
                                            <select
                                                {...register('vchuniversity', {
                                                    required: {
                                                        value: true,
                                                        message: messages.vchuniversity.required,
                                                    },
                                                })}
                                                id="vchuniversity"
                                                name="vchuniversity"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-400 dark:border-gray-800"
                                                disabled={!editando}
                                            >
                                                <option value="" className="text-sm">Seleccione una universidad</option>
                                                {universities.map((university, index) => (
                                                    <option key={index} value={university.name} className="text-sm">
                                                        {university.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.vchuniversity && (
                                                <Alert message={errors.vchuniversity.message} />
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="vchmajor">Carrera</Label>
                                            <Input
                                                {...register('vchmajor', {
                                                    required: {
                                                        value: true,
                                                        message: messages.vchmajor.required
                                                    },
                                                    minLength: {
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
                                            {errors.vchmajor && (
                                                <Alert message={errors.vchmajor.message} />
                                            )}
                                        </div></>)
                                }
                            </div>
                            <div>
                                <Label htmlFor="vchbiography">Biografía</Label>
                                <Textarea
                                    {...register('vchbiography', {
                                        minLength: {
                                            value: 50,
                                            message: messages.vchbiography.min
                                        },
                                        maxLength: {
                                            value: 255,
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
                                    <Alert message={errors.vchbiography.message} />
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
                                    {userData.roleid === ARRENDADOR ? (<>
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
                                    </>) : (<>
                                        <div className="flex items-center">
                                            <IdCardIcon className="h-5 w-5 mr-2 text-primary-300" />
                                            <span className='text-sm dark:text-primary-foreground'>{usuario?.intcodestudent ?? " "}</span>
                                        </div>
                                    </>)}
                                    <div className="flex items-center">
                                        <Briefcase className="h-5 w-5 mr-2 text-primary-300" />
                                        <span className='text-sm dark:text-primary-foreground'>{userData.roleid === 1 ? 'Estudiante' : 'Arrendador'}</span>
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
            }
            <ImageModal isOpen={isOpen} onClose={onOpenChange} imageType={imageType} />
        </div>
    )
}

export default UserProfileComponent