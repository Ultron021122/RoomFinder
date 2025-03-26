import RequestComponent from "@/components/Dashboard/panel-request";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { RequestProvider } from "@/contexts/request-context";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Solicitudes',
};

function RequestsPage() {
    return (
        <>
            <RequestProvider>
                <div className="h-full max-w-screen-2xl mx-auto">
                    <div className="mx-auto">
                        <BreadcrumbWithCustomSeparator pageName="Solicitudes" />
                        <div className="mx-auto rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
                            <RequestComponent />
                        </div>
                    </div>
                </div>
            </RequestProvider>
        </>
    );
}

export default RequestsPage;