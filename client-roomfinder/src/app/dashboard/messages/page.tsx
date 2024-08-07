import MessageComponent from "@/components/User/messages";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function Messages() {
    return (
        <>
            <div className="h-full max-w-screen-2xl mx-auto bg-zinc-200 dark:bg-gray-900">
                <div className="mx-auto">
                    <Breadcrumb pageName="Mensajes" />

                    <div className="mx-auto overflow-hidden rounded-sm border border-stroke bg-white shadow-md dark:border-gray-950 dark:bg-gray-950">
                        <MessageComponent />
                    </div>
                </div>
            </div>
        </>
    );
}