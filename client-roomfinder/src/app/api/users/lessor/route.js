import { NextResponse } from 'next/server';
import { deleteImage, uploadImage } from '../../cloudinary';
import axios from 'axios';

export async function GET( request) {

    const secretKey = request.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${process.env.REST_URL}/lessors/`, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });
        return NextResponse.json(
            { data: response.data },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 503 }
        );
    }
}

export async function POST(req, res) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { vchname, vchpaternalsurname, vchmaternalsurname, vchemail, vchpassword, confirm_password, bnstatus, dtbirthdate, vchimage, roleid, vchphone, vchstreet, intzip, vchsuburb, vchmunicipality, vchstate, vchbiography } = await req.json();
    let imageUrl;
    try {
        imageUrl = await uploadImage(
            vchimage,
            'lessors',
            {
                transformation: [
                    { width: 600, height: 600, crop: "fill" },
                    { quality: "auto" },
                    { format: "webp" }
                ]
            }
        );
    } catch (error) {
        return NextResponse.json(
            { messages: "Error al subir la imagen" },
            { status: 500 }
        );
    }

    try {
        const response = await axios.post(`${process.env.REST_URL}/lessors/`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            vchemail,
            vchpassword,
            dtbirthdate,
            bnstatus,
            bnverified: false,
            vchimage: imageUrl.secure_url,
            roleid,
            vchphone,
            vchstreet,
            intzip: parseInt(intzip),
            vchsuburb,
            vchmunicipality,
            vchstate,
            vchbiography
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        });

        const statusMessageMap = {
            201: { message: 'Arrendador creado correctamente', data: response.data },
            409: { message: 'El correo ya está registrado' },
            400: { message: response.data.message },
            default: { message: 'Error al crear el estudiante' },
        };

        const message = statusMessageMap[response.status] || statusMessageMap.default;
        return NextResponse.json(
            { message },
            { status: response.status }
        );

    } catch (error) {
        if (imageUrl && imageUrl.public_id) {
            await deleteImage(imageUrl.public_id);
        }
        return NextResponse.json(
            { message: error.message },
            { status: 503 }
        );
    }
}

export async function PATCH(req) {
    const secretKey = req.headers.get('x-secret-key');
    if (!secretKey || secretKey !== process.env.INTERNAL_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
        vchname,
        vchpaternalsurname,
        vchmaternalsurname,
        vchemail,
        vchpassword,
        dtbirthdate,
        bnstatus,
        bnverified,
        vchimage,
        vchcoverimage,
        roleid,
        vchbiography,
        vchphone,
        vchstreet,
        intzip,
        vchsuburb,
        vchmunicipality,
        vchstate,
        usuarioid
    } = await req.json();

    try {
        const response = await axios.patch(`${process.env.REST_URL}/lessors/${usuarioid}`, {
            vchname,
            vchpaternalsurname,
            vchmaternalsurname,
            vchemail,
            vchpassword,
            dtbirthdate,
            bnstatus,
            bnverified,
            vchimage,
            vchcoverimage,
            roleid,
            vchbiography,
            vchphone,
            vchstreet,
            intzip,
            vchsuburb,
            vchmunicipality,
            vchstate
        }, {
            headers: {
                Authorization: `Bearer ${process.env.REST_SECRET}`
            }
        })

        const message = "Usuario actualizado correctamente";

        return NextResponse.json(
            { message },
            { status: response.status }
        );

    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 503 }
        );
    }
}