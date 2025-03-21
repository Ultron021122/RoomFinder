"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"
import { Spinner } from "@nextui-org/react"
import { CardActionArea, CardActions, Rating, Card as CardMui } from '@mui/material';
import { Properties, UserProfile } from "@/utils/interfaces"
import { Galeria } from '@/components/GeneralComponents/Galeria';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import axios from "axios"

export default function RentalHistory() {
  const { data: session, status } = useSession();
  const userData = session?.user as UserProfile;
  const [rentals, setRentals] = useState<Properties[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simular una llamada a la API
  const fetchRentals = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/rental-history/${userData?.usuarioid}`, {
        headers: {
          'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
        }
      });
      setRentals(response.data.data)
    } catch (error) {
      console.error("Error fetching rental history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRentals()
    }
  }, [status])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-2 md:p-8 h-screen overflow-hidden">
      <Card className="overflow-hidden w-auto sm:w-full mx-auto bg-gray-100 dark:bg-gray-950">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Historial de arrendamientos</CardTitle>
        </CardHeader>
        <CardContent>
          {rentals.length === 0 ? (
            <p>No tienes historial de arrendamientos.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rentals.map((rental, index) => (
                <CardOwner key={index} {...rental} />
                // <Card key={rental.id} className="overflow-hidden">
                //   <div className="relative h-48">
                //     <Image src={rental.image || "/placeholder.svg"} alt={rental.title} layout="fill" objectFit="cover" />
                //   </div>
                //   <CardHeader>
                //     <CardTitle className="text-xl">{rental.title}</CardTitle>
                //   </CardHeader>
                //   <CardContent>
                //     <p className="text-sm text-gray-600 mb-2 flex items-center">
                //       <Home className="w-4 h-4 mr-1" />
                //       {rental.address}
                //     </p>
                //     <p className="text-sm text-gray-600 mb-2 flex items-center">
                //       <Calendar className="w-4 h-4 mr-1" />
                //       {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                //     </p>
                //     <div className="flex justify-between items-center mb-4">
                //       <Badge variant="secondary" className="flex items-center">
                //         <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                //         {rental.rating}
                //       </Badge>
                //       <span className="font-bold">${rental.price} / noche</span>
                //     </div>
                //     <div className="flex justify-between">
                //       <Button variant="outline" size="sm">
                //         Ver detalles
                //       </Button>
                //       <Button variant="secondary" size="sm">
                //         Reservar de nuevo
                //       </Button>
                //     </div>
                //   </CardContent>
                // </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


export const CardOwner = (cardProps: Properties) => {
  const route = useRouter();
  // Si objphotos es null o está vacío, usar 'No_image.png' como fallback
  const listaImagenes = (cardProps.objphotos && cardProps.objphotos.length > 0)
    ? cardProps.objphotos.map((imagen, index) => (
      <div key={index} className="relative min-w-full h-full">
        <Image
          width={800}
          height={600}
          src={imagen?.url || "/No_image.png"} // <- Validación aquí
          alt={`Imagen de inmueble ${imagen?.photoid || "No disponible"}`}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
    ))
    : [
      <div key="fallback" className="relative min-w-full h-full">
        <Image
          width={800}
          height={600}
          src="/No_image.png"
          alt="Imagen no disponible"
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
    ];

  return (
    <CardMui
      component={'article'}
      className="max-w-full rounded-md shadow-md dark:shadow-lg bg-white dark:bg-gray-800 rounded-t-[0.5rem]"
    >
      <Galeria imagenes={listaImagenes} />
      <CardActionArea
        color='primary'
        onClick={() => route.push(`/property/${cardProps.propertyid}`)}
      >
        <CardContent>
          <h5 className="mt-1 text-lg font-semibold dark:text-white text-slate-900 md:text-2xl dark:sm:text-white">
            {cardProps.vchtitle}
          </h5>
          <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
            <dt className="sr-only">Reviews</dt>
            <dd className="text-blue-600 flex items-center dark:text-blue-400">
              <Star size={18} className="mr-1" />
              <p>{cardProps.decpropertyrating}</p>
            </dd>
            <dt className="sr-only">Location</dt>
            <dd className="flex items-center text-gray-700 dark:text-gray-200">
              <svg width="2" height="2" aria-hidden="true" fill="currentColor" className="mx-3 text-slate-300">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <MapPin size={18} className="mr-1" />
              {cardProps.vchaddresscomplement}
            </dd>
          </dl>
          <p className={`mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-400`}>
            {cardProps.vchdescription}
          </p>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: '1rem',
            marginBottom: '.5rem'
          }}
        >
          <span
            className="text-base leading-6 col-start-1 sm:col-span-2 lg:row-start-4 lg:col-span-1 dark:text-slate-200"
          >
            ${cardProps.decrentalcost}
          </span>
        </CardActions>
      </CardActionArea>
    </CardMui>
  );
}