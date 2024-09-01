"use client";
import { Image } from "@nextui-org/react";
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import { MoreVertical } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { rolesMapping } from "@/utils/constants";
import { shortName } from "@/utils/functions";
import Link from 'next/link';
import { SidebarProps, SidebarUserProps } from "@/utils/interfaces";

const SidebarContext = createContext({ expanded: false });
export default function Sidebar({ children, expanded, onResize }: SidebarProps) {
  //const [expanded, setExpanded] = useState(true);
  const { data: session } = useSession();
  const user = session?.user as SidebarUserProps;
  const roleName = rolesMapping[user?.roleid] || 'Desconocido';

  useEffect(() => {
    function handleResize(){
      onResize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onResize]);

  return (
    <aside>
      <nav className="h-full flex-col max-w-max bg-white dark:bg-gray-950 border-r dark:border-gray-900 shadow-sm">
        <div className="pb-3 flex justify-between items-center text-gray-800 dark:text-gray-100">{/* p-4 */}
          {/*
          <div
            className={`overflow-hidden transition-all flex items-center ${expanded ? "h-10" : "w-0"}`}
          >
             //<Home size={20} />
            <span className="text-lg font-medium">Regresar atras </span>
          </div>
          <button
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut size={20} />
            {/*expanded ? <ChevronFirst /> : <ChevronLast />
          </button>
          */}
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 z-30">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t border-gray-300 dark:border-gray-800 flex p-3">
          <Image
            //src="https://ui-avatars.com/api/?background=60a5fa&color=3730a3&bold=true&name=SM"
            src={user?.vchimage}
            alt={user?.vchname}
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
                        flex justify-between items-center
                        overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
                        `}
          >
            <div className="leading-4">
              <h4 className="font-semibold dark:text-gray-300">
                {
                  shortName({
                    vchname: user?.vchname,
                    vchpaternalsurname: user?.vchpaternalsurname,
                    vchmaternalsurname: user?.vchmaternalsurname
                  })
                }
              </h4>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {user?.vchemail}
              </span>
            </div>
            <MoreVertical
              size={20}
              className="text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  url,
}: {
  icon: any;
  text: any;
  active?: any;
  alert?: any;
  url: string;
}) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  return (
    <li
      className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            z-50
            ${pathname === url
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 dark:from-blue-700 dark:to-blue-800"
          : "hover:bg-indigo-50 dark:hover:bg-blue-900"
        }
        `}
    >
      <Link
        href={`${url}`}
        className={`
            ${pathname === url
            ? "text-blue-800 dark:text-indigo-100"
            : "text-gray-600 dark:text-gray-400"
          }
          flex
        `}
      >
        {icon}
        <span
          className={`
                overflow-hidden transition-all 
                ${expanded ? "w-52 ml-3" : "w-0"}
                `}
        >
          {text}
        </span>
      </Link>
      {alert && (
        <div
          className={`
                    absolute right-2 w-2 h-2 rounded bg-blue-400 dark:bg-indigo-400
                    ${expanded ? "" : "top-2"}
                    `}
        />
      )}
      {!expanded && (
        <div
          className={`
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-indigo-100 text-blue-800 text-sm
                    invisible opacity-20 -translate-x-3 transition-all
                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
