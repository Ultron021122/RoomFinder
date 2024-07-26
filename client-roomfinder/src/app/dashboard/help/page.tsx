import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function Help() {
  return (
    <>
      {/* Some modifications */}
      <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
        <div className="mx-auto">
          <Breadcrumb pageName="Ayuda" />
        </div>
      </div>
    </>
  );
}

export default Help;
