import ManageComponent from "@/components/Dashboard/Manage";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Administracion',
};

export default function Manage() {
    return (
        <>
            <div className="h-full max-w-screen-2xl mx-auto">
                <div className="mx-auto">
                   <BreadcrumbWithCustomSeparator pageName="Administracion" />
                    <div className="mx-auto rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
                        <ManageComponent />
                    </div>
                </div>
            </div>
        </>
    );
}
