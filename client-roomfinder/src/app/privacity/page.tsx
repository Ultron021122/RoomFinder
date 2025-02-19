import Layout from "@/components/layout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacidad',
};

function Privacity() {
    return (
        <Layout>
            <section className="pt-20 max-w-7xl">
                <h1 className="text-neutral-950 dark:text-gray-200">Privacity</h1>
            </section>
        </Layout>
    )
}

export default Privacity;