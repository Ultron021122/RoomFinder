import MessageComponent from "@/components/User/messages";
import Sidebar, { SidebarItem } from "@/components/Navegate";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Receipt,
  Settings,
  UserCircle,
} from "lucide-react";

export default function Messages() {
  return (
    <>
      <section className="flex">
        {/*
        <div className="">
          <Sidebar expanded={true} onResize={toggleSidebar}>
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              url="/dashboard/home"
              alert
            />
            <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" url="/dashboard/home" alert />
            <SidebarItem icon={<UserCircle size={20} />} text="Users" url="/dashboard/home" />
            <SidebarItem icon={<Boxes size={20} />} text="Inventory" url="/dashboard/home" />
            <SidebarItem icon={<Package size={20} />} text="Orders" url="/dashboard/home" />
            <SidebarItem icon={<Receipt size={20} />} text="Billings" url="/dashboard/home" />
            <hr className="my-3 border-gray-300 dark:border-gray-800" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" url="/dashboard/home" />
            <SidebarItem icon={<LifeBuoy size={20} />} text="Help" url="/dashboard/home" alert />
          </Sidebar>
        </div>
        */}
        <div className="w-full">
          <MessageComponent />
        </div>
      </section>
    </>
  );
}
