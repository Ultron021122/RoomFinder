'use client';

import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

export default function Publish() {
    return (
        <div>
            <Breadcrumb pageName='Publicar' />
            <Form />
        </div>
    );
}