"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="theme-toggle-button h-9 w-9">
          <Sun className="theme-toggle-light-icon h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="theme-toggle-dark-icon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-toggle-dropdown">
        <DropdownMenuItem onClick={() => setTheme("light")} className="theme-toggle-light-option">
          <Sun className="theme-toggle-light-option-icon mr-2 h-4 w-4" />
          <span className="theme-toggle-light-option-text">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="theme-toggle-dark-option">
          <Moon className="theme-toggle-dark-option-icon mr-2 h-4 w-4" />
          <span className="theme-toggle-dark-option-text">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="theme-toggle-system-option">
          <Monitor className="theme-toggle-system-option-icon mr-2 h-4 w-4" />
          <span className="theme-toggle-system-option-text">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 