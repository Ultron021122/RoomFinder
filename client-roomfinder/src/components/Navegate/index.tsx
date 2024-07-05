"use client";
import { Image } from "@nextui-org/react";
import { ChevronFirst, ChevronLast, MoreVertical, Home } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ expanded: false });
export default function Sidebar({ children, expanded }: { children: React.ReactNode, expanded: boolean }) {
  //const [expanded, setExpanded] = useState(true);
  return (
    <aside>
      <nav className="h-full flex-col max-w-max bg-white dark:bg-gray-950 border-r dark:border-gray-900 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center text-gray-800 dark:text-gray-100">
          {/*
            <div
              className={`overflow-hidden transition-all flex items-center ${expanded ? "h-10" : "w-0"}`}
            >
              <Home size={20} />
              <span className="ml-2 text-lg font-medium">RoomFinder</span>
            </div>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          */}
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t border-gray-300 dark:border-gray-800 flex p-3">
          <Image
            src="https://ui-avatars.com/api/?background=60a5fa&color=3730a3&bold=true&name=SM"
            alt="User"
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
                Sebastián Martínez
              </h4>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                sebastian@gmail.com
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
}: {
  icon: any;
  text: any;
  active?: any;
  alert?: any;
}) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            z-50
            ${active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 dark:from-indigo-700 dark:to-indigo-800 text-indigo-800 dark:text-indigo-100"
          : "hover:bg-indigo-50 dark:hover:bg-indigo-900 text-gray-600 dark:text-gray-400"
        }
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
      {alert && (
        <div
          className={`
                    absolute right-2 w-2 h-2 rounded bg-indigo-400 dark:bg-blue-400
                    ${expanded ? "" : "top-2"}
                    `}
        />
      )}
      {!expanded && (
        <div
          className={`
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-indigo-100 text-indigo-800 text-sm
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
