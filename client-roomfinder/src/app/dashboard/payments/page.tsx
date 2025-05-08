import PaymentOrders from '@/components/Dashboard/payments-orders';
import { BreadcrumbWithCustomSeparator } from '@/components/GeneralComponents/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ordenes de pago',
};

export default function PaymentsOrders() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto">
            <BreadcrumbWithCustomSeparator pageName="Órdenes de pago" />
            <div className="mx-auto">
                {/* Componente */}
                {/* <PaymentOrders /> */}
            </div>
        </div>
    );
};