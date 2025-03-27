"use client"
import type { Properties, PropertyOpinions, UserProfile } from "@/utils/interfaces"
import Image from "next/image"
import { type ForwardRefExoticComponent, type RefAttributes, useEffect, useMemo, useState } from "react"
import axios from "axios"
import PropertyReviews from "./property-reviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Spinner } from "@nextui-org/react"
import { ImageOverlay } from "./image-overlay"
import { Separator } from "../ui/separator"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl } from "@mui/material"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format, addMonths } from "date-fns"
import { Calendar } from "../ui/calendar"
import { es } from "date-fns/locale"
import { useSession } from "next-auth/react"
import {
    MapPin,
    Star,
    Wifi,
    Tv,
    CookingPotIcon as Kitchen,
    Bed,
    Bath,
    AirVentIcon,
    Sparkles,
    Refrigerator,
    Utensils,
    Zap,
    Fence,
    Flame,
    DropletsIcon,
    Car,
    DoorOpen,
    Heater,
    PaintBucket,
    ParkingCircle,
    Sofa,
    WashingMachine,
    Users,
    CalendarIcon,
    Home,
    User,
    Phone,
    LucideProps,
} from "lucide-react"
import dynamic from "next/dynamic"

type Amenity = {
    text: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    included: boolean
}

type PropertyDetails = Pick<Amenity, "text" | "icon"> & {
    amount: number
}

type LessorData = {
    image: string
    name: string
    biography: string
    phone: string
}

const requestFormSchema = z.object({
    propertyid: z.number().positive(),
    studentid: z.number().positive(),
    statusid: z.number().positive(),
    vchmessage: z
        .string({
            message: "El mensaje es requerido",
        })
        .min(25, {
            message: "El mensaje debe tener al menos 25 caracteres",
        }),
    intnumguests: z
        .number({
            message: "El número de huéspedes es requerido",
        })
        .positive()
        .min(1),
    bnhaspets: z.boolean({
        message: "El campo de mascotas",
    }),
    dtstartdate: z.date({
        message: "La fecha de inicio es requerida",
    }),
    dtenddate: z.date({
        message: "La fecha de fin es requerida",
    }),
})

const reviewsFormSchema = z.object({
    propertyid: z
        .number({
            message: "La propiedad es requerida",
        })
        .positive(),
    studentid: z
        .number({
            message: "El estudiante es requerido",
        })
        .positive(),
    decrating: z
        .number({
            message: "La calificación es requerida",
        })
        .positive()
        .max(5),
    vchcomment: z
        .string({
            message: "El comentario es requerido",
        })
        .min(25),
})

const DynamicMap = dynamic(() => import("@/components/Form/Map"),
    {
        ssr: false,
        loading: () => <Spinner />,
    });

