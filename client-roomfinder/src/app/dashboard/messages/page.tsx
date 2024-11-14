import MessageMainComponent from "@/components/Dashboard/Messages";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Mensajes',
};

export default function Messages() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Mensajes" />
            <div className="mx-auto">
                <MessageMainComponent />
            </div>
        </div>
    );
}





