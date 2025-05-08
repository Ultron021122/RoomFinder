import OrderComponent from "@/components/Dashboard/payments-orders";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";
import { OrderProvider } from "@/contexts/orders-context";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Ordenes de pago',
};

function RequestsPage() {
  return (
    <>
      <OrderProvider>
        <div className="h-full max-w-screen-2xl mx-auto">
          <div className="mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Ordenes de pago" />
            <div className="mx-auto rounded-sm border border-stroke bg-white dark:bg-transparent dark:border-transparent shadow-md">
              <OrderComponent/>
            </div>
          </div>
        </div>
      </OrderProvider >
    </>
  );
}

export default RequestsPage;