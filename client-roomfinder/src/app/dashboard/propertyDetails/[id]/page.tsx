import Layout from "@/components/layout";
import PropertyComponent from "@/components/Propiedades";
import BackButton from "@/components/Propiedades/backButton";

export default function Property({ params }: { params: { id: string } }) {
    return (
        <Layout>
            <div className='h-[100vh] container mx-auto'>
                <BackButton className="pt-20" />
                <PropertyComponent id={params.id} />
            </div>
        </Layout>
    );
}