import Publish from "@/components/Dashboard/Publish";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Publicar',
};

function PublishPage() {
  return (
    <div className="h-full max-w-screen-2xl mx-auto">
      <BreadcrumbWithCustomSeparator pageName="Propiedades" />
      <div className="mx-auto">
        <Publish />
      </div>
    </div>
  );

}

export default PublishPage;