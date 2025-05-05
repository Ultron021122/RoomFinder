"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast, Bounce, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import CopyText from "@/components/ui/copy-text"

// Iconos
import {
  Search,
  Edit,
  Trash2,
  Filter,
  RefreshCcw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Eye,
  Download,
  MoreHorizontal,
  Circle,
  CircleCheck,
} from "lucide-react"

// Contexto y utilidades
import { useRequestContext } from "@/contexts/request-context"
import { debounce } from "@/lib/debounce"
import type { LeaseRequest, UserProfile, vwLeaseRequest } from "@/utils/interfaces"

// Componentes adicionales
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner, user } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { HomeIcon } from "@radix-ui/react-icons"
import { REQUEST_STATUS } from "@/utils/constants"
import { useSession } from "next-auth/react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const estadosPermitidos = [1, 3, 6];

export default function AdminRequests() {
  const { data: session } = useSession();
  const userProfileData = session?.user as UserProfile;

  // Contexto y estado
  const { request, requestStatus, isLoading, error, refetchRequest } = useRequestContext()
  const [requestEdit, setRequestEdit] = useState<LeaseRequest | null>(null)
  const [status, setStatus] = useState<string>("all")
  const [dialogoAbierto, setDialogoAbierto] = useState<boolean>(false)
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false)
  const [viewRequest, setViewRequest] = useState<vwLeaseRequest | null>(null)
  const [busqueda, setBusqueda] = useState<string>("")
  const [usersPerPage, setUsersPerPage] = useState<number>(10)
  const [paginaActual, setPaginaActual] = useState<number>(1)
  const [isLoadingState, setIsLoading] = useState<boolean>(false)
  const [errorSystem, setErrorSystem] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [activeTab, setActiveTab] = useState<string>("all")
  const router = useRouter()

  // Estadísticas
  const stats = useMemo(() => {
    if (!Array.isArray(request))
      return {
        total: 0,
        accepted: 0,
        pending: 0,
        review: 0,
        rejected: 0,
      }

    return {
      total: request.length,
      accepted: request.filter((req) => req.statusid === 1 || req.statusid === 6).length,
      pending: request.filter((req) => req.statusid === 2).length,
      review: request.filter((req) => req.statusid === 3).length,
      rejected: request.filter((req) => req.statusid === 4).length,
    }
  }, [request])

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

  // Manejo de búsqueda
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value)
  }

  const debouncedBusquedaChange = useMemo(() => debounce(handleBusquedaChange, 300), [])

  // Filtrado de solicitudes
  const filterRequests = useCallback(() => {
    // Verificar que request sea un array antes de usar filter
    if (!Array.isArray(request)) {
      return []
    }

    return request.filter((req) => {
      // Filtro de búsqueda
      const matchesBusqueda =
        req.vchmessage.toLowerCase().includes(busqueda.toLowerCase()) ||
        req.requestid.toString().includes(busqueda.toLowerCase())
      // || (req.studentName && req.studentName.toLowerCase().includes(busqueda.toLowerCase()))

      // Filtro de estado
      const matchesStatus = status === "all" || status === req.statusid.toString()

      // Filtro de pestaña
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "accepted" && (req.statusid === 1 || req.statusid === 6)) ||
        (activeTab === "pending" && req.statusid === 2) ||
        (activeTab === "review" && req.statusid === 3) ||
        (activeTab === "rejected" && req.statusid === 4)

      // Filtro de fecha
      let matchesDate = true
      if (dateRange.start && dateRange.end) {
        const reqDate = new Date(req.dtrequest)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        endDate.setHours(23, 59, 59, 999) // Incluir todo el día final

        matchesDate = reqDate >= startDate && reqDate <= endDate
      }

      return matchesBusqueda && matchesStatus && matchesTab && matchesDate
    })
  }, [request, busqueda, status, activeTab, dateRange])

  const requestFiltrados = filterRequests()
  const totalPaginas = Math.ceil(requestFiltrados.length / usersPerPage)

  // Paginación
  const getRequestPaginated = useCallback(() => {
    const indiceInicio = (paginaActual - 1) * usersPerPage
    const indiceFin = indiceInicio + usersPerPage
    return requestFiltrados.slice(indiceInicio, indiceFin)
  }, [paginaActual, requestFiltrados, usersPerPage])

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda, status, activeTab, dateRange])

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      debouncedBusquedaChange.cancel()
    }
  }, [debouncedBusquedaChange])

  // Acciones de solicitud
  const handleViewRequest = (request: vwLeaseRequest) => {
    setViewRequest(request)
    setViewDialogOpen(true)
  }

  const handleEditarRequest = (request: LeaseRequest) => {
    setRequestEdit(request)
    setDialogoAbierto(true)
  }

  const exportarSolicitudes = async (solicitudes: vwLeaseRequest[]) => {
    try {
      const response = await axios.post('/api/csv', solicitudes, {
        headers: {
          'Content-Type': 'application/json',
          "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
        },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'solicitudes.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error al exportar CSV: ', err);
    }
  }

  const handleGuardarCambios = async () => {
    if (requestEdit) {
      console.log(requestEdit)
      setIsLoading(true)
      try {
        const response = await axios.patch(`/api/requests/${requestEdit.requestid}`, requestEdit, {
          headers: {
            "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
          },
        })
        refetchRequest()
        setDialogoAbierto(false)
        toast.success(response.data.message.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
          style: { fontSize: "0.9rem" },
          transition: Slide,
        })
      } catch (Error: any) {
        toast.error(Error.response?.data.message || "Error al actualizar la solicitud", {
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
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEliminarRequest = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`/api/requests/${id}`, {
        headers: {
          "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
        },
      })
      refetchRequest()
      if (response.status === 200) {
        toast.success(response.data.message.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
          style: { fontSize: "0.9rem" },
          transition: Slide,
        })
      } else {
        toast.error(response.data.message, {
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
      toast.error(
        Error.response?.data.message || Error.response?.request?.statusText || "Error al eliminar la solicitud",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Cambio de estado
  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  // Resetear filtros
  const resetFilters = () => {
    setBusqueda("")
    setStatus("all")
    setActiveTab("all")
    setDateRange({ start: "", end: "" })
    setPaginaActual(1)
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: es })
  }

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: es })
  }

  const handleUpdateRequestStatus = async (id: number, newStatusId: number, bitConfirm: boolean) => {
    setIsLoading(true);
    try {

      const response = await axios.patch(
        `/api/requests/${id}`,
        { statusid: newStatusId, bitconfirm: bitConfirm },
        {
          headers: {
            "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
          },
        }
      );
      toast.success(`Solicitud actualizada a ${newStatusId === 1 ? "confirmada" : "rechazada"} exitosamente.`, {
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
      refetchRequest(); // Actualiza la lista de solicitudes
    } catch (error: any) {
      toast.error(error.response?.data.message || "Error al actualizar la solicitud.", {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administración de Solicitudes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona todas las solicitudes de arrendamiento</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              // variant="outline"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => exportarSolicitudes(request)}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1" onClick={() => router.refresh()}>
              <RefreshCcw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Solicitudes */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Solicitudes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Solicitudes registradas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Aceptada */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Aceptadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.accepted}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Pendiente */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* En revisión */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">En Revisión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.review}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.review / stats.total) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Rechazada */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">Rechazadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas y filtros */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <TabsList className="mb-4 md:mb-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 dark:data-[state=active]:bg-yellow-900/20 dark:data-[state=active]:text-yellow-300"
              >
                Pendientes
              </TabsTrigger>
              <TabsTrigger
                value="accepted"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
              >
                Aceptadas
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300"
              >
                En Revisión
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-900/20 dark:data-[state=active]:text-red-300"
              >
                Rechazadas
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
                variant="refresh"
                onClick={resetFilters}
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
                    placeholder="Buscar por ID, mensaje o estudiante..."
                    onChange={debouncedBusquedaChange}
                    className="pl-9 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {requestStatus.map((request) => (
                        <SelectItem key={request.statusid} value={request.statusid.toString()}>
                          {request.vchstatusname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={usersPerPage.toString()}
                    onValueChange={(value) => {
                      setUsersPerPage(Number.parseInt(value))
                      setPaginaActual(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                      <SelectValue placeholder="10 por página" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 por página</SelectItem>
                      <SelectItem value="10">10 por página</SelectItem>
                      <SelectItem value="20">20 por página</SelectItem>
                      <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fecha desde
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
                      Fecha hasta
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contenido de pestañas */}
          <TabsContent value="all" className="mt-0">
            <AdminRequestsTable
              requests={getRequestPaginated()}
              isLoading={isLoading}
              onView={handleViewRequest}
              onEdit={handleEditarRequest}
              onDelete={handleEliminarRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <AdminRequestsTable
              requests={getRequestPaginated()}
              isLoading={isLoading}
              onView={handleViewRequest}
              onEdit={handleEditarRequest}
              onDelete={handleEliminarRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="accepted" className="mt-0">
            <AdminRequestsTable
              requests={getRequestPaginated()}
              isLoading={isLoading}
              onView={handleViewRequest}
              onEdit={handleEditarRequest}
              onDelete={handleEliminarRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="review" className="mt-0">
            <AdminRequestsTable
              requests={getRequestPaginated()}
              isLoading={isLoading}
              onView={handleViewRequest}
              onEdit={handleEditarRequest}
              onDelete={handleEliminarRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="rejected" className="mt-0">
            <AdminRequestsTable
              requests={getRequestPaginated()}
              isLoading={isLoading}
              onView={handleViewRequest}
              onEdit={handleEditarRequest}
              onDelete={handleEliminarRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              user={userProfileData}
            />
          </TabsContent>
        </Tabs>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {(paginaActual - 1) * usersPerPage + 1} -{" "}
            {Math.min(paginaActual * usersPerPage, requestFiltrados.length)} de {requestFiltrados.length} solicitudes
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  className={paginaActual === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pageNum = i + 1

                // Si hay más de 5 páginas y estamos en una página > 3
                if (totalPaginas > 5 && paginaActual > 3) {
                  pageNum = paginaActual - 3 + i

                  // Asegurarse de que no excedamos el total de páginas
                  if (pageNum > totalPaginas) {
                    pageNum = totalPaginas - (4 - i)
                  }
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setPaginaActual(pageNum)} isActive={paginaActual === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPaginas > 5 && paginaActual < totalPaginas - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPaginas > 5 && paginaActual < totalPaginas - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPaginaActual(totalPaginas)}>{totalPaginas}</PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                  className={paginaActual === totalPaginas ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={dialogoAbierto} onOpenChange={(open) => setDialogoAbierto(open)}>
        <DialogContent
          className="w-screen sm:w-full max-w-lg bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Editar Solicitud</DialogTitle>
            <DialogDescription>
              Modifica tu solicitud aqui. Guarda los cambios cuando termines.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            {requestEdit && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleGuardarCambios()
                }}
                className="space-y-4 pl-2 pr-3"
              >
                <div>
                  <Label htmlFor="propertyid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID de Propiedad
                  </Label>
                  <Input
                    id="propertyid"
                    value={requestEdit.propertyid}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="vchmessage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mensaje
                  </Label>
                  <Textarea
                    id="vchmessage"
                    placeholder="Mensaje de solicitud"
                    className="h-24 mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    value={requestEdit.vchmessage}
                    onChange={(e) => setRequestEdit({ ...requestEdit, vchmessage: e.target.value })}
                    disabled={userProfileData.roleid !== 1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Checkbox
                      id="bnhaspets"
                      checked={requestEdit.bnhaspets}
                      onCheckedChange={(checked) => setRequestEdit({ ...requestEdit, bnhaspets: checked as boolean })}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mr-2"
                      disabled={userProfileData.roleid !== 1}
                    />
                    <Label htmlFor="bnhaspets" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiene mascotas
                    </Label>
                  </div>
                  <div>
                    <Checkbox
                      id="bitConfirm"
                      checked={requestEdit.bitconfirm}
                      onCheckedChange={(checked) => setRequestEdit({ ...requestEdit, bitconfirm: checked as boolean })}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mr-2"
                      disabled={userProfileData.roleid === 1}
                    />
                    <Label htmlFor="bitConfirm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmar Solicitud
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la solicitud
                  </Label>
                  <Select
                    value={requestEdit.statusid.toString()}
                    onValueChange={(value) => setRequestEdit({ ...requestEdit, statusid: Number.parseInt(value) })}
                    disabled={userProfileData.roleid === 1}
                  >
                    <SelectTrigger id="status" className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestStatus.map((status) => (
                        <SelectItem key={status.statusid} value={status.statusid.toString()}>
                          {status.vchstatusname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dtstartdate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fecha de inicio
                    </Label>
                    <Input
                      id="dtstartdate"
                      type="date"
                      className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      value={format(new Date(requestEdit.dtstartdate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setRequestEdit({ ...requestEdit, dtstartdate: new Date(e.target.value).toISOString() })
                      }
                      disabled={userProfileData.roleid !== 1}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dtenddate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fecha de fin
                    </Label>
                    <Input
                      id="dtenddate"
                      type="date"
                      className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      value={format(new Date(requestEdit.dtenddate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setRequestEdit({ ...requestEdit, dtenddate: new Date(e.target.value).toISOString() })
                      }
                      disabled={userProfileData.roleid !== 1}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive" onClick={() => setDialogoAbierto(false)}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoadingState}>
                    {isLoadingState ? (
                      <>
                        <Spinner color="white" className="mr-2" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Diálogo de visualización */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => setViewDialogOpen(open)}>
        <DialogContent
          className="w-screen sm:w-full max-w-lg bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
          aria-describedby="dialog-description"
        >
          <DialogHeader id="dialog-description">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles de la Solicitud
            </DialogTitle>
            <DialogDescription>
              Visualiza los detalles de la solicitud seleccionada.
            </DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <ScrollArea className="h-[500px]">
              <div className="space-y-6 pl-2 pr-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de Solicitud</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{viewRequest.requestid}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h3>
                    <Badge className={REQUEST_STATUS[viewRequest.statusid as keyof typeof REQUEST_STATUS].color}>
                      {REQUEST_STATUS[viewRequest.statusid as keyof typeof REQUEST_STATUS].name}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Propiedad</h3>
                  <div className="mt-1 flex items-center">
                    <HomeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {/* ID: {viewRequest.propertyid} */}
                      {viewRequest.vchtitle && ` ${viewRequest.vchtitle}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estudiante</h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {/* ID: {viewRequest.studentid} */}
                      {viewRequest.vchstudentname && ` ${viewRequest.vchstudentname}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mensaje</h3>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-gray-300 text-sm">{viewRequest.vchmessage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de solicitud</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDateTime(viewRequest.dtrequest)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mascotas</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {viewRequest.bnhaspets ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de inicio</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewRequest.dtstartdate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de fin</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewRequest.dtenddate)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmado</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {viewRequest.bitconfirm ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="close" onClick={() => setViewDialogOpen(false)}>
                    Cerrar
                  </Button>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setViewDialogOpen(false)
                      handleEditarRequest(viewRequest)
                    }}
                    disabled={viewRequest.statusid !== 2 && userProfileData.roleid === 1}
                  >
                    <Edit />
                    Editar
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de tabla de solicitudes
interface AdminRequestsTableProps {
  requests: vwLeaseRequest[];
  isLoading: boolean;
  onView: (request: vwLeaseRequest) => void;
  onEdit: (request: vwLeaseRequest) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, newStatusId: number, bitConfirm: boolean) => void;
  user: UserProfile;
}

function AdminRequestsTable({ requests, isLoading, onView, onEdit, onDelete, onUpdateStatus, user }: AdminRequestsTableProps) {
  const statusRequest = [2]

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <ScrollArea className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Propiedad</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Mensaje</TableHead>
                <TableHead className="font-semibold">Mascotas</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Periodo</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow
                  className="bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/60"
                >
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0">
                      <Spinner className="h-8 w-8 text-blue-600" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando solicitudes...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow className="bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/60">
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[20vh] lg:py-0">
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron solicitudes con los filtros seleccionados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => {
                  const StatusIcon = REQUEST_STATUS[request.statusid as keyof typeof REQUEST_STATUS].icon

                  return (
                    <TableRow
                      key={request.requestid}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <TableCell className="font-medium">{request.requestid}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <CopyText text={request.vchtitle} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={REQUEST_STATUS[request.statusid as keyof typeof REQUEST_STATUS].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {REQUEST_STATUS[request.statusid as keyof typeof REQUEST_STATUS].name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <CopyText text={request.vchmessage} /> {/* maxLength={30} /> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={request.bnhaspets}
                          disabled
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(request.dtrequest), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(request.dtstartdate), "dd MMM yyyy", { locale: es })} -
                        {format(new Date(request.dtenddate), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 border hover:border-gray-300 dark:hover:border-gray-800 shadow-sm" // Agrega cursor-pointer
                              aria-label="Opciones de solicitud"
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
                              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white" // Hover para "Ver detalles"
                              onSelect={() => onView(request)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white" // Hover para "Editar"
                              onSelect={() => onEdit(request)}
                              disabled={!statusRequest.includes(request.statusid) && user.roleid === 1}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {
                              user.roleid === 1 && request.statusid === 1 && (
                                <>
                                  <AlertDialog>
                                    <AlertDialogTrigger
                                      className="w-full"
                                      disabled={request.statusid !== 1 && user.roleid === 1}
                                    >
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()} // 👈 Evita el cierre automático
                                        className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white w-full"
                                        disabled={request.statusid !== 1 && user.roleid === 1}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rechazar
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro de rechazar esta solicitud?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. La solicitud será Rechazada permanentemente.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel
                                          className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm"
                                        >
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                          onClick={() => onUpdateStatus(request.requestid, 4, false)}
                                        >
                                          Rechazar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger
                                      className="w-full"
                                      disabled={request.statusid !== 1 && user.roleid === 1}
                                    >
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()} // 👈 Evita el cierre automático
                                        className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white w-full"
                                        disabled={request.statusid !== 1 && user.roleid === 1}
                                      >
                                        <CircleCheck className="h-4 w-4 mr-2" />
                                        Confirmar
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro de confirmar esta solicitud?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. La solicitud será aceptada permanentemente.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel
                                          className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm"
                                        >
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-green-600 hover:bg-green-700 text-white dark:hover:bg-green-700 *:hover:bg-green-600 *:text-white"
                                          onClick={() => onUpdateStatus(request.requestid, 6, true)}
                                        >
                                          Confirmar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )
                            }
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger
                                className="w-full"
                                disabled={estadosPermitidos.includes(request.statusid) || user.roleid !== 1}
                              >
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()} // 👈 Evita el cierre automático
                                  className="cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-300 dark:hover:bg-red-800 hover:text-red-800 dark:hover:text-red-300 w-full"
                                  disabled={estadosPermitidos.includes(request.statusid) || user.roleid !== 1}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro de eliminar esta solicitud?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. La solicitud será eliminada permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm"
                                  >
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (request.requestid) {
                                        onDelete(request.requestid);
                                      }
                                    }}
                                  >
                                    Continuar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
