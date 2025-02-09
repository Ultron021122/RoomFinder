import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
    const id = params.id;
    try {
        const response = await axios.get(`${process.env.REST_URL}/properties/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const statusMessageMap = {
            200: { message: 'Propiedad encontrada', data: response.data },
            404: { message: 'Propiedad no encontrada' },
            400: { message: response.data.message },
            default: { message: 'Error al buscar la propiedad' },
        };
        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const response = await axios.delete(`${process.env.REST_URL}/properties/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        const statusMessageMap = {
            200: { message: 'Propiedad eliminada', data: response.data },
            404: { message: 'Propiedad no encontrada' },
            400: { message: response.data.message },
            default: { message: 'Error al eliminar la propiedad' },
        };
        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message, data: response.data },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}

export async function PATCH(request, { params }) {
    const id = params.id;

    const {
        propertytypeid,
        intnumberrooms,
        intnumberbathrooms,
        intmaxoccupancy,
        bnfurnished,
        vchfurnituretype,
        decrentalcost,
        dtavailabilitydate,
        intmincontractduration,
        intmaxcontractduration,
        bnstudyzone,
        vchbuildingsecurity,
        vchtransportationaccess,
        vchdescription,
        vchtitle,
        bnavailability,
        intnumberbeds
    } = await request.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/properties/${id}`, {
            propertyid: parseInt(id),
            propertytypeid,
            intnumberrooms,
            intnumberbathrooms,
            intmaxoccupancy,
            bnfurnished,
            vchfurnituretype,
            decrentalcost: parseInt(decrentalcost),
            dtavailabilitydate,
            intmincontractduration,
            intmaxcontractduration,
            bnstudyzone,
            vchbuildingsecurity,
            vchtransportationaccess,
            vchdescription,
            vchtitle,
            bnavailability,
            intnumberbeds
        }
            , {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });

            const statusMessageMap = {
                200: { message: 'Exitoso', data: response.data },
                400: { message: response.data.message },
                404: { message: response.data.message },
                default: { message: 'Error al actualizar informacion' },
            };
    
            const message = statusMessageMap[response.status] || statusMessageMap.default;
            return NextResponse.json(
                { message },
                { status: response.status },
                { data: response.data}
            );

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : error.message;

        return NextResponse.json(
            { message: `Error updating student: ${message}` },
            { status }
        );
    }
}