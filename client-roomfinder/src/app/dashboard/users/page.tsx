import UsersComponent from "@/components/Dashboard/panel-user";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { UserProvider } from "@/contexts/user-context";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Usuarios',
};

function UsersPage() {
    return (
        <>
            <UserProvider>
                <div className="h-full max-w-screen-2xl mx-auto">
                    <div className="mx-auto">
                        <BreadcrumbWithCustomSeparator pageName="Usuarios" />
                        <div className="mx-auto rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
                            <UsersComponent />
                        </div>
                    </div>
                </div>
            </UserProvider>
        </>
    );
}

export default UsersPage;
