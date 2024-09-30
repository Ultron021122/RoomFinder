'use client';

import Header from '@/components/GeneralComponents/Header';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

export default function Publish() {
    return (
        <div>
            <Breadcrumb pageName='Publicar inmueble' />
            <Form />
        </div>
    );
}