import History from "@/components/Dashboard/history";
import { BreadcrumbWithCustomSeparator } from "@/components/GeneralComponents/Breadcrumbs";

const HistoryPage = () => {
    return(
    <div className="h-full max-w-screen-2xl mx-auto">
        <BreadcrumbWithCustomSeparator pageName="Historial"/>
        <div className="mx-auto">
            <History />
        </div>
    </div>
    )
}

export default HistoryPage;