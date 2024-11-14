import { Bento } from "@/components/GeneralComponents/Bento";

export default function Home() {
    return (
        <div className="h-full max-w-screen-2xl mx-auto dark:bg-gray-900">
            <aside className="mx-auto">
                <section>
                    <Bento />
                </section>
            </aside>
        </div>
    );
}