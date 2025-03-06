"use client";

import Inmuebles from "@/components/Dashboard/Inmuebles";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CardOwner from "@/components/Main/Card";

export default function DashboardHome() {
    const { data: session, status, update } = useSession();
    const [propertyData, setPropertyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                await update(); // Forzar actualización de la sesión
            } catch (error) {
                console.error("❌ Error al actualizar la sesión:", error);
            }
        };

        if (status === "authenticated" && !session?.user?.recomendacion) {
            fetchSession();
        }
    }, [status, session, update]);

    useEffect(() => {
        const fetchPropertyDetails = async (propertyId: number) => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
                if (!res.ok) throw new Error("Error al obtener detalles de la propiedad");
                const data = await res.json();
                setPropertyData(data);
            } catch (error) {
                console.error("❌ Error al obtener detalles de la propiedad:", error);
                setPropertyData(null);
            } finally {
                setLoading(false);
            }
        };

        const propertyId = session?.user?.recomendacion?.recommended_property_id;
        if (status === "authenticated" && propertyId) {
            console.log("🏡 Recomendación recibida:", propertyId);
            fetchPropertyDetails(propertyId);
        }
    }, [session, status]);

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Inmuebles" />
            <div className="mx-auto">
                <Inmuebles />
            </div>

            <div className="mt-6">
                <h1 className="text-2xl font-semibold mb-4">🏡 Recomendación</h1>
                {loading ? (
                    <p>Cargando recomendación...</p>
                ) : propertyData?.data ? (
                    <div className="flex flex-col items-center">
                        {/* Se pasa la data correcta al componente */}
                        <CardOwner {...propertyData.data} />
                    </div>
                ) : (
                    <p>No hay recomendación disponible.</p>
                )}
            </div>
        </div>
    );
}
