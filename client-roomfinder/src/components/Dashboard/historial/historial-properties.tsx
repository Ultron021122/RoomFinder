"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Home, Star } from "lucide-react"
import { Spinner } from "@nextui-org/react"

// Definición de tipos
interface RentalProperty {
  id: string
  title: string
  image: string
  address: string
  startDate: string
  endDate: string
  rating: number
  price: number
}

export default function RentalHistory() {
  const [rentals, setRentals] = useState<RentalProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular una llamada a la API
    const fetchRentals = async () => {
      setIsLoading(true)
      try {
        // Aquí normalmente harías una llamada a tu API
        // Por ahora, usaremos datos de ejemplo
        const mockData: RentalProperty[] = [
          {
            id: "1",
            title: "Apartamento acogedor en el centro",
            image: "/placeholder.svg?text=Apartamento+1",
            address: "Calle Principal 123, Ciudad",
            startDate: "2023-01-15",
            endDate: "2023-01-22",
            rating: 4.5,
            price: 800,
          },
          {
            id: "2",
            title: "Casa de playa con vista al mar",
            image: "/placeholder.svg?text=Casa+Playa",
            address: "Avenida Costera 456, Playa del Carmen",
            startDate: "2023-03-10",
            endDate: "2023-03-17",
            rating: 5,
            price: 1200,
          },
          // Puedes agregar más propiedades aquí
        ]
        setRentals(mockData)
      } catch (error) {
        console.error("Error fetching rental history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRentals()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de Arrendamientos</h1>
      {rentals.length === 0 ? (
        <p>No tienes historial de arrendamientos.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rentals.map((rental) => (
            // <CardOwner key={rental.id} {...rental} />
            <Card key={rental.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={rental.image || "/placeholder.svg"} alt={rental.title} layout="fill" objectFit="cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{rental.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  {rental.address}
                </p>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary" className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                    {rental.rating}
                  </Badge>
                  <span className="font-bold">${rental.price} / noche</span>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                  <Button variant="secondary" size="sm">
                    Reservar de nuevo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

