import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Rentas',
};
  

const RentalsPage = () => {
    return(
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Rentas"/>
            <div className="mx-auto">
            </div>
        </div>
    )
}

export default RentalsPage;