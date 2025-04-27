"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format, differenceInMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "react-toastify"
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Home,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  User,
} from "lucide-react"
import { Spinner } from "@nextui-org/react"
import { LEASE_STATUSES } from "@/utils/constants"

// Tipos
interface Arrendamiento {
  leasesid: number
  propertyid: number
  studentid: number
  dtstartdate: string
  dtenddate: string
  decmonthlycost: number
  created_at: string
  leasestatusid: number
  lease_number: string
  // Campos adicionales que vendrían de joins
  property_title?: string
  student_name?: string
  status_name?: string
}

interface ArrendamientoStats {
  total: number
  activos: number
  finalizados: number
  pendientes: number
  ingresos_totales: number
  duracion_promedio: number
}

export default function ArrendamientosPage() {
  const { data: session, status } = useSession()
  const [arrendamientos, setArrendamientos] = useState<Arrendamiento[]>([])
  const [filteredArrendamientos, setFilteredArrendamientos] = useState<Arrendamiento[]>([])
  const [stats, setStats] = useState<ArrendamientoStats>({
    total: 0,
    activos: 0,
    finalizados: 0,
    pendientes: 0,
    ingresos_totales: 0,
    duracion_promedio: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [sortBy, setSortBy] = useState("fecha_desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })

  // Simulación de datos para demostración
  useEffect(() => {
    const fetchArrendamientos = async () => {
      setIsLoading(true)
      try {
        // En un entorno real, aquí harías una llamada a tu API
        // const response = await axios.get('/api/arrendamientos', {
        //   headers: {
        //     'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
        //   }
        // });
        // setArrendamientos(response.data);

        // Datos simulados para demostración
        const mockData: Arrendamiento[] = Array.from({ length: 50 }, (_, i) => {
          const startDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          const endDate = new Date(startDate)
          endDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 12) + 6)

          const statusId = Math.floor(Math.random() * 4) + 1

          return {
            leasesid: i + 1,
            propertyid: Math.floor(Math.random() * 20) + 1,
            studentid: Math.floor(Math.random() * 100) + 1,
            dtstartdate: startDate.toISOString(),
            dtenddate: endDate.toISOString(),
            decmonthlycost: Math.floor(Math.random() * 5000) + 3000,
            created_at: new Date(startDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            leasestatusid: statusId,
            lease_number: `LEASE-${(i + 1).toString().padStart(5, "0")}`,
            property_title: `Propiedad ${Math.floor(Math.random() * 20) + 1}`,
            student_name: `Estudiante ${Math.floor(Math.random() * 100) + 1}`,
            status_name: LEASE_STATUSES[statusId as keyof typeof LEASE_STATUSES].name,
          }
        })

        setArrendamientos(mockData)

        // Calcular estadísticas
        const activos = mockData.filter((a) => a.leasestatusid === 2).length
        const finalizados = mockData.filter((a) => a.leasestatusid === 3).length
        const pendientes = mockData.filter((a) => a.leasestatusid === 1).length
        const ingresos = mockData.reduce((sum, a) => {
          if (a.leasestatusid === 2 || a.leasestatusid === 3) {
            const months = differenceInMonths(new Date(a.dtenddate), new Date(a.dtstartdate))
            return sum + a.decmonthlycost * months
          }
          return sum
        }, 0)

        const duracionTotal = mockData.reduce((sum, a) => {
          return sum + differenceInMonths(new Date(a.dtenddate), new Date(a.dtstartdate))
        }, 0)

        setStats({
          total: mockData.length,
          activos,
          finalizados,
          pendientes,
          ingresos_totales: ingresos,
          duracion_promedio: duracionTotal / mockData.length,
        })
      } catch (error: any) {
        console.error("Error al cargar arrendamientos:", error)
        toast.error("Error al cargar los datos de arrendamientos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArrendamientos()
  }, [])

  // Aplicar filtros y ordenación
  useEffect(() => {
    let result = [...arrendamientos]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.lease_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.student_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "todos") {
      const statusId = Number.parseInt(statusFilter)
      result = result.filter((a) => a.leasestatusid === statusId)
    }

    // Filtrar por rango de fechas
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      result = result.filter((a) => {
        const aStartDate = new Date(a.dtstartdate)
        return aStartDate >= startDate && aStartDate <= endDate
      })
    }

    // Ordenar
    switch (sortBy) {
      case "fecha_asc":
        result.sort((a, b) => new Date(a.dtstartdate).getTime() - new Date(b.dtstartdate).getTime())
        break
      case "fecha_desc":
        result.sort((a, b) => new Date(b.dtstartdate).getTime() - new Date(a.dtstartdate).getTime())
        break
      case "costo_asc":
        result.sort((a, b) => a.decmonthlycost - b.decmonthlycost)
        break
      case "costo_desc":
        result.sort((a, b) => b.decmonthlycost - a.decmonthlycost)
        break
    }

    setFilteredArrendamientos(result)
  }, [arrendamientos, searchTerm, statusFilter, sortBy, dateRange])

  // Paginación
  const totalPages = Math.ceil(filteredArrendamientos.length / itemsPerPage)
  const paginatedArrendamientos = filteredArrendamientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: es })
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
  }

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setSortBy("fecha_desc")
    setDateRange({ start: "", end: "" })
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <span className="ml-2 text-lg">Cargando arrendamientos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Arrendamientos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Administra y visualiza todos los contratos de arrendamiento
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Arrendamiento
          </Button>
        </div>
      </div>

      {/* Dashboard de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Arrendamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contratos registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Arrendamientos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activos}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {((stats.activos / stats.total) * 100).toFixed(1)}% del total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-blue-600 dark:text-blue-400 font-bold">$</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.ingresos_totales)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos estimados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Duración Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.duracion_promedio.toFixed(1)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Meses por contrato</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por número, propiedad o estudiante..."
                className="pl-9 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="1">Pendientes</SelectItem>
                  <SelectItem value="2">Activos</SelectItem>
                  <SelectItem value="3">Finalizados</SelectItem>
                  <SelectItem value="4">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fecha_desc">Fecha (reciente)</SelectItem>
                  <SelectItem value="fecha_asc">Fecha (antigua)</SelectItem>
                  <SelectItem value="costo_desc">Costo (mayor)</SelectItem>
                  <SelectItem value="costo_asc">Costo (menor)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtros
              </Button>

              <Button
                variant="refresh"
                onClick={resetFilters}
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Resetear
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha inicio desde
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha inicio hasta
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="items-per-page" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Elementos por página
                </Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number.parseInt(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger
                    id="items-per-page"
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de arrendamientos */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                {filteredArrendamientos.length === 0
                  ? "No se encontraron arrendamientos con los filtros seleccionados."
                  : `Mostrando ${paginatedArrendamientos.length} de ${filteredArrendamientos.length} arrendamientos`}
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold">Nº Contrato</TableHead>
                  <TableHead className="font-semibold">Propiedad</TableHead>
                  <TableHead className="font-semibold">Estudiante</TableHead>
                  <TableHead className="font-semibold">Periodo</TableHead>
                  <TableHead className="font-semibold">Costo Mensual</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Creado</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArrendamientos.map((arrendamiento) => {
                  const StatusIcon = LEASE_STATUSES[arrendamiento.leasestatusid as keyof typeof LEASE_STATUSES].icon
                  return (
                    <TableRow
                      key={arrendamiento.leasesid}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <TableCell className="font-medium">{arrendamiento.lease_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          {arrendamiento.property_title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          {arrendamiento.student_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="whitespace-nowrap">
                            {formatDate(arrendamiento.dtstartdate)} - {formatDate(arrendamiento.dtenddate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(arrendamiento.decmonthlycost)}</TableCell>
                      <TableCell>
                        <Badge
                          className={LEASE_STATUSES[arrendamiento.leasestatusid as keyof typeof LEASE_STATUSES].color}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {LEASE_STATUSES[arrendamiento.leasestatusid as keyof typeof LEASE_STATUSES].name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(arrendamiento.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar contrato</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Generar PDF</DropdownMenuItem>
                            <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Cancelar contrato
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1

                // Si hay más de 5 páginas y estamos en una página > 3
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i

                  // Asegurarse de que no excedamos el total de páginas
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i)
                  }
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPages > 5 && currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}
