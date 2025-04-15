<<<<<<< HEAD
=======
import RentalHistory from "@/components/Dashboard/rental-history";
import Rentals from "@/components/Dashboard/rentals"
>>>>>>> 212ad3faf3abc32a1a1caea6754e2b16f535305b
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
<<<<<<< HEAD
=======
                <RentalHistory/>
>>>>>>> 212ad3faf3abc32a1a1caea6754e2b16f535305b
            </div>
        </div>
    )
}

export default RentalsPage;