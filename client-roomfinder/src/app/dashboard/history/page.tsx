import HistorialProperties from "@/components/Dashboard/historial";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Historial',
};

export default function History() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Historial" />
            <div className="mx-auto">
                <HistorialProperties />
            </div>
        </div>
    );
}
