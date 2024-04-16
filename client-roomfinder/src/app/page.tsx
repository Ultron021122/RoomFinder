import Layout from "@/components/layout";
import Footer from '@/components/Footer';

export default function Home() {
  const image = 'https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  return (
    <>
      <Layout key={1}>
        <div className="h-[calc(100vh-105px)] w-full">
          <main className="container mx-auto">
            <div className="mb-5">
              <h1 className="text-white text-2xl font-bold mt-10">Proyecto Modular</h1>
              <p className="dark:text-white">
                Este proyecto fue creado con el objetivo de mostrar la modularización de una aplicación
              </p>
              <div className="h-[500px] min-h-[500px] min-w-[300px] max-w-[500px] sm:h-[100px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${image})` }}></div>
            </div>
          </main>
          <Footer />
        </div >
      </Layout >
    </>
  );
}
