import Profile from "@/components/Dashboard/Profile";
import { Metadata } from "next";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";

export const metadata: Metadata = {
    title: 'Perfil',
};

function ProfilePage() {
  return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Perfil" />
            <div className="mx-auto">
                <Profile />
            </div>
        </div>
  );
}

export default ProfilePage;
