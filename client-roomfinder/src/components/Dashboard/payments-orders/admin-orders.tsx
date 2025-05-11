"use client"
import { useEffect, useMemo, useState } from "react"
import React from "react"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    CalendarIcon,
    Check,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Download,
    FileText,
    MoreHorizontal,
    RefreshCcw,
    X,
} from "lucide-react"
import { toast, Bounce, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useOrderContext } from "@/contexts/orders-context"
import type { vwOrders } from "@/utils/interfaces"
import type { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"

export default function AdminOrdersPage() {
    const { orders, refetchOrders } = useOrderContext()
    const [filteredOrders, setFilteredOrders] = useState<vwOrders[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [currentPage, setCurrentPage] = useState(1)
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
    const itemsPerPage = 10

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

    const router = useRouter()

    useEffect(() => {
        const results = filterOrders()
        setFilteredOrders(results)
    }, [orders, searchTerm, statusFilter, dateRange])

    const filterOrders = () => {
        return orders.filter((order) => {
            const matchesSearch =
                order.vchconcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.vchstudentname.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter !== null ? order.status === statusFilter : true

            const matchesDate =
                dateRange?.from && dateRange?.to
                    ? new Date(order.created_at) >= dateRange.from && new Date(order.created_at) <= dateRange.to
                    : true

            return matchesSearch && matchesStatus && matchesDate
        })
    }

    const stats = useMemo(() => {
        const total = filteredOrders.reduce((acc, o) => acc + Number.parseFloat(o.amount.toString()), 0)
        const count = filteredOrders.length
        return {
            totalIncome: total,
            totalOrders: count,
        }
    }, [filteredOrders])

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage)
    }, [currentPage, filteredOrders])

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

    const toggleRowExpansion = (orderId: number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }))
    }

    const marcarComoPagado = async (orderId: number) => {
        try {
            await axios.patch(
                `/api/orders-payments/${orderId}`,
                { status: "completed" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                    },
                },
            )
            toast.success("Orden marcada como completada", {
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
            refetchOrders()
        } catch (error) {
            toast.error("No se pudo actualizar la orden.", {
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

    const cancelarOrden = async (orderId: number) => {
        try {
            await axios.patch(
                `/api/orders-payments/${orderId}`,
                { status: "cancelled" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-secret-key": `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`,
                    },
                },
            )
            toast.success("Orden cancelada", {
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
            refetchOrders()
        } catch (error) {
            toast.error("No se pudo cancelar la orden.", {
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

    const pagar = async (order: vwOrders) => {
        try {
            const stripe = await stripePromise

            const response = await axios.post("/api/stripe/checkout-session", {
                property: {
                    propertyid: order.propertyid,
                    vchtitle: order.vchconcept,
                    decrentalcost: order.amount,
                    objphotos: [{ url: order.objphotos[0]?.url || "" }], // Verificamos que exista
                },
                userId: order.studentid,
                leaseRequest: {
                    dtstartdate: order.dtstartdate,
                    dtenddate: order.dtenddate,
                },
                amount: order.amount,
            })

            const session = response.data

            if (stripe && session.id) {
                await stripe.redirectToCheckout({ sessionId: session.id })
            } else {
                toast.error("No se pudo redirigir al pago.")
            }
        } catch (error) {
            toast.error("Error al intentar procesar el pago.")
            console.error(error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h2 className="text-lg font-semibold">Órdenes de pago</h2>
                    <p className="text-sm text-muted-foreground">Resumen de ingresos y pagos generados.</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                        onClick={() => router.refresh()}
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Actualizar
                    </Button>
                </div>
            </div>

            <Card className="bg-white dark:bg-transparent shadow-md border border-stroke dark:border-gray-500 rounded-sm">
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Input
                            placeholder="Buscar por número o estudiante"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="col-span-2 dark:border-gray-500 dark:bg-gtransparent dark:text-white"
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "dd MMM yyyy", { locale: es })} -{" "}
                                                {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                                            </>
                                        ) : (
                                            format(dateRange.from, "dd MMM yyyy", { locale: es })
                                        )
                                    ) : (
                                        <span>Rango de fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <Alert className="border-green-500 bg-green-200 dark:bg-green-900/20">
                            <Check className="h-4 w-4" />
                            <AlertTitle>Total ingresos</AlertTitle>
                            <AlertDescription>
                                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    ${stats.totalIncome.toFixed(2)}
                                </h3>
                            </AlertDescription>
                        </Alert>
                        <Alert className="border-blue-500 bg-blue-200 dark:bg-blue-900/20">
                            <FileText className="h-4 w-4" />
                            <AlertTitle>Total órdenes</AlertTitle>
                            <AlertDescription>
                                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalOrders}</h3>
                            </AlertDescription>
                        </Alert>
                    </div>

                    <ScrollArea className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Estudiante</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Pago</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((order) => (
                                    <React.Fragment key={order.orderid}>
                                        <TableRow className="group">
                                            <TableCell>{order.orderid}</TableCell>
                                            <TableCell>
                                                {order.vchstudentname +
                                                    " " +
                                                    order.vchstudentpaternalsurname +
                                                    " " +
                                                    order.vchstudentmaternalsurname}
                                            </TableCell>
                                            <TableCell>${Number.parseFloat(order.amount.toString()).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {order.status === "completed"
                                                        ? "Completado"
                                                        : order.status === "cancelled"
                                                            ? "Cancelado"
                                                            : "Pendiente"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => pagar(order)}
                                                    disabled={order.status === "completed" || order.status === "cancelled"}
                                                >
                                                    <DollarSign className="mr-2 h-4 w-4" /> Pagar
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Download className="mr-2 h-4 w-4" /> Ver comprobante
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => marcarComoPagado(order.orderid)}
                                                                disabled={order.status === "completed" || order.status === "cancelled"}
                                                            >
                                                                <Check className="mr-2 h-4 w-4" /> Marcar como pagado
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => cancelarOrden(order.orderid)}
                                                                disabled={order.status === "completed" || order.status === "cancelled"}
                                                            >
                                                                <X className="mr-2 h-4 w-4" /> Cancelar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 flex items-center gap-1 text-xs"
                                                        onClick={() => toggleRowExpansion(order.orderid)}
                                                    >
                                                        {expandedRows[order.orderid] ? (
                                                            <>
                                                                <ChevronUp className="h-4 w-4" /> Ocultar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="h-4 w-4" /> Detalles
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedRows[order.orderid] && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="p-0 border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                                        <Image
                                                            src={order.objphotos[0]?.url || ""}
                                                            alt={order.vchconcept}
                                                            width={300}
                                                            height={300}
                                                            className="rounded-md w-full h-auto object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="space-y-1 text-sm p-4 rounded-md m-2">
                                                            <p>
                                                                <strong>Inicio:</strong>{" "}
                                                                {format(new Date(order.dtstartdate), "dd MMM yyyy", { locale: es })}
                                                            </p>
                                                            <p>
                                                                <strong>Fin:</strong> {format(new Date(order.dtenddate), "dd MMM yyyy", { locale: es })}
                                                            </p>
                                                            <p>
                                                                <strong>Propiedad:</strong> {order.vchconcept}
                                                            </p>
                                                            <p>
                                                                <strong>Creado:</strong>{" "}
                                                                {format(new Date(order.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                                {currentItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No se encontraron órdenes con los filtros seleccionados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages || 1}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
