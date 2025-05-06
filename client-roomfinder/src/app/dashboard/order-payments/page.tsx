"use client"

import { useState, useEffect, useMemo } from "react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Home,
  MoreHorizontal,
  Printer,
  Receipt,
  RefreshCcw,
  Search,
  Send,
  User,
  XCircle,
} from "lucide-react"
import { Spinner } from "@nextui-org/react"

// Tipos
interface OrdenPago {
  id: number
  numero: string
  arrendamientoId: number
  propiedadId: number
  estudianteId: number
  monto: number
  fechaEmision: string
  fechaVencimiento: string
  fechaPago: string | null
  estado: "pendiente" | "pagado" | "vencido" | "cancelado"
  metodoPago: string | null
  referenciaPago: string | null
  conceptoPago: string
  periodo: string
  // Campos adicionales que vendrían de joins
  propiedadNombre: string
  estudianteNombre: string
  arrendamientoNumero: string
}

// Estados de pago
const PAYMENT_STATUSES = {
  pendiente: {
    name: "Pendiente",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    icon: Clock,
  },
  pagado: {
    name: "Pagado",
    color:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    icon: CheckCircle,
  },
  vencido: {
    name: "Vencido",
    color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
  cancelado: {
    name: "Cancelado",
    color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
    icon: XCircle,
  },
}

// Métodos de pago
const PAYMENT_METHODS = [
  { id: "transferencia", name: "Transferencia bancaria" },
  { id: "tarjeta", name: "Tarjeta de crédito/débito" },
  { id: "efectivo", name: "Efectivo" },
  { id: "deposito", name: "Depósito bancario" },
  { id: "paypal", name: "PayPal" },
]

// Datos estáticos para demostración
const ORDENES_PAGO: OrdenPago[] = Array.from({ length: 50 }, (_, i) => {
  const fechaEmision = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  const fechaVencimiento = addDays(fechaEmision, 15)

  // Determinar estado y fecha de pago
  let estado: "pendiente" | "pagado" | "vencido" | "cancelado"
  let fechaPago: string | null = null
  let metodoPago: string | null = null
  let referenciaPago: string | null = null

  const random = Math.random()
  if (random < 0.4) {
    estado = "pagado"
    fechaPago = addDays(fechaEmision, Math.floor(Math.random() * 10) + 1).toISOString()
    metodoPago = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)].id
    referenciaPago = `REF-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`
  } else if (random < 0.7) {
    estado = "pendiente"
  } else if (random < 0.9) {
    estado = "vencido"
  } else {
    estado = "cancelado"
  }

  const mes = fechaEmision.toLocaleString("es-ES", { month: "long" })
  const año = fechaEmision.getFullYear()

  return {
    id: i + 1,
    numero: `PAY-${(i + 1).toString().padStart(5, "0")}`,
    arrendamientoId: Math.floor(Math.random() * 20) + 1,
    propiedadId: Math.floor(Math.random() * 30) + 1,
    estudianteId: Math.floor(Math.random() * 100) + 1,
    monto: Math.floor(Math.random() * 5000) + 3000,
    fechaEmision: fechaEmision.toISOString(),
    fechaVencimiento: fechaVencimiento.toISOString(),
    fechaPago,
    estado,
    metodoPago,
    referenciaPago,
    conceptoPago: `Renta mensual`,
    periodo: `${mes} ${año}`,
    propiedadNombre: `Propiedad ${Math.floor(Math.random() * 30) + 1}`,
    estudianteNombre: `Estudiante ${Math.floor(Math.random() * 100) + 1}`,
    arrendamientoNumero: `LEASE-${Math.floor(Math.random() * 100)
      .toString()
      .padStart(5, "0")}`,
  }
})

