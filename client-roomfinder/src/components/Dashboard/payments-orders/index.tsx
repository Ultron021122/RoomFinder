"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Download,
    Eye,
    FileText,
    MoreHorizontal,
    RefreshCw,
    Search,
    X,
} from "lucide-react"
import { Spinner } from "@nextui-org/react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useRouter } from "next/navigation"

// Tipos
interface PaymentOrder {
    id: string
    reference: string
    date: string
    amount: number
    status: "pending" | "completed" | "cancelled"
    paymentMethod: string
    propertyName: string
    studentName: string
    receiptUrl?: string
}



export default function PaymentOrders() {
    const [isLoading, setIsLoading] = useState(true)
    const [orders, setOrders] = useState<PaymentOrder[]>([])
    const [filteredOrders, setFilteredOrders] = useState<PaymentOrder[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const router = useRouter()
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    // Simular carga de datos
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                // Aquí normalmente harías una llamada a tu API
                // Simulamos datos de ejemplo
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const mockOrders: PaymentOrder[] = Array.from({ length: 50 }, (_, i) => ({
                    id: `ORD-${(1000 + i).toString()}`,
                    reference: `REF-${Math.floor(Math.random() * 10000)}`,
                    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                    amount: (Math.floor(Math.random() * 10000) / 100) * 100,
                    status: ["pending", "completed", "cancelled"][
                        Math.floor(Math.random() * 3)
                    ] as PaymentOrder["status"],
                    paymentMethod: ["Tarjeta de crédito", "Transferencia", "PayPal", "Efectivo"][Math.floor(Math.random() * 4)],
                    propertyName: `Propiedad ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
                    studentName: `Estudiante ${Math.floor(Math.random() * 100)}`,
                    receiptUrl: Math.random() > 0.3 ? "/receipt.pdf" : undefined,
                }))

                setOrders(mockOrders)
                setFilteredOrders(mockOrders)
            } catch (error) {
                console.error("Error fetching payment orders:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [])

    // Filtrar órdenes
    useEffect(() => {
        let result = orders

        // Filtrar por término de búsqueda
        if (searchTerm) {
            result = result.filter(
                (order) =>
                    order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Filtrar por estado
        if (statusFilter !== "all") {
            result = result.filter((order) => order.status === statusFilter)
        }

        // Filtrar por rango de fechas
        if (dateRange?.from) {
            const fromDate = new Date(dateRange.from)
            fromDate.setHours(0, 0, 0, 0)

            let toDate
            if (dateRange.to) {
                toDate = new Date(dateRange.to)
                toDate.setHours(23, 59, 59, 999)
            } else {
                toDate = new Date(fromDate)
                toDate.setHours(23, 59, 59, 999)
            }

            result = result.filter((order) => {
                const orderDate = new Date(order.date)
                return orderDate >= fromDate && orderDate <= toDate
            })
        }

        setFilteredOrders(result)
        setCurrentPage(1) // Resetear a la primera página cuando cambian los filtros
    }, [searchTerm, statusFilter, dateRange, orders])

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    // Obtener badge según estado
    const getStatusBadge = (status: PaymentOrder["status"]) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Pendiente
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Completado
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        Cancelado
                    </Badge>
                )
            // case "refunded":
            //     return (
            //         <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            //             Reembolsado
            //         </Badge>
            //     )
            default:
                return null
        }
    }

    // Calcular estadísticas
    const stats = {
        total: orders.length,
        completed: orders.filter((o) => o.status === "completed").length,
        pending: orders.filter((o) => o.status === "pending").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
        // refunded: orders.filter((o) => o.status === "refunded").length,
        totalAmount: orders
            .filter((o) => o.status === "completed")
            .reduce((sum, order) => sum + order.amount, 0)
            .toFixed(2),
    }

    const handleDownload = () => {
        window.open('/api/pdf', '_blank')
    }

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <div className="mx-auto space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de órdenes</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</h3>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pagos completados</p>
                                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</h3>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pagos pendientes</p>
                                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</h3>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-900">
                                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total recaudado</p>
                                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.totalAmount}</h3>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros y tabla */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Órdenes de pago</CardTitle>
                                <CardDescription>Gestiona todas las órdenes de pago de propiedades</CardDescription>
                            </div>
                            <Button variant="outline" className="flex items-center gap-1" onClick={() => router.refresh()}>
                                <RefreshCw className="h-4 w-4" />
                                <span>Actualizar</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <TabsList className="mb-2 md:mb-0">
                                    <TabsTrigger value="all">Todos</TabsTrigger>
                                    <TabsTrigger value="pending">Pendientes</TabsTrigger>
                                    <TabsTrigger value="completed">Completados</TabsTrigger>
                                    <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                                    {/* <TabsTrigger value="refunded">Reembolsados</TabsTrigger> */}
                                </TabsList>

                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar por referencia, propiedad o estudiante..."
                                            className="pl-9 w-full md:w-[300px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <DatePickerWithRange className="w-full md:w-auto" selected={dateRange} onSelect={setDateRange} />
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Referencia</TableHead>
                                            <TableHead>Propiedad</TableHead>
                                            <TableHead>Estudiante</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Método</TableHead>
                                            <TableHead>Monto</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-24 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                        <span className="ml-2">Cargando órdenes...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : currentItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-24 text-center">
                                                    No se encontraron órdenes de pago con los filtros seleccionados.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            currentItems.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">{order.reference}</TableCell>
                                                    <TableCell>{order.propertyName}</TableCell>
                                                    <TableCell>{order.studentName}</TableCell>
                                                    <TableCell>{formatDate(order.date)}</TableCell>
                                                    <TableCell>{order.paymentMethod}</TableCell>
                                                    <TableCell className="font-semibold">${order.amount.toFixed(2)}</TableCell>
                                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    <span>Ver detalles</span>
                                                                </DropdownMenuItem>
                                                                {order.receiptUrl && (
                                                                    <DropdownMenuItem className="cursor-pointer" onClick={handleDownload}>
                                                                        <Download className="mr-2 h-4 w-4" />
                                                                        <span>Descargar comprobante</span>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {order.status === "pending" && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="cursor-pointer text-green-600 dark:text-green-400">
                                                                            <Check className="mr-2 h-4 w-4" />
                                                                            <span>Marcar como pagado</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                                                                            <X className="mr-2 h-4 w-4" />
                                                                            <span>Cancelar orden</span>
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginación */}
                            {!isLoading && filteredOrders.length > 0 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} de{" "}
                                        {filteredOrders.length} resultados
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="sr-only">Página anterior</span>
                                        </Button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Mostrar 5 páginas centradas en la página actual
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => paginate(pageNum)}
                                                    className={currentPage === pageNum ? "bg-blue-600 text-white" : ""}
                                                >
                                                    {pageNum}
                                                </Button>
                                            )
                                        })}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                            <span className="sr-only">Página siguiente</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
