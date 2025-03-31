import { NextResponse } from 'next/server';
import axios from 'axios';


export async function POST(req) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const input = await req.json();
    let colonia

    if (!input.ubicacion.colonia) {
        colonia = input.ubicacion.ciudad_municipio
    } else {
        colonia = input.ubicacion.colonia
    }

    try {
        const response = await axios.post(`${process.env.PREDIC_URL}/predict_price/`, {
            "propertytypeid": input.tipoInmueble,
            "intnumberrooms": input.numRecamaras,
            "intnumberbathrooms": input.numBanos,
            "intmaxoccupancy": input.numHuespedes,
            "bnstudyzone": input.bnStudyZone,
            "intmincontractduration": input.intmincontractduration,
            "bnwaterincluded": input.servicios.bnWaterIncluded,
            "bnelectricityincluded": input.servicios.bnElectricityIncluded,
            "bninternetincluded": input.servicios.bnInternetIncluded,
            "bngasincluded": input.servicios.bnGasIncluded,
            "bnheatingincluded": input.servicios.bnHeatingIncluded,
            "bnairconditioningincluded": input.servicios.bnAirConditioningIncluded,
            "bnlaundryincluded": input.servicios.bnLaundryIncluded,
            "bnparkingincluded": input.servicios.bnParkingIncluded,
            "bncleaningincluded": input.servicios.bnCleaningIncluded,
            "bncabletvincluded": input.servicios.bnCableTVIncluded,
            "bnwashingmachineincluded": input.servicios.bnWashingMachineIncluded,
            "bnkitchen": input.servicios.bnKitchen,
            "bnlivingroom": input.servicios.bnLivingRoom,
            "bndiningroom": input.servicios.bnDiningRoom,
            "bncoolerincluded": input.servicios.bnCoolerIncluded,
            "bngardenincluded": input.servicios.bnGardenIncluded,
            "intaccountparking": input.capEstacionamiento,
            "bnfurnished": input.bnfurnished,
            "decarea": input.additionalFeatures.decarea,
            "fldistanceuniversity": input.additionalFeatures.fldistanceuniversity,
            "vchmunicipality": input.ubicacion.ciudad_municipio,
            "vchneighborhood": colonia,
            "vchuniversity": input.additionalFeatures.vchuniversity
        },
            {
                headers: {
                    Authorization: `Bearer ${process.env.REST_SECRET}`
                }
            });


        return NextResponse.json(
            { data: response.data },
            { status: response.status }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: error.response.status }
        );
    }
}