"use client"
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname
import { BookUser, BotIcon as Robot } from "lucide-react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Education",
    items: [
      {
        title: "Digital Courses",
        image: "/icons/Digital.svg",
        href: "/main/courses",
        indent: true,
      },
    ],
    href: "/education",
  },
  {
    title: "Community",
    items: [
      {
        title: "Book a Coach",
        image: "/icons/Coach.svg",
        icon: BookUser,
        href: "/main/bookCoach",
        indent: true,
      },
    ],
    href: "/community",
  },
]

export function AppSidebar() {
  const pathname = usePathname() // Get current route

  return (
    <Sidebar style={{ backgroundColor: "#1a2235" }} className="border-0 border-transparent custom-sidebar-bg">
      <SidebarHeader className="flex bg-[#1a2235] items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.svg" className="w-38 h-30" alt="logo" width={100} height={100} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Link href="/main" className="flex flex-row items-center gap-2 px-4">
          <Image src="/ChatBot.svg" className="w-6 h-6" alt="logo" width={100} height={100} />
          <div className="text-white text-md font-semibold">AI ChatBot</div>
        </Link>
        <div className="text-[#A4A4A4] px-4">Smart Trading Assistant</div>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item, index) => (
              <div className="mt-2" key={index}>
                <div className="text-[#A4A4A4] px-2">{item.title}</div>
                {item.items.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className={cn(
                      "mx-2 mt-2 rounded-[10px]",
                      pathname === subItem.href ? "border-2 border-[#F6BE00]" : "bg-[#334155]"
                    )}
                  >
                    <Link className="flex items-center gap-2 px-4 py-2" href={subItem.href}>
                      <Image
                        src={subItem.image}
                        className="w-5 h-5"
                        alt="icon"
                        width={100}
                        height={100}
                      />
                      <span className="text-[#F6BE00] text-sm">{subItem.title}</span>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}