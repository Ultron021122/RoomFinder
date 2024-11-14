import MultiStepForm from "@/components/Dashboard/Properties";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Propiedades',
};

function PropertiesPage() {
  return (
    <div className="h-full max-w-screen-2xl mx-auto">
      <BreadcrumbWithCustomSeparator pageName="Propiedades" />
      <div className="mx-auto">
        <MultiStepForm />
      </div>
    </div>
  );
}

export default PropertiesPage;