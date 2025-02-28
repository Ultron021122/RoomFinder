import DashboardLayout from "@/components/Dashboard/layout";

export default function DashboardApp(
    {
        children,
    }: {
        children: React.ReactNode;
    }
) {
    return (
        <DashboardLayout>
                {children}
        </ DashboardLayout>
    );
}