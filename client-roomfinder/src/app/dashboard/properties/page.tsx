import PropertiesComponent from "@/components/Dashboard/PanelProperty";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Propiedades',
};

function PropertiesPage() {
    return (
        <>
            <div className="h-full max-w-screen-2xl mx-auto">
                <div className="mx-auto">
                   <BreadcrumbWithCustomSeparator pageName="Propiedades" />
                    <div className="mx-auto rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
                        <PropertiesComponent />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PropertiesPage;
