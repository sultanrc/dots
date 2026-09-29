"use client";

import { LayoutDashboard, FileClock, FileText } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LogoutButton } from "@/components/logout-button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Submissions",
    url: "/dashboard/submissions",
    icon: FileClock,
  },
  // {
  //   title: "EDL",
  //   url: "/dashboard/edl",
  //   icon: FileText,
  // },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooter>
          <div className="flex flex-col items-start gap-3 px-2 py-2 ">
            <div className="min-w-0 items-start">
              <p className="truncate text-sm font-medium">User</p>
              <p className="truncate text-xs text-muted-foreground">
                user@gmail.com
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 px-2 py-2">
            <LogoutButton />
          </div>
        </SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
