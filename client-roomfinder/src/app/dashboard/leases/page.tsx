import ArrendamientosPage from '@/components/dashboard-comp/leases';
import { BreadcrumbWithCustomSeparator } from '@/components/GeneralComponents/Breadcrumbs';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Arrendamientos',
};

export default function DashboardHome() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Arrendamientos" />
            <div className="mx-auto">
                <ArrendamientosPage />
            </div>
        </div>
    );
}