export default function OrdenesPagoPage() {
  const [ordenesPago, setOrdenesPago] = useState<OrdenPago[]>(ORDENES_PAGO)
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenPago[]>(ORDENES_PAGO)
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
  const [activeTab, setActiveTab] = useState("todos")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewOrden, setViewOrden] = useState<OrdenPago | null>(null)

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: ordenesPago.length,
      pendientes: ordenesPago.filter((o) => o.estado === "pendiente").length,
      pagados: ordenesPago.filter((o) => o.estado === "pagado").length,
      vencidos: ordenesPago.filter((o) => o.estado === "vencido").length,
      montoTotal: ordenesPago.reduce((sum, o) => sum + o.monto, 0),
      montoPagado: ordenesPago.filter((o) => o.estado === "pagado").reduce((sum, o) => sum + o.monto, 0),
      montoPendiente: ordenesPago.filter((o) => o.estado === "pendiente").reduce((sum, o) => sum + o.monto, 0),
    }
  }, [ordenesPago])

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Aplicar filtros y ordenación
  useEffect(() => {
    let result = [...ordenesPago]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (o) =>
          o.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.propiedadNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.estudianteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.conceptoPago.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "todos") {
      result = result.filter((o) => o.estado === statusFilter)
    }

    // Filtrar por pestaña
    if (activeTab !== "todos") {
      result = result.filter((o) => o.estado === activeTab)
    }

    // Filtrar por rango de fechas
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      result = result.filter((o) => {
        const fechaEmision = new Date(o.fechaEmision)
        return fechaEmision >= startDate && fechaEmision <= endDate
      })
    }

    // Ordenar
    switch (sortBy) {
      case "fecha_asc":
        result.sort((a, b) => new Date(a.fechaEmision).getTime() - new Date(b.fechaEmision).getTime())
        break
      case "fecha_desc":
        result.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime())
        break
      case "monto_asc":
        result.sort((a, b) => a.monto - b.monto)
        break
      case "monto_desc":
        result.sort((a, b) => b.monto - a.monto)
        break
      case "vencimiento_asc":
        result.sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())
        break
      case "vencimiento_desc":
        result.sort((a, b) => new Date(b.fechaVencimiento).getTime() - new Date(a.fechaVencimiento).getTime())
        break
    }

    setFilteredOrdenes(result)
  }, [ordenesPago, searchTerm, statusFilter, sortBy, dateRange, activeTab])

  // Paginación
  const totalPages = Math.ceil(filteredOrdenes.length / itemsPerPage)
  const paginatedOrdenes = filteredOrdenes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  // Ver detalles de orden
  const handleViewOrden = (orden: OrdenPago) => {
    setViewOrden(orden)
    setViewDialogOpen(true)
  }

  // Marcar como pagado
  const handleMarkAsPaid = (id: number) => {
    const updatedOrdenes = ordenesPago.map((orden) => {
      if (orden.id === id) {
        return {
          ...orden,
          estado: "pagado" as const,
          fechaPago: new Date().toISOString(),
          metodoPago: "transferencia",
          referenciaPago: `REF-${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0")}`,
        }
      }
      return orden
    })

    setOrdenesPago(updatedOrdenes)
    toast.success("Orden marcada como pagada correctamente")
  }

  // Cancelar orden
  const handleCancelOrder = (id: number) => {
    const updatedOrdenes = ordenesPago.map((orden) => {
      if (orden.id === id) {
        return {
          ...orden,
          estado: "cancelado" as const,
        }
      }
      return orden
    })

    setOrdenesPago(updatedOrdenes)
    toast.success("Orden cancelada correctamente")
  }

  // Enviar recordatorio
  const handleSendReminder = (id: number) => {
    toast.success(`Recordatorio enviado para la orden #${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="success" />
        <span className="ml-2 text-lg">Cargando órdenes de pago...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Órdenes de Pago</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona y visualiza todas las órdenes de pago de arrendamientos
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Dashboard de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Órdenes registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Pagos Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pagados}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {((stats.pagados / stats.total) * 100).toFixed(1)}% del total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendientes}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(stats.montoPendiente)}</p>
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
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.montoPagado)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {((stats.montoPagado / stats.montoTotal) * 100).toFixed(1)}% del total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas y filtros */}
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <TabsList className="mb-4 md:mb-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger
              value="todos"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="pendiente"
              className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 dark:data-[state=active]:bg-yellow-900/20 dark:data-[state=active]:text-yellow-300"
            >
              Pendientes
            </TabsTrigger>
            <TabsTrigger
              value="pagado"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
            >
              Pagados
            </TabsTrigger>
            <TabsTrigger
              value="vencido"
              className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-900/20 dark:data-[state=active]:text-red-300"
            >
              Vencidos
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>

            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Resetear
            </Button>
          </div>
        </div>

        {/* Filtros */}
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
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="pagado">Pagados</SelectItem>
                    <SelectItem value="vencido">Vencidos</SelectItem>
                    <SelectItem value="cancelado">Cancelados</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fecha_desc">Fecha emisión (reciente)</SelectItem>
                    <SelectItem value="fecha_asc">Fecha emisión (antigua)</SelectItem>
                    <SelectItem value="vencimiento_desc">Vencimiento (reciente)</SelectItem>
                    <SelectItem value="vencimiento_asc">Vencimiento (antigua)</SelectItem>
                    <SelectItem value="monto_desc">Monto (mayor)</SelectItem>
                    <SelectItem value="monto_asc">Monto (menor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha emisión desde
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
                    Fecha emisión hasta
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

        {/* Tabla de órdenes de pago */}
        <TabsContent value="todos" className="mt-0">
          <OrdenesPagoTable
            ordenes={paginatedOrdenes}
            onView={handleViewOrden}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancelOrder}
            onSendReminder={handleSendReminder}
          />
        </TabsContent>

        <TabsContent value="pendiente" className="mt-0">
          <OrdenesPagoTable
            ordenes={paginatedOrdenes}
            onView={handleViewOrden}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancelOrder}
            onSendReminder={handleSendReminder}
          />
        </TabsContent>

        <TabsContent value="pagado" className="mt-0">
          <OrdenesPagoTable
            ordenes={paginatedOrdenes}
            onView={handleViewOrden}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancelOrder}
            onSendReminder={handleSendReminder}
          />
        </TabsContent>

        <TabsContent value="vencido" className="mt-0">
          <OrdenesPagoTable
            ordenes={paginatedOrdenes}
            onView={handleViewOrden}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancelOrder}
            onSendReminder={handleSendReminder}
          />
        </TabsContent>
      </Tabs>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredOrdenes.length)} de {filteredOrdenes.length} órdenes
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
      </div>

      {/* Diálogo de visualización */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent
          className="w-screen sm:w-full max-w-lg bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
          aria-describedby="dialog-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles de la Orden de Pago
            </DialogTitle>
          </DialogHeader>
          {viewOrden &&
            (
              <ScrollArea className="h-[500px]">
              <div className="space-y-6 pl-2 pr-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Orden</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{viewOrden.numero}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h3>
                    {/* <Badge className={PAYMENT_STATUSES[viewOrden.estado as keyof typeof PAYMENT_STATUSES].color}>\
                      <PAYMENT_STATUSES[viewOrden.estado as keyof typeof PAYMENT_STATUSES].icon className="h-3 w-3 mr-1" />
                      {PAYMENT_STATUSES[viewOrden.estado as keyof typeof PAYMENT_STATUSES].name}
                    </Badge> */}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Propiedad</h3>
                  <div className="mt-1 flex items-center">
                    <Home className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {viewOrden.propiedadNombre}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estudiante</h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {viewOrden.estudianteNombre}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monto</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(viewOrden.monto)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Periodo</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {viewOrden.periodo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Emisión</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewOrden.fechaEmision)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Vencimiento</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewOrden.fechaVencimiento)}
                    </p>
                  </div>
                </div>

                {viewOrden.estado === "pagado" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Pago</h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {viewOrden.fechaPago ? formatDate(viewOrden.fechaPago) : "No disponible"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Método de Pago</h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {PAYMENT_METHODS.find(m => m.id === viewOrden.metodoPago)?.name || "No disponible"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Referencia de Pago</h3>
                      <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                        {viewOrden.referenciaPago || "No disponible"}
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Cerrar
                  </Button>
                  
                  {viewOrden.estado === "pendiente" && (
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleMarkAsPaid(viewOrden.id)
                        setViewDialogOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Pagado
                    </Button>
                  )}
                  
                  {viewOrden.estado === "pagado" && (
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir Recibo
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de tabla de órdenes de pago
interface OrdenesPagoTableProps {
  ordenes: OrdenPago[]
  onView: (orden: OrdenPago) => void
  onMarkAsPaid: (id: number) => void
  onCancel: (id: number) => void
  onSendReminder: (id: number) => void
}

function OrdenesPagoTable({ ordenes, onView, onMarkAsPaid, onCancel, onSendReminder }: OrdenesPagoTableProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold">Nº Orden</TableHead>
                <TableHead className="font-semibold">Propiedad</TableHead>
                <TableHead className="font-semibold">Estudiante</TableHead>
                <TableHead className="font-semibold">Concepto</TableHead>
                <TableHead className="font-semibold">Monto</TableHead>
                <TableHead className="font-semibold">Emisión</TableHead>
                <TableHead className="font-semibold">Vencimiento</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.length === 0 ? (
                <TableRow className="bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/60">
                  <TableCell colSpan={9}>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[20vh] lg:py-0">
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron órdenes de pago con los filtros seleccionados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ordenes.map((orden) => {
                  const StatusIcon = PAYMENT_STATUSES[orden.estado].icon

                  return (
                    <TableRow
                      key={orden.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <TableCell className="font-medium">{orden.numero}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="truncate max-w-[150px]">{orden.propiedadNombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="truncate max-w-[150px]">{orden.estudianteNombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="truncate max-w-[150px]">{orden.conceptoPago}</span>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(orden.monto)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(orden.fechaEmision), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(orden.fechaVencimiento), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge className={PAYMENT_STATUSES[orden.estado].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {PAYMENT_STATUSES[orden.estado].name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 border hover:border-gray-300 dark:hover:border-gray-800 shadow-sm"
                              aria-label="Opciones de orden de pago"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={5}
                            collisionPadding={10}
                            className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
                          >
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                              onSelect={() => onView(orden)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>

                            {orden.estado === "pendiente" && (
                              <>
                                <DropdownMenuItem
                                  className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                  onSelect={() => onMarkAsPaid(orden.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Marcar como pagado
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                  onSelect={() => onSendReminder(orden.id)}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Enviar recordatorio
                                </DropdownMenuItem>
                              </>
                            )}

                            {orden.estado === "pagado" && (
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimir recibo
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {orden.estado === "pendiente" && (
                              <AlertDialog>
                                <AlertDialogTrigger className="w-full">
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-300 dark:hover:bg-red-800 hover:text-red-800 dark:hover:text-red-300 w-full"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancelar orden
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro de cancelar esta orden?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. La orden será marcada como cancelada.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onCancel(orden.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Continuar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Función para formatear fecha
function formatDate(dateString: string) {
  return format(new Date(dateString), "dd MMM yyyy", { locale: es })
}

// Función para formatear moneda
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}
