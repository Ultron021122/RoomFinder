'use client'

import {useEffect, useState, useCallback} from "react"
import Link from "next/link"
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LeaseRequest, Property, UserProfile } from "@/utils/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CopyText from '@/components/ui/copy-text';
import { format } from 'date-fns';
import { Button as ButtonUI , Link as LinkUI} from "@nextui-org/react";
import { Button } from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from "lucide-react"

const Rentals = () => {

    const {data, status} = useSession()
    const [loading, setLoading] = useState(false)
    const [leasingRequests, setLeasingRequests] = useState<LeaseRequest[]>([])
    const [properties, setProperties] = useState<Property[]>([])
    const [paginaActual, setPaginaActual] = useState<number>(1);

    const REQUEST_PER_PAGE = 5
    const totalPaginas = Math.ceil(leasingRequests.length / REQUEST_PER_PAGE);

    const getRequestPaginated = useCallback(() => {
        const indiceInicio = (paginaActual - 1) * REQUEST_PER_PAGE
        const indiceFin = indiceInicio + REQUEST_PER_PAGE;
        return leasingRequests.slice(indiceInicio, indiceFin);
    }, [paginaActual, leasingRequests]);

    const fetchPropertyData = async(propertyId : number) => {
        try {
            const {data:{data}} = await axios.get(`/api/properties/${propertyId}`,{
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const fetchLeasingRequests =  async(studenId: number) => { // solicitudes de arrendamiento
        try {
            setLoading(true)
            const {data: {data}} = await axios.get(`/api/requests/user/${studenId}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            
            const dataAsArray = [...data]; // por si la respuesta no es un arreglo
            const propertiesData = await Promise.all(dataAsArray.map(leaseRequest => fetchPropertyData(leaseRequest.propertyid)))

            setLeasingRequests(data)
            setProperties(propertiesData)

        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(status === 'authenticated'){
            const userData = data.user as UserProfile
            fetchLeasingRequests(userData.usuarioid);
        }
    }, [status])
    //export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
    return(
        <>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Mis solicitudes de arrendamiento</CardTitle>
                    <p className="text-slate-400 mt-4">Si la solicitud que realizaste ya no aparece, el arrendador eliminó tu solicitud</p>
                </CardHeader>
                <CardContent>
                    <Table className='w-full max-w-7xl'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Propiedad</TableHead>
                                <TableHead>Fecha de solicitud</TableHead>
                                <TableHead>Mensaje</TableHead>
                                <TableHead>Estatus</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { loading ?
                                <TableRow className='bg-transparent hover:bg-slate-100'>
                                    <TableCell colSpan={5}>
                                        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-[40vh] lg:py-0'>
                                            <Spinner />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                :
                                getRequestPaginated().map((request, index) => (
                                    <TableRow key={request.requestid}>
                                        <TableCell>
                                            <Link href={`/dashboard/propertyDetails/${request.propertyid}`}>{properties[index].vchtitle}</Link>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(request.dtrequest), 'yyyy-MM-dd HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            <CopyText text={request.vchmessage}/>
                                        </TableCell>
                                        <TableCell>
                                        <Badge variant={
                                            request.statusid === 1 ? 'success' :
                                            request.statusid === 2 ? 'outline' :
                                            request.statusid === 3 ? 'default' :
                                            request.statusid === 4 ? 'destructive' : 'destructive'
                                            }
                                        >
                                            {
                                            request.statusid === 1 ? 'Aceptada' :
                                            request.statusid === 2 ? 'Pendiente' :
                                            request.statusid === 3 ? 'En revisión' :
                                            request.statusid === 4 ? 'Rechazada' : 'Error'
                                            }
                                        </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {/* Si la solicitud ha sido aceptada: proceder al pago
                                                Si la solicitud ha sido eliminada: por lo tanto no se muestra
                                            */}
                                            {request.statusid === 1 ? (
                                                <ButtonUI as={LinkUI} href="" size="sm" color="primary" variant="solid" className="font-normal">
                                                    Proceder al pago
                                                </ButtonUI>
                                            ) : (
                                                <p className="text-red-500">Pago no disponible por el momento</p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {((paginaActual - 1) * REQUEST_PER_PAGE) + 1} - {Math.min(paginaActual * REQUEST_PER_PAGE, leasingRequests.length)} de {leasingRequests.length} solicitudes
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                                <Button
                                    key={pagina}
                                    variant={pagina === paginaActual ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPaginaActual(pagina)}
                                >
                                    {pagina}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Rentals;