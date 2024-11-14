'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Wifi, Tv, Car, Droplet, Zap, Thermometer, Wind, Shirt, Utensils, Lock } from 'lucide-react'

const propertySchema = z.object({
    propertytypeid: z.number().min(1, 'Seleccione un tipo de propiedad'),
    vchtitle: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
    intnumberrooms: z.number().min(1, 'Debe tener al menos 1 habitación'),
    intnumberbathrooms: z.number().min(1, 'Debe tener al menos 1 baño'),
    intmaxoccupacy: z.number().min(1, 'La ocupación máxima debe ser al menos 1'),
    vchdescription: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
    vchexteriornumber: z.string().min(1, 'Ingrese el número exterior'),
    vchinteriornumber: z.string().optional(),
    vchstreet: z.string().min(1, 'Ingrese el nombre de la calle'),
    vchaddrescomplement: z.string().optional(),
    vchneighborhood: z.string().min(1, 'Ingrese el barrio o colonia'),
    vchmunicipality: z.string().min(1, 'Ingrese el municipio o ciudad'),
    vchstateprovince: z.string().min(1, 'Ingrese el estado o provincia'),
    intzip: z.number().min(10000, 'Ingrese un código postal válido'),
    vchcountry: z.string().min(1, 'Ingrese el país'),
    services: z.array(z.string())
})

type PropertyFormData = z.infer<typeof propertySchema>

