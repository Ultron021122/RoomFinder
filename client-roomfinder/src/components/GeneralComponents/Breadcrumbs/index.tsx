import { SlashIcon } from "@radix-ui/react-icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbWithCustomSeparator({ pageName }: { pageName: string }) {
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
                        <BreadcrumbPage>{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}