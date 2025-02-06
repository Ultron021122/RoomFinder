import Layout from "@/components/layout";
import BackButton from "@/components/Propiedades/backButton";

const Cancel: React.FC = () => {
    return (
        <Layout>
            <div className='h-[100vh] container mx-auto'>
                <BackButton className="pt-20" />
                <div className="text-center mt-16">
                    <h1 className="text-2xl font-bold">Pago cancelado.</h1>
                    <p className="mt-4">Tu pago ha sido cancelado. Porfavor intenta de nuevo.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Cancel;