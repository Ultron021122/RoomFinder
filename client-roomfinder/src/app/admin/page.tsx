import UploadImage from '@/components/Files'
import {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Admin',
};

export default function Admin() {
    return (
        <>
            <UploadImage />
        </>
    );
}