function PropertyComponent({ id }: { id: string }) {
    const { data: session, status, update } = useSession()
    const [Lessor, setLessor] = useState<LessorData>()
    const [property, setProperty] = useState<Properties>()
    const [propertyOpinions, setPropertyOpinions] = useState<PropertyOpinions[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorSystem, setErrorSystem] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [hasStayed, setHasStayed] = useState<boolean>(false)

    const userProfileData = session?.user as UserProfile

    const form = useForm<z.infer<typeof requestFormSchema>>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            propertyid: Number(id),
            statusid: 2,
            intnumguests: 1,
            bnhaspets: false,
        },
    })

    const handleDateChange = (dates: { from: Date | null; to: Date | null }) => {
        const { from: startDate, to: endDate } = dates
        if (startDate) {
            const newEndDate = addMonths(startDate, 1)
            setStartDate(startDate)
            setEndDate(newEndDate)
            form.setValue("dtstartdate", startDate)
            form.setValue("dtenddate", newEndDate)
        }
    }

    useEffect(() => {
        if (userProfileData?.usuarioid) {
            form.setValue("studentid", userProfileData.usuarioid)
        }
    }, [userProfileData, form])

    async function onSubmit(values: z.infer<typeof requestFormSchema>) {
        setIsLoading(true)
        setErrorSystem(null)
        try {
            const response = await axios.post("/api/requests", values, {
                headers: {
                    "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                },
            })

            setIsLoading(false)
            if (response.status === 201) {
                toast.success("Reserva realizada con éxito", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        } catch (Error: any) {
            setErrorSystem(Error.response?.data.message || Error.message)
        } finally {
            setIsLoading(false)
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
            })
        }
    }, [errorSystem])

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true)
            setErrorSystem(null)
            try {
                const response = await axios.get(`/api/properties/${id}`, {
                    headers: {
                        "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                    },
                })
                const lessorResponse = await axios.get(`/api/users/lessor/${response.data.data.lessorid}`, {
                    headers: {
                        "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                    },
                })
                const data = lessorResponse.data.data
                setProperty(response.data.data)
                setLessor({
                    image: data.vchimage,
                    name: `${data.vchname} ${data.vchpaternalsurname}`,
                    biography: data.vchbiography,
                    phone: data.vchphone,
                })
                setIsLoading(false)
            } catch (Error: any) {
                setErrorSystem(Error.response?.data.message || Error.message)
            } finally {
                setIsLoading(false)
            }
        }
        const fetchPropertyOpinions = async () => {
            try {
                const response = await axios.get(`/api/properties/opinions/${id}`, {
                    headers: {
                        "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                    },
                })
                setPropertyOpinions(response.data.data)
                console.log(response.data.data)
            } catch (Error: any) {
                if (Error.response.status !== 404) {
                    setErrorSystem(Error.response?.data.message || Error.message)
                }
            }
        }

        fetchProperty()
        fetchPropertyOpinions()
    }, [id])

    const amenities: Amenity[] = useMemo(() => {
        return [
            { text: "Aire acondicionado", icon: AirVentIcon, included: property?.bnairconditioningincluded! },
            { text: "TV cable", icon: Tv, included: property?.bncabletvincluded! },
            { text: "Limpieza", icon: Sparkles, included: property?.bncleaningincluded! },
            { text: "Refrigerador", icon: Refrigerator, included: property?.bncoolerincluded! },
            { text: "Comedor", icon: Utensils, included: property?.bndiningroom! },
            { text: "Luz", icon: Zap, included: property?.bnelectricityincluded! },
            { text: "Patio", icon: Fence, included: property?.bngardenincluded! },
            { text: "Gas", icon: Flame, included: property?.bngasincluded! },
            { text: "Boiler", icon: Heater, included: property?.bnheatingincluded! },
            { text: "Internet", icon: Wifi, included: property?.bninternetincluded! },
            { text: "Cocina", icon: Kitchen, included: property?.bnkitchen! },
            { text: "Área de lavado", icon: PaintBucket, included: property?.bnlaundryincluded! },
            { text: "Sala de estar", icon: Sofa, included: property?.bnlivingroom! },
            { text: "Estacionamiento", icon: ParkingCircle, included: property?.bnparkingincluded! },
            { text: "Lavadora", icon: WashingMachine, included: property?.bnwashingmachineincluded! },
            { text: "Servicio de agua", icon: DropletsIcon, included: property?.bnwaterincluded! },
        ]
    }, [property])

    const propertyDetails: PropertyDetails[] = useMemo(() => {
        return [
            { text: "Recámaras", icon: DoorOpen, amount: property?.intnumberrooms! },
            { text: "Camas", icon: Bed, amount: property?.intnumberbeds! },
            { text: "Baños", icon: Bath, amount: property?.intnumberbathrooms! },
            { text: "Cap. Estacionamiento", icon: Car, amount: property?.intaccountparking! },
        ]
    }, [property])

    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0">
                    <Spinner />
                </div>
            ) : property ? (
                <div className="bg-gradient-to-b min-h-screen">
                    {/* Hero Section */}
                    <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-7xl lg:gap-x-20 lg:grid-cols-2">
                            <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1 z-30">
                                <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">
                                    {property?.vchtitle}
                                </h1>
                                <p className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">
                                    Propiedad
                                </p>
                            </div>
                            <div className="grid gap-2 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-2 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
                                <div className="relative sm:h-52 sm:col-span-2 lg:col-span-full">
                                    <Image
                                        width={800}
                                        height={800}
                                        src={property?.objphotos?.[0]?.url || "/No_image.png"}
                                        alt={`Imagen ${property?.objphotos?.[0]?.photoid || "No disponible"}`}
                                        priority
                                        className="w-full h-60 object-cover rounded-lg shadow-lg sm:h-52 sm:col-span-2 lg:col-span-full hover:opacity-95 transition-opacity"
                                    />
                                    {property?.objphotos && <ImageOverlay images={property?.objphotos} />}
                                </div>
                                <Image
                                    width={800}
                                    height={800}
                                    src={property?.objphotos?.[1]?.url || "/No_image.png"}
                                    alt={`Imagen ${property?.objphotos?.[1]?.photoid || "No disponible"}`}
                                    className="hidden w-full h-52 object-cover rounded-lg shadow-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32 hover:opacity-95 transition-opacity"
                                    priority
                                />
                                <Image
                                    width={800}
                                    height={800}
                                    src={property?.objphotos?.[2]?.url || "/No_image.png"}
                                    alt={`Imagen ${property?.objphotos?.[2]?.photoid || "No disponible"}`}
                                    className="hidden w-full h-52 object-cover rounded-lg shadow-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32 hover:opacity-95 transition-opacity"
                                    priority
                                />
                            </div>
                            <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
                                <dt className="sr-only">Reviews</dt>
                                <dd className="text-blue-600 flex items-center dark:text-blue-400">
                                    <Star size={18} className="mr-1 fill-current" />
                                    <span className="font-bold">{property?.decpropertyrating}</span>
                                </dd>
                                <dt className="sr-only">Location</dt>
                                <dd className="flex items-center text-neutral-700 dark:text-neutral-200">
                                    <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                                        <circle cx="1" cy="1" r="1" />
                                    </svg>
                                    <MapPin size={18} className="mr-1 text-gray-600 dark:text-gray-400" />
                                    <span>{property?.vchaddresscomplement}</span>
                                </dd>
                            </dl>
                            <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-4 lg:col-start-1 lg:row-start-3 lg:row-end-4">
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 transition-colors">
                                    {property.vchtypename}
                                </Badge>
                            </div>
                            <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-4 lg:row-start-4 lg:col-span-1 dark:text-slate-300">
                                {property?.vchdescription}
                            </p>
                            {/* <Button className='col-start-1 row-start-6 mt-4 lg:-mt-10 lg:max-w-[70%] lg:ml-16 shadow-lg'>
                                Contactar al arrendador
                            </Button> */}
                        </div>
                    </main>

                    <div className="container mx-auto px-4 pb-6 md:py-5 max-w-5xl lg:max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Características y Amenidades */}
                            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                                    <CardTitle className="text-blue-800 dark:text-blue-300">Características y Amenidades</CardTitle>
                                    {/* <Separator className="dark:bg-gray-600" /> */}
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                                <Home className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                Detalles de la propiedad
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {propertyDetails.map((detail, index) => {
                                                    return (
                                                        detail.amount > 0 && (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="flex items-center bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                            >
                                                                <detail.icon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                {`${detail.amount} ${detail.text}`}
                                                            </Badge>
                                                        )
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                                <Sparkles className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                Amenidades
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {amenities
                                                    .filter((a) => a.included)
                                                    .map((amenity, index) => (
                                                        <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                                                            <amenity.icon className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            <span className="text-sm">{amenity.text}</span>
                                                        </li>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reservación */}
                            {userProfileData?.roleid == 1 && status === "authenticated" && (
                                <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl overflow-hidden lg:row-span-2 lg:sticky lg:top-20">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                                        <CardTitle className="text-blue-800 dark:text-blue-300">Reserva tu estancia</CardTitle>
                                        {/* <Separator className="dark:bg-gray-600" /> */}
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                                                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                                                        ${property?.decrentalcost || 0}
                                                    </p>
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">mensuales</span>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="studentid"
                                                    render={({ field }) => (
                                                        <FormItem className="hidden">
                                                            <FormLabel>Usuario</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Usuario" {...field} />
                                                            </FormControl>
                                                            <FormDescription>Indique el usuario que realiza la reserva</FormDescription>
                                                            <FormMessage className="text-red-600" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="intnumguests"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel className="text-gray-800 dark:text-gray-200">
                                                                <Users className="inline mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                Número de huéspedes
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Número de huéspedes"
                                                                    className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-gray-500 dark:text-gray-400">
                                                                Ingrese el número de huéspedes que se hospedarán
                                                            </FormDescription>
                                                            <FormMessage className="text-red-600" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="vchmessage"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel className="text-gray-800 dark:text-gray-200">Mensaje</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Mensaje de reserva"
                                                                    className="h-24 text-sm border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-gray-500 dark:text-gray-400">
                                                                Deja un mensaje para el arrendador
                                                            </FormDescription>
                                                            <FormMessage className="text-red-600" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="bnhaspets"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-700/50">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-gray-800 dark:text-gray-200">¿Tienes mascotas?</FormLabel>
                                                                <FormDescription className="text-gray-500 dark:text-gray-400">
                                                                    Indica si llevarás mascotas
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                                                                    aria-readonly
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="pb-4">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400 dark:bg-gray-700 dark:text-white",
                                                                    !startDate && "text-muted-foreground",
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
                                                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                                                                selected={{ from: startDate || undefined, to: endDate || undefined }}
                                                                onSelect={(range) =>
                                                                    handleDateChange({ from: range?.from || null, to: range?.to || null })
                                                                }
                                                                disabled={(date) => date < new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                                    type="submit"
                                                >
                                                    Reservar ahora
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Comentarios */}
                            {propertyOpinions && (
                                <PropertyReviews
                                    reviews={propertyOpinions}
                                    comment={hasStayed}
                                    user={userProfileData}
                                    propertyid={property.propertyid}
                                />
                            )}
                        </div>

                        <section className="mt-10 mb-14 space-y-4">
                            <h5 className="text-xl font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Ubicación
                            </h5>
                            <DynamicMap
                                position={[property.lat, property.lng]}
                                zoom={16}
                                style="rounded-md shadow-lg h-96 w-96 w-full mx-auto mt-6 z-10"
                            />
                        </section>
                        {/* Sobre el arrendador */}
                        <section className="mt-10 mb-14 space-y-4">
                            <h5 className="text-xl font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                                <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Sobre el arrendador
                            </h5>
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl overflow-hidden max-w-3xl">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-md">
                                            <Image
                                                src={`${Lessor?.image}`}
                                                layout="fill"
                                                objectFit="cover"
                                                alt="Foto de perfil del arrendador"
                                            />
                                        </div>
                                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{Lessor?.name}</p>
                                    </div>
                                    <div className="flex flex-col space-y-6">
                                        <div className="space-y-2">
                                            <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Información</h6>
                                            <p className="text-gray-700 dark:text-gray-300 rounded-lg">
                                                {Lessor?.biography}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de teléfono</h6>
                                            <p className="text-gray-700 dark:text-gray-300 flex items-center">
                                                <Phone className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                {Lessor?.phone}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-gray-900 dark:hover:bg-blue-900/30"
                                        >
                                            Contactar al arrendador
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-1/2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">No se encontró la propiedad</h4>
                </div>
            )}
        </>
    )
}

export default PropertyComponent

