"use client";

import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";
import Link from 'next/link';
import { SidebarUserProps } from "@/utils/interfaces";
import Dropdown from './dropdown';
import { shortName } from '@/utils/functions';
import useDropdownStore from '@/stores/useDropdownStore';
import { rolesMapping } from '@/utils/constants';

interface SidebarProps {
  children: React.ReactNode;
  expanded: boolean;
}

const SidebarContext = createContext({ expanded: false });
export default function Sidebar({ children, expanded }: SidebarProps) {

  return (
    <aside>
      <nav className="h-full flex-col max-w-max bg-gray-100 border-gray-300 dark:bg-gray-950 border-r dark:border-gray-900 shadow-sm">
        <div className="pb-3 flex justify-between items-center text-gray-800 dark:text-gray-100">
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 z-30">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside >
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text?: string;
  vchname?: string;
  vchpaternalsurname?: string;
  vchmaternalsurname?: string;
  color?: 'active' | 'inactive' | 'alert';
  alert?: boolean;
  url: string;
  onClickSidebar?: () => void;
  dropdownItems?: { icon?: React.ReactNode; text: string; link?: string; onClick?: () => void }[]; // Define la estructura de los elementos del dropdown
}

export function SidebarItem({
  icon,
  text,
  vchname,
  vchpaternalsurname,
  vchmaternalsurname,
  color,
  alert,
  url,
  onClickSidebar,
  dropdownItems
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const { toggleDropdown } = useDropdownStore();
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as SidebarUserProps;
  const roleName = rolesMapping[user?.roleid] || 'Desconocido';

  return (
    <li className={`relative flex items-center justify-center my-1 font-medium rounded-md cursor-pointer transition-colors group z-50 ${pathname === url ? "bg-gradient-to-tr from-blue-200 to-blue-100 dark:from-blue-700 dark:to-blue-800" : "hover:bg-blue-50 dark:hover:bg-blue-900"}`} onClick={onClickSidebar}>
      {!dropdownItems ? (
        <Link href={url} className={`${pathname === url ? "px-3 py-2 text-blue-800 dark:text-blue-100" : "px-3 py-2 text-gray-600 dark:text-gray-400"} flex`}>
          {icon}
          <span className={`overflow-hidden transition-all text-sm ${expanded ? "w-52 ml-3" : "w-0"}`}>
            {text}
          </span>
        </Link>
      ) : (
        /* Dropdown para el SidebarItem */
        <div
          className={`px-3 py-2 text-gray-600 dark:text-gray-400 flex`}
          onClick={onClickSidebar}
        >
          <Dropdown
            usuarioName={
              shortName({
                vchname: user?.vchname,
                vchpaternalsurname: user?.vchpaternalsurname,
                vchmaternalsurname: user?.vchmaternalsurname
              }) as string
            }
            vchemail={user?.vchemail as string}
            vchimage={user?.vchimage as string}
            items={dropdownItems}
          />
          <div
            className={`overflow-hidden whitespace-nowrap transition-all flex flex-col ${expanded ? "w-52 ml-3" : "w-0"}`}
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic propague al contenedor principal
              toggleDropdown();
            }}
          >
            <p
              className='text-xs sm:text-sm'
            >
              {vchname + ' ' + vchpaternalsurname + ' ' + vchmaternalsurname}
            </p>
            <span className='text-xs'>
              {roleName}
            </span>
          </div>
        </div>
      )}
      {!dropdownItems && !expanded &&
        <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-blue-100 text-blue-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
          {text}
        </div>
      }

      {alert && (
        <div
          className={`absolute ${dropdownItems ? 'right-3' : 'right-4'} w-2 h-2 rounded ${color === 'active' ? 'bg-green-600 dark:bg-green-500' : color === 'inactive' ? 'bg-red-600 dark:bg-red-500' : 'bg-blue-400 dark:bg-blue-400'} ${expanded ? "" : "top-2"}`}
        />
      )}
    </li>
  );
}