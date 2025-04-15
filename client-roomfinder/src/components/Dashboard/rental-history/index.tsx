"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Check, Clock, Home, MapPin, Search, Star, X } from "lucide-react"

// Definición de tipos
interface RentalProperty {
  id: string
  title: string
  image: string
  address: string
  startDate: string
  endDate: string
  rating: number | null
  price: number
  status: "active" | "completed" | "cancelled"
  propertyType: string
}

export default function RentalHistory() {
  const [rentals, setRentals] = useState<RentalProperty[]>([])
  const [filteredRentals, setFilteredRentals] = useState<RentalProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

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
            status: "completed",
            propertyType: "Apartamento",
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
            status: "completed",
            propertyType: "Casa",
          },
          {
            id: "3",
            title: "Loft moderno en zona financiera",
            image: "/placeholder.svg?text=Loft+Moderno",
            address: "Calle Reforma 789, Ciudad de México",
            startDate: "2023-06-05",
            endDate: "2023-07-05",
            rating: null,
            price: 950,
            status: "active",
            propertyType: "Loft",
          },
          {
            id: "4",
            title: "Cabaña en el bosque",
            image: "/placeholder.svg?text=Cabana+Bosque",
            address: "Camino del Bosque 234, Valle de Bravo",
            startDate: "2023-02-10",
            endDate: "2023-02-15",
            rating: 3.5,
            price: 600,
            status: "cancelled",
            propertyType: "Cabaña",
          },
          {
            id: "5",
            title: "Penthouse con terraza panorámica",
            image: "/placeholder.svg?text=Penthouse",
            address: "Avenida Principal 567, Guadalajara",
            startDate: "2023-08-01",
            endDate: "2023-08-15",
            rating: null,
            price: 1500,
            status: "active",
            propertyType: "Penthouse",
          },
        ]
        setRentals(mockData)
        setFilteredRentals(mockData)
      } catch (error) {
        console.error("Error fetching rental history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRentals()
  }, [])

  useEffect(() => {
    // Filtrar rentals basado en searchTerm y filterStatus
    let filtered = rentals

    if (searchTerm) {
      filtered = filtered.filter(
        (rental) =>
          rental.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.propertyType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((rental) => rental.status === filterStatus)
    }

    setFilteredRentals(filtered)
  }, [searchTerm, filterStatus, rentals])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Activo</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Completado</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Historial de Arrendamientos</h1>
        <div className="mt-4 md:mt-0">
          <Button variant="outline">Exportar historial</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, dirección o tipo de propiedad"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron arrendamientos con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredRentals.map((rental) => (
                <Card key={rental.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-48 md:h-auto">
                        <Image
                          src={rental.image || "/placeholder.svg"}
                          alt={rental.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row justify-between mb-2">
                          <h3 className="text-xl font-semibold">{rental.title}</h3>
                          {getStatusBadge(rental.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {rental.address}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            {rental.propertyType}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                          </p>
                          <p className="text-sm font-semibold">${rental.price} / noche</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            {rental.rating ? (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span>{rental.rating} / 5</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Sin calificación</span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Link href={`/propiedades/${rental.id}`}>
                              <Button variant="outline" size="sm">
                                Ver propiedad
                              </Button>
                            </Link>
                            {rental.status === "completed" && !rental.rating && (
                              <Button variant="secondary" size="sm">
                                Calificar estancia
                              </Button>
                            )}
                            {rental.status === "active" && (
                              <Button variant="default" size="sm">
                                Extender estancia
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-8 col-span-full">
                <p className="text-muted-foreground">No se encontraron arrendamientos con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredRentals.map((rental) => (
                <Card key={rental.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={rental.image || "/placeholder.svg"}
                      alt={rental.title}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute top-2 right-2">{getStatusBadge(rental.status)}</div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{rental.title}</h3>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{rental.address}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </span>
                    </p>
                    <div className="flex justify-between items-center mt-3 mb-4">
                      {rental.rating ? (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{rental.rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Sin calificación</span>
                      )}
                      <span className="font-bold">${rental.price} / noche</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <Link href={`/propiedades/${rental.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalles
                        </Button>
                      </Link>
                      {rental.status === "completed" && (
                        <Button variant="secondary" size="sm" className="flex-1">
                          Reservar de nuevo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Resumen de Arrendamientos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center mb-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Activos</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.status === "active").length}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Completados</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.status === "completed").length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
            <div className="flex items-center mb-2">
              <X className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Cancelados</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.status === "cancelled").length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

