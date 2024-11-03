import { SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import MessageMainComponent from "@/components/Dashboard/Messages";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Mensajes',
};

export default function Messages() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <div className="mx-auto">
                <BreadcrumbWithCustomSeparator pageName="Mensajes" />
                <div className="mx-auto">
                    <MessageMainComponent />
                </div>
            </div>
        </div>
    );
}




export function BreadcrumbWithCustomSeparator({pageName}: {pageName: string}) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center px-2 sm:justify-between">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold text-black dark:text-white">
                {pageName}
            </h2>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Panel</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <SlashIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Mensajes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
