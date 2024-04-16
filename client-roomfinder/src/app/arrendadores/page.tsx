import { Metadata } from 'next';
import ListItems from '@/components/List'

export const metadata: Metadata = {
    title: 'Arrendadores',
};

export default function Arrendadores() {
    return (
        <>
            <ListItems />
        </>
    );
}