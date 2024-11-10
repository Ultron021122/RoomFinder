import Inmuebles from '@/components/Dashboard/Inmuebles';
import { BreadcrumbWithCustomSeparator } from '@/components/GeneralComponents/Breadcrumbs';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Inmuebless',
};

export default function DashboardHome() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Inmuebles" />
            <div className="mx-auto">
                <Inmuebles />
            </div>
        </div>
    );
}