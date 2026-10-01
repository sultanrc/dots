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
import { ProjectSwitcher } from "@/components/project-switcher";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Submissions", url: "/dashboard/submissions", icon: FileClock },
];

type Project = { id: string; name: string; code: string | null };

export function AppSidebar({
  userName,
  userEmail,
  projects,
  activeProject,
}: {
  userName: string;
  userEmail: string;
  projects: Project[];
  activeProject: Project | null;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <ProjectSwitcher projects={projects} activeProject={activeProject} />
      </SidebarHeader>
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
        <div className="flex flex-col items-start gap-3 px-2 py-2">
          <div className="min-w-0 items-start">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 px-2 py-2">
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
