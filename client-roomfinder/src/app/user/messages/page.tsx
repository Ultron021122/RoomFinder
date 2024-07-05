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
        <div className="">
          <Sidebar expanded={true} >
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active
              alert
            />
            <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" alert />
            <SidebarItem icon={<UserCircle size={20} />} text="Users" />
            <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
            <SidebarItem icon={<Package size={20} />} text="Orders" />
            <SidebarItem icon={<Receipt size={20} />} text="Billings" />
            <hr className="my-3 border-gray-300 dark:border-gray-800" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
            <SidebarItem icon={<LifeBuoy size={20} />} text="Help" alert />
          </Sidebar>
        </div>
        <div className="w-full">
          <MessageComponent />
        </div>
      </section>
    </>
  );
}
