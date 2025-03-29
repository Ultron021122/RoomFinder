'use client'
/*
    1. consultar la base de datos para traer las solicitudes de renta realizadas
    2. Mostrar las solicitudes realizadas por el usuario
    3. mostrar el estatus de la solicitud, si esta ya aparece como aceptada, mostrar un botón que permita continuar con el pago

*/

import {useEffect, useState, useMemo, useCallback} from "react"
import Link from "next/link"
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LeaseRequest, UserProfile } from "@/utils/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CopyText from '@/components/ui/copy-text';
import { format } from 'date-fns';

const Rentals = () => {

    const {data, status} = useSession()
    const [loading, setLoading] = useState(false) // los datos que se van a consumir de la API
    const [leasingRequests, setLeasingRequests] = useState<LeaseRequest[]>([])
    const [paginaActual, setPaginaActual] = useState<number>(1);

    const REQUEST_PER_PAGE = 5

    const getRequestPaginated = useCallback(() => {
        const indiceInicio = (paginaActual - 1) * REQUEST_PER_PAGE
        const indiceFin = indiceInicio + REQUEST_PER_PAGE;
        return leasingRequests.slice(indiceInicio, indiceFin);
    }, [paginaActual, leasingRequests]);

    const fetchLeasingRequests =  async(studenId: number) => {
        try {
            setLoading(true)
            const {data: {data}} = await axios.get(`/api/requests/user/${studenId}`, {
                headers: {
                    'x-secret-key': `${process.env.NEXT_PUBLIC_INTERNAL_SECRET_KEY}`
                }
            })
            
            console.log("Datos recibidos de la api: ", data)
            // almacenarlos localmente para posteriormente mostrarlos
            setLeasingRequests(data)
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
                                getRequestPaginated().map(request => (
                                    <TableRow key={request.requestid}>
                                        <TableCell>
                                            <Link href={`/dashboard/propertyDetails/${request.propertyid}`}>Nombre de propiedad</Link>
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
                                            {/* Si la solicitud ha sido aceptada: proceder al pago, pago no disponible */}
                                            
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {leasingRequests?.length > 0 && <p>ya hay elementos en el arreglo</p>}
        </>
    )
}

export default Rentals;