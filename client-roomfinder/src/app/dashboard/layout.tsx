import DashboardLayout from "@/components/Dashboard";

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