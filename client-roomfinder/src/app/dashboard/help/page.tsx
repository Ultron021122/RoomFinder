import FormularioPropiedad from "@/components/Dashboard/help";
import { PropertyForm } from "@/components/Form/Prueba";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";

function Help() {
  return (
    <>
      {/* Some modifications */}
      <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
        <div className="mx-auto">
          <BreadcrumbWithCustomSeparator pageName="Ayuda" />
          <div className="mx-auto">
            {/* <FormularioPropiedad /> */}
            <PropertyForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default Help;
