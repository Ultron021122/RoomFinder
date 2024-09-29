'use client';

import Header from '@/components/GeneralComponents/Header';
import Form from '@/components/Form';

export default function Publish(){
    return (
        <div className="h-screen">
            <Header imageURL='/background/fondo-7.jpg' content="Publicar inmueble"/>
            <Form/>
        </div>
    );
}