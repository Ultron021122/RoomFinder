import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Profile from "@/components/Dashboard/Profile";
import { SlashIcon } from "@radix-ui/react-icons";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Perfil',
};


function BreadcrumbWithCustomSeparator({ pageName }: { pageName: string }) {
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
                      <BreadcrumbPage>Perfil</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
      </div>
  );
}

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
