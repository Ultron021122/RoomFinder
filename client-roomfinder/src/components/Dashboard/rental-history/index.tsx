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
import { Calendar, Check, Clock, Grid, Home, LayoutGrid, List, MapPin, Search, Star, X } from "lucide-react"
import { Properties, UserProfile } from "@/utils/interfaces"
import { useSession } from "next-auth/react"
import axios from "axios"
import { HomeIcon } from "@radix-ui/react-icons"
import { Spinner } from "@nextui-org/react"

export default function RentalHistory() {
  const { data: session, status } = useSession();
  const userData = session?.user as UserProfile;
  const [rentals, setRentals] = useState<Properties[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Properties[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchRentals = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/rental-history/${userData?.usuarioid}`, {
        headers: {
          'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
        }
      });
      setRentals(response.data.data)
      setFilteredRentals(response.data.data)
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

  useEffect(() => {
    // Filtrar rentals basado en searchTerm y filterStatus
    let filtered = rentals

    if (searchTerm) {
      filtered = filtered.filter(
        (rental) =>
          rental.vchtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.vchaddresscomplement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.propertytypeid.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // if (filterStatus !== "all") {
    //   filtered = filtered.filter((rental) => rental.status === filterStatus)
    // }

    setFilteredRentals(filtered)
  }, [searchTerm, filterStatus, rentals])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 hover:text-green-800 hover:border-green-300 border-green-500 text-green-600 hover:bg-transparent">Activo</Badge>
      case "completed":
        return <Badge className="bg-blue-100 hover:text-blue-800 hover:border-blue-300 hover:bg-transparent border-blue-500 text-blue-500">Completado</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 hover:text-red-800 hover:border-red-300 hover:bg-transparent border-red-500 text-red-500">Cancelado</Badge>
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
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de Arrendamientos</h1>
        <div className="mt-4 md:mt-0">
          <Button variant="outline">Exportar historial</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-transparent rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, dirección o tipo de propiedad"
                className="dark:border-gray-400 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border border-gray-300 dark:border-gray-400">
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
          <TabsList className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
            <TabsTrigger value="list" className="dark:data-[state=active]:bg-gray-950">
              <List className="w-4 h-4 mr-2" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="grid" className="dark:data-[state=active]:bg-gray-950">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Cuadrícula
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 ">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron arrendamientos con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredRentals.map((rental) => (
                <Card key={rental.propertyid} className="overflow-hidden">
                  <CardContent className="p-0 bg-gray-900/5 dark:bg-gray-800 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-48 md:h-auto">
                        <Image
                          src={rental.objphotos[0].url || "/placeholder.svg"}
                          alt={rental.vchtitle}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row justify-between mb-2">
                          <h3 className="text-xl font-semibold">{rental.vchtitle}</h3>
                          {getStatusBadge("active")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {rental.vchaddresscomplement}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <HomeIcon className="w-4 h-4 mr-1" />
                            {rental.propertytypeid}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(rental.dtavailabilitydate)} - {formatDate(rental.created_at)}
                          </p>
                          <p className="text-sm font-semibold">${rental.decrentalcost} / mensuales</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            {rental.decpropertyrating ? (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm">{rental.decpropertyrating} / 5</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Sin calificación</span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Link href={`/property/${rental.propertyid}`}>
                              <Button variant="outline" size="sm" className="dark:bg-gray-950 dark:border-gray-900">
                                Ver propiedad
                              </Button>
                            </Link>
                            {rental.propertyid.toString() === "completed" && !rental.decpropertyrating && (
                              <Button variant="secondary" size="sm">
                                Calificar estancia
                              </Button>
                            )}
                            {rental.propertyid.toString() === "active" && (
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

          <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-8 col-span-full">
                <p className="text-muted-foreground">No se encontraron arrendamientos con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredRentals.map((rental) => (
                <Card key={rental.propertyid} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={rental.objphotos[0].url || "/placeholder.svg"}
                      alt={rental.vchtitle}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute top-2 right-2">{getStatusBadge("active")}</div>
                  </div>
                  <CardContent className="p-4 bg-gray-900/5 dark:bg-gray-800 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{rental.vchtitle}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{rental.vchaddresscomplement}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {formatDate(rental.dtavailabilitydate)} - {formatDate(rental.created_at)}
                      </span>
                    </p>
                    <div className="flex justify-between items-center mt-3 mb-4">
                      {rental.decpropertyrating ? (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{rental.decpropertyrating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Sin calificación</span>
                      )}
                      <span className="font-bold">${rental.decrentalcost} / mensuales</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <Link href={`/propiedades/${rental.propertyid}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full dark:bg-blue-950 dark:border-gray-900">
                          Ver detalles
                        </Button>
                      </Link>
                      {rental.propertyid.toString() === "completed" && (
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

      <div className="bg-white dark:bg-transparent rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Resumen de Arrendamientos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center mb-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Activos</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.propertyid.toString() === "active").length}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Completados</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.propertyid.toString() === "completed").length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
            <div className="flex items-center mb-2">
              <X className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="font-semibold">Arrendamientos Cancelados</h3>
            </div>
            <p className="text-2xl font-bold">{rentals.filter((r) => r.propertyid.toString() === "cancelled").length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

