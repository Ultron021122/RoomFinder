import { Metadata } from 'next';
import Map from './map';

export const metadata: Metadata = {
    title: "Propiedades",
};

export default function Propiedades() {

    return (
        <div className='h-[100vh]'>
            <Map />
        </div>
    );
}