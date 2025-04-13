'use client'

import { Bento } from "@/components/GeneralComponents/Bento";
import { ESTUDIANTE } from "@/utils/constants";
import { UserProfile } from "@/utils/interfaces";
import { useSession } from "next-auth/react";
import StudentHomePage from "./StudentHomePage";
import { Spinner } from "@nextui-org/react";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";

export default function Home() {

    const { data, status } = useSession()

    if (status === 'loading') {
        return (
            <Spinner />
        )
    }

    const userProfileData = data?.user as UserProfile
    const role = userProfileData.roleid

    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName={role === ESTUDIANTE ? "Inicio" : "Panel de Control"} />
            <aside className="mx-auto">
                <section>
                    {role === ESTUDIANTE ? (
                        <StudentHomePage />
                    ) : (
                        <Bento />
                    )}
                </section>
            </aside>
        </div>
    );
}