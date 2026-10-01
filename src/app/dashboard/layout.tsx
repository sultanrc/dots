import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  getCurrentUser,
  getUserProjects,
  getActiveProject,
} from "@/action/action";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, email } = await getCurrentUser();
  const projects = await getUserProjects();
  const activeProject = await getActiveProject();

  return (
    <SidebarProvider>
      <AppSidebar
        userName={name}
        userEmail={email}
        projects={projects}
        activeProject={activeProject}
      />
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
