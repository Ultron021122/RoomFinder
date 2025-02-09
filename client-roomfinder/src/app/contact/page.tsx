import Layout from "@/components/layout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto',
};

function Contact() {
    return (
        <Layout>
            <section className="pt-20 max-w-7xl">
                <h1 className="text-neutral-950 dark:text-gray-200">Contacto</h1>
            </section>
        </Layout>
    )
}

export default Contact;