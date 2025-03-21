'use client';
import { Properties, PropertyOpinions, UserProfile } from '@/utils/interfaces';
import Image from "next/image";
import { MapPin, Star, Wifi, Tv, CookingPotIcon as Kitchen, Car, Users, Bed, Bath, CalendarIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import { reviews } from '@/utils/constants';
import PropertyReviews from './property-reviews';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '@nextui-org/react';
import { ImageOverlay } from './image-overlay';
import { Separator } from '../ui/separator';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/material';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { es } from "date-fns/locale";
import { useSession } from 'next-auth/react';

const requestFormSchema = z.object({
    propertyid: z.number().positive(),
    studentid: z.number().positive(),
    statusid: z.number().positive(),
    vchmessage: z.string({
        message: 'El mensaje es requerido'
    }).min(25, {
        message: 'El mensaje debe tener al menos 25 caracteres'
    }),
    intnumguests: z.number({
        message: 'El número de huéspedes es requerido'
    }).positive().min(1),
    bnhaspets: z.boolean({
        message: 'El campo de mascotas'
    }),
    dtstartdate: z.date({
        message: 'La fecha de inicio es requerida'
    }),
    dtenddate: z.date({
        message: 'La fecha de fin es requerida'
    }),
});

const reviewsFormSchema = z.object({
    propertyid: z.number({
        message: 'La propiedad es requerida'
    }).positive(),
    studentid: z.number({
        message: 'El estudiante es requerido'
    }).positive(),
    decrating: z.number({
        message: 'La calificación es requerida'
    }).positive().max(5),
    vchcomment: z.string({
        message: 'El comentario es requerido'
    }).min(25)
});

function PropertyComponent({ id }: { id: string }) {
    const { data: session, status, update } = useSession();
    const userData = session?.user as UserProfile;
    const [property, setProperty] = useState<Properties>();
    const [propertyOpinions, setPropertyOpinions] = useState<PropertyOpinions>();
    const [showPayment, setShowPayment] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorSystem, setErrorSystem] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [hasStayed, setHasStayed] = useState<boolean>(false);

    const userProfileData = session?.user as UserProfile;

    const form = useForm<z.infer<typeof requestFormSchema>>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            propertyid: Number(id),
            statusid: 2,
            intnumguests: 1,
            bnhaspets: false
        },
    });


    const handleDateChange = (dates: { from: Date | null; to: Date | null }) => {
        const { from: startDate, to: endDate } = dates;
        if (startDate) {
            const newEndDate = addMonths(startDate, 1);
            setStartDate(startDate);
            setEndDate(newEndDate);
            form.setValue('dtstartdate', startDate);
            form.setValue('dtenddate', newEndDate);
        }
    };

    useEffect(() => {
        if (userProfileData?.usuarioid) {
            form.setValue('studentid', userProfileData.usuarioid);
        }
    }, [userProfileData, form]);

    async function onSubmit(values: z.infer<typeof requestFormSchema>) {
        console.log(values);
        setIsLoading(true);
        setErrorSystem(null);
        try {
            const response = await axios.post('/api/requests', values, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            });
            console.log(response.data);
            setIsLoading(false);
            if (response.status === 201) {
                toast.success('Reserva realizada con éxito', {
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
            setErrorSystem(Error.response?.data.message || Error.message);
        } finally {
            setIsLoading(false);
        }
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
        const fetchProperty = async () => {
            setIsLoading(true);
            setErrorSystem(null);
            try {
                const response = await axios.get(`/api/properties/${id}`, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                setProperty(response.data.data);
                setIsLoading(false);
                // Aquí se debería verificar si el usuario ya se ha hospedado en la propiedad
                // y actualizar el estado `hasStayed` en consecuencia.
                // setHasStayed(response.data.hasStayed);
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message || Error.message);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchPropertyOpinions = async () => {
            try {
                const response = await axios.get(`/api/properties/opinions/${id}`, {
                    headers: {
                        'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                    }
                });
                setPropertyOpinions(response.data.data);
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message || Error.message);
            }
        };

        fetchProperty();
        fetchPropertyOpinions();
    }, [id]);

    const amenities = [
        { icon: Wifi, text: "Wi-Fi de alta velocidad" },
        { icon: Tv, text: "TV por cable" },
        { icon: Kitchen, text: "Cocina equipada" },
        { icon: Car, text: "Estacionamiento" },
    ];

    return (
        <>
            {isLoading ? (
                <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0'>
                    <Spinner />
                </div>
            ) : property ? (
                <>
                    <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-7xl lg:gap-x-20 lg:grid-cols-2">
                            <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1 z-30">
                                <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">{property?.vchtitle}</h1>
                                <p className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">Propiedad</p>
                            </div>
                            <div className="grid gap-2 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-2 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                                <div className="relative sm:h-52 sm:col-span-2 lg:col-span-full">
                                    <Image
                                        width={800}
                                        height={800}
                                        src={property?.objphotos?.[0]?.url || '/No_image.png'}
                                        alt={`Imagen ${property?.objphotos?.[0]?.photoid || 'No disponible'}`}
                                        priority
                                        className="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full"
                                    />
                                    {property?.objphotos && <ImageOverlay images={property?.objphotos} />}
                                </div>
                                <Image
                                    width={800}
                                    height={800}
                                    src={property?.objphotos?.[1]?.url || '/No_image.png'}
                                    alt={`Imagen ${property?.objphotos?.[1]?.photoid || 'No disponible'}`}
                                    className="hidden w-full h-52 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32"
                                    priority
                                />
                                <Image
                                    width={800}
                                    height={800}
                                    src={property?.objphotos?.[2]?.url || '/No_image.png'}
                                    alt={`Imagen ${property?.objphotos?.[2]?.photoid || 'No disponible'}`}
                                    className="hidden w-full h-52 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32"
                                    priority
                                />
                            </div>
                            <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                                <dt className="sr-only">Reviews</dt>
                                <dd className="text-blue-500 flex items-center dark:text-blue-400">
                                    <Star size={18} className="mr-1" />
                                    <span>
                                        {property?.decpropertyrating}
                                    </span>
                                </dd>
                                <dt className="sr-only">Location</dt>
                                <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                                    <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                        <circle cx="1" cy="1" r="1" />
                                    </svg>
                                    <MapPin size={18} className="mr-1" />
                                    <span>{property?.vchaddresscomplement}</span>
                                </dd>
                            </dl>
                            <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-4 lg:col-start-1 lg:row-start-3 lg:row-end-4">
                                <Badge>{property.vchtypename}</Badge>
                            </div>
                            <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-4 lg:row-start-4 lg:col-span-1 dark:text-slate-400">
                                {property?.vchdescription}
                            </p>
                        </div>
                    </main>

                    <div className='pb-6 md:py-5 max-w-5xl mx-auto grid grid-cols-1 lg:max-w-7xl lg:gap-r-14 lg:grid-cols-2'>
                        <Card className="mb-6 bg-transparent border-none shadow-none">
                            <CardHeader>
                                <CardTitle>Características y Amenidades</CardTitle>
                                <Separator className='dark:bg-slate-400' />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Detalles de la propiedad</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="flex items-center">
                                                <Bed className="mr-1 h-4 w-4" />
                                                {property?.intnumberrooms || 0} habitaciones
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center">
                                                <Bath className="mr-1 h-4 w-4" />
                                                {property?.intnumberbathrooms || 0} baños
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center">
                                                <Users className="mr-1 h-4 w-4" />
                                                {property?.intmaxoccupancy || 0} huéspedes
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Amenidades</h4>
                                        <ul className="space-y-1">
                                            {amenities.map((amenity, index) => (
                                                <li key={index} className="flex items-center">
                                                    <amenity.icon className="mr-2 h-4 w-4" />
                                                    <span className='text-sm'>{amenity.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reservacion */}
                        {
                            userData?.roleid == 1 && status === 'authenticated' && (
                                <Card className='bg-white dark:bg-gray-900 border-none shadow-none lg:row-span-2 lg:sticky lg:top-20'>
                                    <CardHeader>
                                        <CardTitle>Reserva tu estancia</CardTitle>
                                        <Separator className='dark:bg-slate-400' />
                                    </CardHeader>
                                    <CardContent className='mx-2'>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-3 shadow-lg pt-2 pb-4 rounded-md'>
                                                <p className="text-2xl font-bold mb-4 mx-2">${property?.decrentalcost || 0} / mensuales</p>
                                                <FormField
                                                    control={form.control}
                                                    name='studentid'
                                                    render={({ field }) => (
                                                        <FormItem className='hidden'>
                                                            <FormLabel>Usuario</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number'
                                                                    placeholder='Usuario'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Indique el usuario que realiza la reserva
                                                            </FormDescription>
                                                            <FormMessage className='text-red-600' />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='intnumguests'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col'>
                                                            <FormLabel>Número de huéspedes</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number'
                                                                    placeholder='Número de huéspedes'
                                                                    className='dark:hover:bg-gray-700 dark:border-gray-500'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Ingrese el número de huéspedes que se hospedarán
                                                            </FormDescription>
                                                            <FormMessage className='text-red-600' />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='vchmessage'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col'>
                                                            <FormLabel>Mensaje</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder='Mensaje de reserva'
                                                                    className='h-24 text-sm dark:hover:bg-gray-700 dark:border-gray-500'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Deja un mensaje para el arrendador
                                                            </FormDescription>
                                                            <FormMessage className='text-red-600' />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='bnhaspets'
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm dark:hover:bg-gray-700 dark:border-gray-500">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>
                                                                    ¿Tienes mascotas?
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    Indica si llevarás mascotas
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className='dark:data-[state=checked]:bg-primary dark:data-[state=unchecked]:bg-gray-500'
                                                                    aria-readonly
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className='pb-4'>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal bg-transparent dark:hover:bg-gray-700 dark:border-gray-500",
                                                                    !startDate && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {startDate ? (
                                                                    `${format(startDate, "PPP", { locale: es })} - ${format(endDate!, "PPP", { locale: es })}`
                                                                ) : (
                                                                    <span>Selecciona un rango de fechas</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="range"
                                                                locale={es}
                                                                className='dark:bg-gray-800 dark:border-gray-500'
                                                                selected={{ from: startDate || undefined, to: endDate || undefined }}
                                                                onSelect={(range) => handleDateChange({ from: range?.from || null, to: range?.to || null })}
                                                                disabled={(date) => date < new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <Button className="w-full" type="submit">
                                                    Reservar ahora
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            )
                        }

                        {/* Comentarios */}
                        {!hasStayed ? (
                            <PropertyReviews reviews={reviews} />
                        ) : (
                            <Card className='bg-white dark:bg-gray-900 border-none shadow-none'>
                                <CardHeader>
                                    <CardTitle>Comentarios</CardTitle>
                                    <Separator className='dark:bg-slate-400' />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">Sólo los huéspedes que se han hospedado pueden dejar un comentario.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-1/2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        No se encontró la propiedad
                    </h4>
                </div>
            )}
        </>
    );
}

export default PropertyComponent;