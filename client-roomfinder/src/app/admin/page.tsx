import UploadImage from '@/components/Files'
import {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Administrador',
};

export default function Admin() {
    return (
        <>
            <UploadImage />
        </>
    );
}