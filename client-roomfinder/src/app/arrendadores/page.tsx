import { Metadata } from 'next';
import ListItems from '@/components/List'
import Layout from '@/components/layout'; 
export const metadata: Metadata = {
    title: 'Propietarios',
};

export default function Propietarios() {
    return (
        <Layout>
            <ListItems />
        </Layout>
    );
}