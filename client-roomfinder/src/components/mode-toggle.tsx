"use client"

import * as React from "react"
import { SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon } from "lucide-react"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white shadow-none hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 text-neutral-900 dark:text-neutral-100" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-neutral-900 dark:text-neutral-100 hover:bg-gray-100">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="dark:hover:bg-gray-800"
        >
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="dark:hover:bg-gray-800"
        >
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="dark:hover:bg-gray-800"
        >
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
