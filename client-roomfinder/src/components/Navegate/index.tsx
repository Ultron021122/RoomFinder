"use client";
import { Image } from "@nextui-org/react";
import { ChevronFirst, ChevronLast, MoreVertical, Home } from "lucide-react";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ expanded: false });
export default function Sidebar({ children }: { children: any }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="h-[calc(100vh-73px)]">
      <nav className="h-full flex-col max-w-max bg-white dark:bg-gray-950 border-r dark:border-gray-900 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center text-gray-800 dark:text-gray-100">
          <div
            className={`overflow-hidden transition-all flex items-center ${expanded ? "h-10" : "w-0"}`}
          >
            {/* <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 341.000000 333.000000"
                            className="w-10 h-10"
                            preserveAspectRatio="xMidYMid meet"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <g transform="translate(0.000000,333.000000) scale(0.100000,-0.100000)"
                                fill="currentColor" stroke="currentColor">
                                <path d="M1584 3162 c-16 -16 -157 -152 -314 -303 -157 -151 -503 -483 -768
-738 -309 -296 -482 -470 -480 -480 3 -14 35 -16 281 -19 l277 -2 0 -590 0
-590 978 2 977 3 3 588 2 587 269 0 c225 0 271 2 281 15 13 16 10 19 -372 418
l-168 174 0 246 c0 199 -3 246 -14 250 -32 13 -36 -15 -36 -264 l0 -246 260
-271 261 -272 -263 -2 -263 -3 -5 -590 -5 -590 -927 -3 -928 -2 0 582 c0 321
-4 589 -8 595 -6 9 -74 13 -261 15 l-254 3 513 495 c892 860 995 960 1000 959
3 -1 113 -115 245 -254 132 -140 247 -254 256 -254 26 -1 29 19 29 170 l0 139
184 0 c192 0 216 3 216 26 0 22 -33 25 -245 22 l-200 -3 -5 -139 -5 -138 -234
246 c-128 135 -237 246 -241 246 -4 0 -21 -13 -36 -28z"/>
                                <path d="M1780 2171 c-87 -28 -158 -90 -201 -173 -32 -61 -38 -186 -13 -265
25 -81 117 -174 194 -197 215 -64 414 70 428 288 9 139 -52 255 -167 319 -46
26 -67 31 -135 34 -45 1 -92 -1 -106 -6z m191 -167 c43 -40 59 -82 59 -156 0
-105 -55 -175 -143 -185 -65 -8 -126 23 -157 80 -35 62 -34 156 3 219 34 59
75 80 150 75 47 -3 63 -9 88 -33z"/>
                                <path d="M950 1851 l0 -321 75 0 74 0 3 123 3 122 94 -122 94 -123 94 0 94 0
-111 132 -110 132 27 14 c44 23 64 44 84 87 40 87 13 192 -62 242 -41 27 -47
28 -201 31 l-158 4 0 -321z m257 184 c25 -18 34 -59 21 -97 -13 -35 -35 -48
-87 -48 l-41 0 0 80 0 80 43 0 c23 0 52 -7 64 -15z"/>
                                <path d="M1132 1434 c-60 -22 -146 -104 -179 -172 -24 -49 -28 -69 -28 -142 0
-71 4 -94 26 -141 55 -117 148 -179 279 -187 97 -5 170 21 235 84 70 68 100
140 100 244 0 71 -5 94 -27 141 -30 66 -89 129 -150 160 -56 29 -192 36 -256
13z m199 -147 c101 -67 105 -259 6 -331 -42 -31 -140 -29 -185 2 -49 35 -66
76 -67 157 0 83 24 138 75 173 46 31 124 30 171 -1z"/>
                                <path d="M1720 1426 c0 -8 -11 -139 -25 -292 -14 -152 -25 -290 -25 -306 l0
-28 69 0 70 0 5 53 c3 28 11 113 17 187 6 74 12 136 13 137 1 1 31 -82 67
-185 l65 -187 44 0 44 0 66 187 c35 102 66 186 67 184 1 -1 7 -62 13 -136 5
-74 13 -159 16 -187 l5 -53 73 0 72 0 -28 298 c-15 163 -27 307 -28 320 0 21
-4 22 -79 22 l-79 0 -36 -92 c-19 -51 -51 -133 -69 -182 -19 -48 -37 -84 -40
-78 -4 5 -33 79 -66 163 -32 85 -62 162 -66 172 -6 14 -20 17 -86 17 -62 0
-79 -3 -79 -14z"/>
                                <path d="M1415 205 l0 -135 33 0 32 0 0 55 0 55 46 0 c44 0 45 1 42 28 -3 24
-7 27 -45 30 -34 3 -43 7 -43 22 0 15 9 19 48 22 43 3 47 5 50 31 l3 27 -83 0
-83 0 0 -135z"/>
                                <path d="M1600 205 l0 -135 35 0 35 0 0 135 0 135 -35 0 -35 0 0 -135z" />
                                <path d="M1700 205 l0 -135 35 0 34 0 3 77 3 78 48 -78 c45 -72 51 -77 83 -77
l34 0 0 135 0 135 -35 0 -35 0 0 -77 0 -78 -51 78 c-46 72 -52 77 -84 77 l-35
0 0 -135z"/>
                                <path d="M1970 205 l0 -135 60 0 c36 0 74 7 91 15 62 32 87 121 54 186 -25 47
-70 69 -142 69 l-63 0 0 -135z m130 55 c40 -40 12 -130 -40 -130 -18 0 -20 7
-20 75 0 68 2 75 20 75 11 0 29 -9 40 -20z"/>
                                <path d="M2214 205 l1 -135 78 0 77 0 0 30 c0 29 -2 30 -45 30 -41 0 -45 2
-45 25 0 23 4 25 46 25 44 0 45 1 42 28 -2 15 -9 28 -15 28 -7 1 -26 2 -43 3
-23 1 -30 6 -30 21 0 17 7 20 45 20 43 0 45 1 45 30 l0 30 -78 0 -78 0 0 -135z"/>
                                <path d="M2404 205 l0 -135 33 0 33 0 0 51 0 51 40 -51 c37 -46 44 -51 81 -51
l41 0 -45 54 -46 53 24 23 c33 31 34 90 3 120 -18 16 -35 20 -93 20 l-71 0 0
-135z m114 56 c4 -23 -11 -41 -35 -41 -8 0 -13 14 -13 36 0 31 3 35 23 32 14
-2 23 -11 25 -27z"/>
                            </g>
                        </svg> */}
            <Home size={20} />
            <span className="ml-2 text-lg font-medium">RoomFinder</span>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
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
            ${
              active
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
