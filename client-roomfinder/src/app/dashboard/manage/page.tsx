import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ManageComponent from "@/components/Dashboard/Manage";

export default function Manage() {
    return (
        <>
            <div className="h-full max-w-screen-2xl mx-auto">
                <div className="mx-auto">
                    <Breadcrumb pageName="Administracion" />
                    <div className="mx-auto overflow-hidden rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
                        <ManageComponent />
                    </div>
                </div>
            </div>
        </>
    );
}
