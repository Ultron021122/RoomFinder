import {Metadata} from 'next';
import ListItems from '@/components/List'

export const metadata: Metadata = {
    title: 'Arrendadores',
};

export default function Arrendadores() {
    return (
        <div className="container mx-auto px-4 min-h-[calc(100vh-73px)]">
            <h1 className="dark:text-white text-3xl font-bold my-10 text-center">
                Arrendadores
            </h1>
            <ListItems />
        </div>
    );
}