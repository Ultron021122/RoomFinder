"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast, Bounce, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
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
  User,
  FileText,
  Eye,
  Download,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Home,
  BadgePlus,
  LinkIcon,
} from "lucide-react"

// Componentes adicionales
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLeasesContext } from "@/contexts/leases-context"
import { debounce } from "@/lib/debounce"
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
import { UserProfile, vwLeasesGET } from "@/utils/interfaces"
import { Spinner } from "@nextui-org/react"
import { LEASE_STATUS } from "@/utils/constants"
import { HomeIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const allowedStatuses = [1, 3, 6]

export default function AdminLeasesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { leases, isLoading, refetchLeases, leasesStatus } = useLeasesContext()
  const userProfileData = session?.user as UserProfile;

  // Estado
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false)
  const [viewLease, setViewLease] = useState<any | null>(null)
  const [editLease, setEditLease] = useState<any | null>(null)
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false)
  const [errorSystem, setErrorSystem] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [activeTab, setActiveTab] = useState<string>("all")
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Estadísticas
  const stats = useMemo(() => {
    if (!Array.isArray(leases))
      return {
        total: 0,
        active: 0,
        pending: 0,
        completed: 0,
        extend: 0,
        generate: 0,
        totalIncome: 0,
      }

    return {
      total: leases.length,
      active: leases.filter((lease) => lease.leasestatusid === 1).length,
      pending: leases.filter((lease) => lease.leasestatusid === 2).length,
      completed: leases.filter((lease) => lease.leasestatusid === 3).length,
      extend: leases.filter((lease) => lease.leasestatusid === 4).length,
      generate: leases.filter((lease) => lease.leasestatusid === 5).length,
      totalIncome: leases.reduce((sum, lease) => {
        const monthlyCost = Number(lease.decmonthlycost) || 0;
        if (lease.leasestatusid === 1 || lease.leasestatusid === 3) {
          return sum + monthlyCost;
        }
        return sum
      }, 0),
    }
  }, [leases])

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const debouncedSearchChange = useMemo(() => debounce(handleSearchChange, 300), [])

  const filterLeases = useCallback(() => {
    // Verificar que leases sea un array antes de usar filter
    if (!Array.isArray(leases)) {
      return [];
    }

    return leases.filter((lease) => {
      // Filtro de búsqueda
      const matchesSearch =
        lease.vchtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.lease_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.vchstudentname?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de estado
      const matchesStatus = statusFilter === "all" || statusFilter === String(lease.leasestatusid);

      // Filtro de pestaña
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && lease.leasestatusid === 1) ||
        (activeTab === "pending" && lease.leasestatusid === 2) ||
        (activeTab === "completed" && lease.leasestatusid === 3) ||
        (activeTab === "extended" && lease.leasestatusid === 4) ||
        (activeTab === "generate" && lease.leasestatusid === 5);

      // Filtro de fecha
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const leaseDate = new Date(lease.dtstartdate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Incluir todo el día final

        matchesDate = leaseDate >= startDate && leaseDate <= endDate;
      }

      return matchesSearch && matchesStatus && matchesTab && matchesDate;
    });
  }, [leases, searchTerm, statusFilter, activeTab, dateRange]);

  const filteredLeases = filterLeases()
  const totalPages = Math.ceil(filteredLeases.length / itemsPerPage)

  // Paginación
  const getPaginatedLeases = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredLeases.slice(startIndex, endIndex)
  }, [currentPage, filteredLeases, itemsPerPage])

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, activeTab, dateRange])

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      debouncedSearchChange.cancel()
    }
  }, [debouncedSearchChange])

  // Acciones de arrendamiento
  const handleViewLease = (lease: any) => {
    setViewLease(lease)
    setViewDialogOpen(true)
  }

  const handleEditLease = (lease: any) => {
    setEditLease(lease)
    setDialogOpen(true)
  }

  const exportLeases = async (leasesToExport: vwLeasesGET[]) => {
    try {
      const response = await axios.post("/api/csv/leases", leasesToExport, {
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
        },
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "arrendamientos.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error al exportar CSV: ", err)
      toast.error("Error al exportar los datos", {
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
  }

  const handleSaveChanges = async () => {
    if (editLease) {
      setIsLoadingState(true)
      try {
        const response = await axios.patch(`/api/leases/${editLease.leasesid}`, editLease, {
          headers: {
            "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
          },
        })
        refetchLeases()
        setDialogOpen(false)
        toast.success(response.data.message || "Arrendamiento actualizado con éxito", {
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
        toast.error(Error.response?.data.message || "Error al actualizar el arrendamiento", {
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
        setIsLoadingState(false)
      }
    }
  }

  const handleDeleteLease = async (id: number) => {
    setIsLoadingState(true)
    try {
      const response = await axios.delete(`/api/leases/${id}`, {
        headers: {
          "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
        },
      })
      refetchLeases()
      if (response.status === 200) {
        toast.success(response.data.message || "Arrendamiento eliminado con éxito", {
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
        toast.error(response.data.message || "Error al eliminar el arrendamiento", {
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
        Error.response?.data.message || Error.response?.request?.statusText || "Error al eliminar el arrendamiento",
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
      setIsLoadingState(false)
    }
  }

  // Cambio de estado
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setActiveTab("all")
    setDateRange({ start: "", end: "" })
    setCurrentPage(1)
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: es })
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
  }

  return (
    <div className="p-2 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administración de Arrendamientos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona todos los contratos de arrendamiento</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => exportLeases(leases)}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              onClick={() => router.refresh()}
            >
              <RefreshCcw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Total Arrendamientos
              </CardTitle>
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
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Pausados
              </CardTitle>
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

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}% del total
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
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos mensuales</p>
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
                Todos
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
              >
                Activos
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 dark:data-[state=active]:bg-yellow-900/20 dark:data-[state=active]:text-yellow-300"
              >
                Pausados
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300"
              >
                Completados
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
              >
                Generados
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
                    placeholder="Buscar por número, propiedad o estudiante..."
                    onChange={debouncedSearchChange}
                    className="pl-9 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {leasesStatus.map((status) => (
                        <SelectItem key={status.leasestatusid} value={status.leasestatusid.toString()}>
                          {status.vchstatusname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number.parseInt(value))
                      setCurrentPage(1)
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
            <AdminLeasesTable
              leases={getPaginatedLeases()}
              isLoading={isLoading}
              onView={handleViewLease}
              onEdit={handleEditLease}
              onDelete={handleDeleteLease}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <AdminLeasesTable
              leases={getPaginatedLeases()}
              isLoading={isLoading}
              onView={handleViewLease}
              onEdit={handleEditLease}
              onDelete={handleDeleteLease}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <AdminLeasesTable
              leases={getPaginatedLeases()}
              isLoading={isLoading}
              onView={handleViewLease}
              onEdit={handleEditLease}
              onDelete={handleDeleteLease}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <AdminLeasesTable
              leases={getPaginatedLeases()}
              isLoading={isLoading}
              onView={handleViewLease}
              onEdit={handleEditLease}
              onDelete={handleDeleteLease}
              user={userProfileData}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-0">
            <AdminLeasesTable
              leases={getPaginatedLeases()}
              isLoading={isLoading}
              onView={handleViewLease}
              onEdit={handleEditLease}
              onDelete={handleDeleteLease}
              user={userProfileData}
            />
          </TabsContent>
        </Tabs>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredLeases.length)} de {filteredLeases.length} arrendamientos
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
      </div>

      {/* Diálogo de edición */}
      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogContent
          className="w-screen sm:w-full max-w-lg bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm"
          aria-describedby="dialog-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Arrendamiento
            </DialogTitle>
            <DialogDescription>
              Modifica los detalles del arrendamiento. Guarda los cambios cuando termines.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            {editLease && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveChanges()
                }}
                className="space-y-4 pl-2 pr-3"
              >
                <div>
                  <Label htmlFor="lease_number" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de Contrato
                  </Label>
                  <Input
                    id="lease_number"
                    value={editLease.lease_number}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="propertyid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Propiedad
                  </Label>
                  <Input
                    id="propertyid"
                    value={editLease.vchtitle || `ID: ${editLease.propertyid}`}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="studentid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estudiante
                  </Label>
                  <Input
                    id="studentid"
                    value={editLease.vchstudentname || `ID: ${editLease.studentid}`}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado del arrendamiento
                  </Label>
                  <Select
                    value={editLease.leasestatusid.toString()}
                    onValueChange={(value) => setEditLease({ ...editLease, leasestatusid: Number.parseInt(value) })}
                    disabled={userProfileData?.roleid === 1}
                  >
                    <SelectTrigger id="status" className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {leasesStatus.map((status) => (
                        <SelectItem key={status.leasestatusid} value={status.leasestatusid.toString()}>
                          {status.vchstatusname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="decmonthlycost" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Costo Mensual
                  </Label>
                  <Input
                    id="decmonthlycost"
                    type="number"
                    value={editLease.decmonthlycost}
                    onChange={(e) => setEditLease({ ...editLease, decmonthlycost: Number(e.target.value) })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    disabled={userProfileData?.roleid === 1}
                  />
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
                      value={format(new Date(editLease.dtstartdate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setEditLease({ ...editLease, dtstartdate: new Date(e.target.value).toISOString() })
                      }
                      disabled={userProfileData?.roleid === 1}
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
                      value={format(new Date(editLease.dtenddate), "yyyy-MM-dd")}
                      onChange={(e) =>
                        setEditLease({ ...editLease, dtenddate: new Date(e.target.value).toISOString() })
                      }
                      disabled={userProfileData?.roleid === 1}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoadingState}>
                    {isLoadingState ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
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
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader id="dialog-description">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles del Arrendamiento
            </DialogTitle>
            <DialogDescription>Visualiza los detalles del arrendamiento seleccionado.</DialogDescription>
          </DialogHeader>
          {viewLease && (
            <ScrollArea className="h-[500px]">
              <div className="space-y-6 pl-2 pr-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Contrato</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{`S-${viewLease.leasesid.toString().padStart(6, "0")}`}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h3>
                    <Badge className={LEASE_STATUS[viewLease.leasestatusid as keyof typeof LEASE_STATUS].color}>
                      {LEASE_STATUS[viewLease.leasestatusid as keyof typeof LEASE_STATUS].name}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Propiedad</h3>
                  <div className="mt-1 flex items-center">
                    <Home className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {viewLease.vchtitle || `ID: ${viewLease.propertyid}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estudiante</h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {viewLease.vchstudentname || `ID: ${viewLease.studentid}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de inicio</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewLease.dtstartdate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de fin</h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(viewLease.dtenddate)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Costo Mensual</h3>
                  <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                    {formatCurrency(viewLease.decmonthlycost)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de creación</h3>
                  <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(viewLease.created_at)}
                  </p>
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
                      handleEditLease(viewLease)
                    }}
                    disabled={userProfileData?.roleid === 1}
                  >
                    <Edit className="h-4 w-4 mr-2" />
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

// Componente de tabla de arrendamientos
interface AdminLeasesTableProps {
  leases: any[]
  isLoading: boolean
  onView: (lease: any) => void
  onEdit: (lease: any) => void
  onDelete: (id: number) => void
  user: any
}

function AdminLeasesTable({ leases, isLoading, onView, onEdit, onDelete, user }: AdminLeasesTableProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <ScrollArea className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold">Nº Contrato</TableHead>
                <TableHead className="font-semibold">Propiedad</TableHead>
                <TableHead className="font-semibold">Estudiante</TableHead>
                <TableHead className="font-semibold">Periodo</TableHead>
                <TableHead className="font-semibold">Costo Mensual</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/60">
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0">
                      <Spinner className="mr-2" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando arrendamientos...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : leases.length === 0 ? (
                <TableRow className="bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/60">
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[20vh] lg:py-0">
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron arrendamientos con los filtros seleccionados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leases.map((lease) => {
                  const StatusIcon = LEASE_STATUS[lease.leasestatusid as keyof typeof LEASE_STATUS]?.icon || Clock

                  return (
                    <TableRow
                      key={lease.leasesid}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <TableCell className="font-medium">
                        {`S-${lease.leasesid.toString().padStart(6, "0")}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 " />
                          <CopyText text={lease.vchtitle || `ID: ${lease.propertyid}`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span>{lease.vchstudentname || `ID: ${lease.studentid}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          {format(new Date(lease.dtstartdate), "dd MMM yyyy", { locale: es })} -
                          {format(new Date(lease.dtenddate), "dd MMM yyyy", { locale: es })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
                          lease.decmonthlycost,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            LEASE_STATUS[lease.leasestatusid as keyof typeof LEASE_STATUS]?.color ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {LEASE_STATUS[lease.leasestatusid as keyof typeof LEASE_STATUS]?.name || "Desconocido"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 border hover:border-gray-300 dark:hover:border-gray-800 shadow-sm"
                              aria-label="Opciones de arrendamiento"
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
                              onSelect={() => onView(lease)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                              onSelect={() => onEdit(lease)}
                              disabled={user?.roleid === 1}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            >
                              <Link href={`/property/${lease.propertyid}`} className="flex items-center">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                <span className="text-sm">Ver propiedad</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger className="w-full" disabled={user?.roleid === 1}>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-300 dark:hover:bg-red-800 hover:text-red-800 dark:hover:text-red-300 w-full"
                                  disabled={user?.roleid === 1}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro de eliminar este arrendamiento?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El arrendamiento será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (lease.leasesid) {
                                        onDelete(lease.leasesid)
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
