import { Metadata } from 'next';
import ListItems from '@/components/List'
import Layout from '@/components/layout'; 
export const metadata: Metadata = {
    title: 'Arrendadores',
};

export default function Arrendadores() {
    return (
        <Layout>
            <ListItems />
        </Layout>
    );
}