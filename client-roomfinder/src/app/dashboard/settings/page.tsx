'use client';
import Home from "@/components/Dashboard/Home";
import AppHome from '@/components/App/Home';
import { useSession } from 'next-auth/react';
import { rolesMapping, role } from "@/utils/constants";
import { UserProfile } from "@/utils/interfaces";

export default function Settings() {
    const { data: session } = useSession();
    const user = session?.user as UserProfile;
    const roleName = rolesMapping[user?.roleid] || 'Estudiante';

    const renderComponent = () => {
        switch (roleName) {
            case role[0].vchname:
                return <AppHome />;
            case role[1].vchname:
                return <Home />;
            default:
                return <Home />; // Default component if no role matches
        }
    };

    return (
        <div>
            {renderComponent()}
        </div>
    );
}
