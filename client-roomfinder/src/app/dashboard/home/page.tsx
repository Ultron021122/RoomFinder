import Home from '@/components/Dashboard/Home';
import { BreadcrumbWithCustomSeparator } from '@/components/GeneralComponents/Breadcrumbs';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Panel',
};

export default function DashboardHome() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <div className="mx-auto">
                <Home />
            </div>
        </div>
    );
}