const steps = [
    { title: 'Detalles de la Propiedad', fields: ['propertytypeid', 'vchtitle', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupacy', 'vchdescription'] },
    { title: 'Dirección', fields: ['vchexteriornumber', 'vchinteriornumber', 'vchstreet', 'vchaddrescomplement', 'vchneighborhood', 'vchmunicipality', 'vchstateprovince', 'intzip', 'vchcountry'] },
    { title: 'Servicios y Amenidades', fields: ['services'] },
]

const serviceIcons = [
    { id: 'wifi', icon: <Wifi />, label: 'Wi-Fi' },
    { id: 'tv', icon: <Tv />, label: 'TV' },
    { id: 'parking', icon: <Car />, label: 'Estacionamiento' },
    { id: 'water', icon: <Droplet />, label: 'Agua' },
    { id: 'electricity', icon: <Zap />, label: 'Electricidad' },
    { id: 'heating', icon: <Thermometer />, label: 'Calefacción' },
    { id: 'ac', icon: <Wind />, label: 'Aire Acondicionado' },
    { id: 'laundry', icon: <Shirt />, label: 'Lavandería' },
    { id: 'kitchen', icon: <Utensils />, label: 'Cocina' },
    { id: 'security', icon: <Lock />, label: 'Seguridad' },
]

function SortableItem({ id, icon, label }: { id: string, icon: JSX.Element, label: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="text-neutral-950 bg-white dark:bg-gray-950 dark:text-white p-2 mb-2 rounded-md flex items-center space-x-2 cursor-move">
            {icon}
            <span>{label}</span>
        </div>
    )
}

export default function FormularioPropiedad() {
    const [currentStep, setCurrentStep] = useState(0)
    const [availableServices, setAvailableServices] = useState(serviceIcons)
    const [selectedServices, setSelectedServices] = useState<typeof serviceIcons>([])

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PropertyFormData>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            services: []
        }
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const onSubmit: SubmitHandler<PropertyFormData> = (data) => {
        console.log(data)
        toast.success('Propiedad registrada con éxito', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            // Encuentra el servicio activo en la lista de servicios disponibles
            const activeService = availableServices.find((item) => item.id === active.id);
            // Encuentra el servicio en la lista de servicios seleccionados (si existe)
            const overService = selectedServices.find((item) => item.id === over?.id);

            // Mover un servicio de availableServices a selectedServices
            if (activeService && !overService) {
                setAvailableServices((prevAvailable) => {
                    const updatedAvailable = prevAvailable.filter((item) => item.id !== active.id);
                    const updatedSelected = [...selectedServices, activeService];
                    setSelectedServices(updatedSelected);  // Actualizar selectedServices
                    return updatedAvailable;
                });
            }
            // Mover un servicio de selectedServices a availableServices
            else if (overService && !activeService) {
                setSelectedServices((prevSelected) => {
                    const updatedSelected = prevSelected.filter((item) => item.id !== over?.id);
                    const updatedAvailable = [...availableServices, overService];
                    setAvailableServices(updatedAvailable);  // Actualizar availableServices
                    return updatedSelected;
                });
            }
        }

        // Actualiza el formulario con los servicios seleccionados
        setValue('services', selectedServices.map((s) => s.id));
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {steps[currentStep].title}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {currentStep === 0 && (
                            <>
                                <div>
                                    <Label htmlFor="propertytypeid">Tipo de Propiedad</Label>
                                    <Select onValueChange={(value) => register('propertytypeid').onChange({ target: { value: parseInt(value) } })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el tipo de propiedad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Apartamento</SelectItem>
                                            <SelectItem value="2">Casa</SelectItem>
                                            <SelectItem value="3">Estudio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.propertytypeid && <p className="text-red-500 text-sm mt-1">{errors.propertytypeid.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchtitle">Título</Label>
                                    <Input id="vchtitle" {...register('vchtitle')} />
                                    {errors.vchtitle && <p className="text-red-500 text-sm mt-1">{errors.vchtitle.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="intnumberrooms">Número de Habitaciones</Label>
                                    <Input id="intnumberrooms" type="number" {...register('intnumberrooms', { valueAsNumber: true })} />
                                    {errors.intnumberrooms && <p className="text-red-500 text-sm mt-1">{errors.intnumberrooms.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="intnumberbathrooms">Número de Baños</Label>
                                    <Input id="intnumberbathrooms" type="number" {...register('intnumberbathrooms', { valueAsNumber: true })} />
                                    {errors.intnumberbathrooms && <p className="text-red-500 text-sm mt-1">{errors.intnumberbathrooms.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="intmaxoccupacy">Ocupación Máxima</Label>
                                    <Input id="intmaxoccupacy" type="number" {...register('intmaxoccupacy', { valueAsNumber: true })} />
                                    {errors.intmaxoccupacy && <p className="text-red-500 text-sm mt-1">{errors.intmaxoccupacy.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchdescription">Descripción</Label>
                                    <Textarea id="vchdescription" {...register('vchdescription')} />
                                    {errors.vchdescription && <p className="text-red-500 text-sm mt-1">{errors.vchdescription.message}</p>}
                                </div>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <div>
                                    <Label htmlFor="vchexteriornumber">Número Exterior</Label>
                                    <Input id="vchexteriornumber" {...register('vchexteriornumber')} />
                                    {errors.vchexteriornumber && <p className="text-red-500 text-sm mt-1">{errors.vchexteriornumber.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchinteriornumber">Número Interior (opcional)</Label>
                                    <Input id="vchinteriornumber" {...register('vchinteriornumber')} />
                                </div>
                                <div>
                                    <Label htmlFor="vchstreet">Calle</Label>
                                    <Input id="vchstreet" {...register('vchstreet')} />
                                    {errors.vchstreet && <p className="text-red-500 text-sm mt-1">{errors.vchstreet.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchaddrescomplement">Complemento de Dirección (opcional)</Label>
                                    <Input id="vchaddrescomplement" {...register('vchaddrescomplement')} />
                                </div>
                                <div>
                                    <Label htmlFor="vchneighborhood">Barrio/Colonia</Label>
                                    <Input id="vchneighborhood" {...register('vchneighborhood')} />
                                    {errors.vchneighborhood && <p className="text-red-500 text-sm mt-1">{errors.vchneighborhood.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchmunicipality">Municipio/Ciudad</Label>
                                    <Input id="vchmunicipality" {...register('vchmunicipality')} />
                                    {errors.vchmunicipality && <p className="text-red-500 text-sm mt-1">{errors.vchmunicipality.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchstateprovince">Estado/Provincia</Label>
                                    <Input id="vchstateprovince" {...register('vchstateprovince')} />
                                    {errors.vchstateprovince && <p className="text-red-500 text-sm mt-1">{errors.vchstateprovince.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="intzip">Código Postal</Label>
                                    <Input id="intzip" type="number" {...register('intzip', { valueAsNumber: true })} />
                                    {errors.intzip && <p className="text-red-500 text-sm mt-1">{errors.intzip.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="vchcountry">País</Label>
                                    <Input id="vchcountry" {...register('vchcountry')} />
                                    {errors.vchcountry && <p className="text-red-500 text-sm mt-1">{errors.vchcountry.message}</p>}
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                autoScroll
                            >
                                <div className="flex space-x-4">
                                    {/* Servicios disponibles */}
                                    <div className="w-1/2">
                                        <h3 className="font-semibold mb-2">Servicios Disponibles</h3>
                                        <SortableContext
                                            items={availableServices.map(s => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="bg-gray-100 p-4 rounded-md min-h-[200px]">
                                                {availableServices.map((service) => (
                                                    <SortableItem
                                                        key={service.id}
                                                        id={service.id}
                                                        icon={service.icon}
                                                        label={service.label}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </div>

                                    {/* Servicios seleccionados */}
                                    <div className="w-1/2">
                                        <h3 className="font-semibold mb-2">Servicios Seleccionados</h3>
                                        <SortableContext
                                            items={selectedServices.map(s => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            
                                            <div className="bg-gray-100 p-4 rounded-md w-full">
                                                {selectedServices.map((service) => (
                                                    <SortableItem
                                                        key={service.id}
                                                        id={service.id}
                                                        icon={service.icon}
                                                        label={service.label}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </div>
                                </div>
                            </DndContext>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {currentStep > 0 && (
                            <Button type="button" onClick={prevStep}>Anterior</Button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep}>Siguiente</Button>
                        ) : (
                            <Button type="submit">Enviar</Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
            <ToastContainer />
        </div>
    )
}
