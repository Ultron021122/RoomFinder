import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { Metadata } from "next";
import PaymentHistory from "@/components/Dashboard/payments";

export const metadata: Metadata = {
    title: 'Pagos',
};

const PaymentsPage = () => {
    return(
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Pagos" />
            <div className="mx-auto">
                <PaymentHistory/>
            </div>
        </div>
    )
}

export default PaymentsPage