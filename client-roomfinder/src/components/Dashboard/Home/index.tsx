import Image from "next/image";
import { Globe, LayoutTemplate, Network, Settings, ShieldCheck, TrendingUp } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Header from "../Inmuebles/Header";
import { Bento } from "@/components/GeneralComponents/Bento";

export default function Home() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto dark:bg-gray-900">
            <aside className="mx-auto">
                <Breadcrumb pageName="Inicio" />
                <section>
                    <h2 className="text-neutral-950 mb-10 dark:text-white font-semibold text-2xl px-2">
                        Panel de Control de Administrador
                    </h2>
                    <Bento />
                </section>
            </aside>
        </div>
    );
}